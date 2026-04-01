from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from app.database import get_db
from app.models import Product, Order, OrderItem
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Get aggregated dashboard statistics"""
    total_revenue = db.query(func.coalesce(func.sum(Order.total_price), 0)).scalar()
    total_orders = db.query(func.count(Order.id)).scalar()
    total_products = db.query(func.count(Product.id)).scalar()
    pending_orders = db.query(func.count(Order.id)).filter(Order.status == "pending").scalar()
    delivered_orders = db.query(func.count(Order.id)).filter(Order.status == "delivered").scalar()
    avg_order_value = db.query(func.coalesce(func.avg(Order.total_price), 0)).scalar()

    return {
        "total_revenue": round(float(total_revenue), 2),
        "total_orders": total_orders,
        "total_products": total_products,
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders,
        "avg_order_value": round(float(avg_order_value), 2),
    }


@router.get("/sales-trend")
def get_sales_trend(days: int = 14, db: Session = Depends(get_db)):
    """Get daily revenue for the last N days"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    results = (
        db.query(
            cast(Order.created_at, Date).label("date"),
            func.sum(Order.total_price).label("revenue"),
            func.count(Order.id).label("orders"),
        )
        .filter(Order.created_at >= start_date)
        .group_by(cast(Order.created_at, Date))
        .order_by(cast(Order.created_at, Date))
        .all()
    )

    # Fill in missing dates with zero
    trend = []
    current = start_date.date()
    end = datetime.utcnow().date()
    result_map = {str(r.date): {"revenue": float(r.revenue), "orders": r.orders} for r in results}

    while current <= end:
        date_str = str(current)
        if date_str in result_map:
            trend.append({"date": date_str, **result_map[date_str]})
        else:
            trend.append({"date": date_str, "revenue": 0, "orders": 0})
        current += timedelta(days=1)

    return trend


@router.get("/top-products")
def get_top_products(limit: int = 5, db: Session = Depends(get_db)):
    """Get top-selling products by quantity"""
    results = (
        db.query(
            Product.id,
            Product.name,
            Product.emoji,
            Product.category,
            Product.price,
            func.coalesce(func.sum(OrderItem.quantity), 0).label("total_sold"),
            func.coalesce(func.sum(OrderItem.quantity * OrderItem.price), 0).label("total_revenue"),
        )
        .outerjoin(OrderItem, Product.id == OrderItem.product_id)
        .group_by(Product.id, Product.name, Product.emoji, Product.category, Product.price)
        .order_by(func.coalesce(func.sum(OrderItem.quantity), 0).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": r.id,
            "name": r.name,
            "emoji": r.emoji,
            "category": r.category,
            "price": r.price,
            "total_sold": int(r.total_sold),
            "total_revenue": round(float(r.total_revenue), 2),
        }
        for r in results
    ]


@router.get("/category-breakdown")
def get_category_breakdown(db: Session = Depends(get_db)):
    """Get order breakdown by product category"""
    results = (
        db.query(
            Product.category,
            func.count(OrderItem.id).label("order_count"),
            func.coalesce(func.sum(OrderItem.quantity * OrderItem.price), 0).label("revenue"),
        )
        .outerjoin(OrderItem, Product.id == OrderItem.product_id)
        .group_by(Product.category)
        .all()
    )

    return [
        {
            "category": r.category,
            "order_count": r.order_count,
            "revenue": round(float(r.revenue), 2),
        }
        for r in results
    ]
