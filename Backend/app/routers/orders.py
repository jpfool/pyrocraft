from typing import List
from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Order, OrderItem, OrderTracking, Product
from app.schemas import OrderCreate, OrderResponse, TrackingResponse
from app.utils.notifications import send_whatsapp_notification
from app.utils.pdf_generator import generate_invoice_pdf, generate_order_summary_pdf
from fastapi.responses import StreamingResponse
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/orders", tags=["orders"])

def generate_order_number():
    """Generate unique order number"""
    return f"PYR-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"

@router.get("/export/summary")
def export_orders_summary(db: Session = Depends(get_db)):
    """Export all orders as a PDF summary"""
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    pdf_buffer = generate_order_summary_pdf(orders)
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=User_Orders_Summary.pdf"}
    )

@router.post("/", response_model=OrderResponse)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order"""
    
    # Generate order number
    order_number = generate_order_number()
    
    # Calculate total
    total_price = sum(item.price * item.quantity for item in order_data.items)
    
    # Create order
    order = Order(
        order_number=order_number,
        email=order_data.customer.email,
        phone=order_data.customer.phone,
        name=order_data.customer.name,
        address=order_data.customer.address,
        city=order_data.customer.city,
        state=order_data.customer.state,
        pincode=order_data.customer.pincode,
        total_price=total_price,
        status="pending",
        special_instructions=order_data.customer.special_instructions
    )
    
    # Add order items
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        order_item = OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        order.items.append(order_item)
    
    # Add initial tracking
    tracking = OrderTracking(
        status="pending",
        message="Order confirmed! We'll process it shortly."
    )
    order.tracking.append(tracking)
    
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Send WhatsApp notification
    try:
        send_whatsapp_notification(order)
        order.whatsapp_sent_at = datetime.utcnow()
        db.commit()
    except Exception as e:
        print(f"WhatsApp notification failed: {e}")
    
    return order

@router.get("/phone/{phone_number}/tracking", response_model=List[TrackingResponse])
def track_orders_by_phone(phone_number: str, db: Session = Depends(get_db)):
    """Get all order tracking information for a specific mobile number"""
    orders = db.query(Order).filter(Order.phone == phone_number).order_by(Order.created_at.desc()).all()
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found for this mobile number")
    
    return [
        TrackingResponse(
            order_number=o.order_number,
            customer_name=o.name,
            total_price=o.total_price,
            status=o.status,
            items=o.items,
            tracking_history=o.tracking,
            created_at=o.created_at
        )
        for o in orders
    ]

@router.get("/{order_number}", response_model=OrderResponse)

def get_order(order_number: str, db: Session = Depends(get_db)):
    """Get order by order number"""
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/{order_number}/tracking", response_model=TrackingResponse)
def track_order(order_number: str, db: Session = Depends(get_db)):
    """Get order tracking information"""
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return TrackingResponse(
        order_number=order.order_number,
        customer_name=order.name,
        total_price=order.total_price,
        status=order.status,
        items=order.items,
        tracking_history=order.tracking,
        created_at=order.created_at
    )

@router.put("/{order_number}/status")
def update_order_status(
    order_number: str,
    new_status: str,
    message: str = None,
    db: Session = Depends(get_db)
):
    """Update order status (Admin only)"""
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    old_status = order.status
    order.status = new_status
    order.updated_at = datetime.utcnow()
    
    # Add tracking entry
    tracking = OrderTracking(
        order_id=order.id,
        status=new_status,
        message=message or f"Order status updated to {new_status}"
    )
    db.add(tracking)
    db.commit()
    
    # Send WhatsApp notification about status change
    try:
        send_whatsapp_notification(order, status_changed=True)
    except Exception as e:
        print(f"WhatsApp notification failed: {e}")
    
    return {"order_number": order_number, "new_status": new_status}

@router.get("/")
def list_orders(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """List all orders (Admin)"""
    orders = db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders

@router.get("/{order_id_or_number}/invoice")
def get_order_invoice(order_id_or_number: str, db: Session = Depends(get_db)):
    """Generate PDF invoice for an order (supports ID or Order Number)"""
    # Try by order number first
    order = db.query(Order).filter(Order.order_number == order_id_or_number).first()
    
    # Try by ID if not found and it looks like an integer
    if not order and order_id_or_number.isdigit():
        order = db.query(Order).filter(Order.id == int(order_id_or_number)).first()
        
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    pdf_buffer = generate_invoice_pdf(order, order.items)
    clean_name = "".join(c for c in order.name if c.isalnum() or c in (' ', '_')).strip().replace(' ', '_')
    filename = f"Invoice_{clean_name}_{order.order_number}.pdf"
    
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


