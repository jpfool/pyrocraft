from twilio.rest import Client
from app.config import settings
from datetime import datetime

def send_whatsapp_notification(order, status_changed=False):
    """Send WhatsApp notification about order"""
    
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        print("Twilio credentials not configured")
        return
    
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
    # Format phone number with country code
    phone_number = f"+91{order.phone[-10:]}"  # India +91
    
    if status_changed:
        # Status update message
        status_messages = {
            "confirmed": "✅ Your order has been confirmed!",
            "processing": "🔄 Your order is being processed.",
            "shipped": "🚚 Your order is on the way!",
            "delivered": "✅ Your order has been delivered!",
            "cancelled": "❌ Your order has been cancelled."
        }
        
        message_text = f"""
🎆 PYROCRAFT - Order Update

Order ID: {order.order_number}
Status: {status_messages.get(order.status, order.status)}

Track: {settings.FRONTEND_URL}/track/{order.order_number}

Thank you! 🙏
        """
    else:
        # Order confirmation message
        items_list = "\n".join([f"• {item.product.name} x{item.quantity}" for item in order.items])
        
        message_text = f"""
🎆 PYROCRAFT - Order Confirmed!

Order #: {order.order_number}
Total: ₹{order.total_price:,.2f}

Items:
{items_list}

Track your order:
{settings.FRONTEND_URL}/track/{order.order_number}

Thank you for celebrating with us! 🎇
        """
    
    try:
        message = client.messages.create(
            from_=f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}",
            body=message_text,
            to=f"whatsapp:{phone_number}"
        )
        print(f"WhatsApp message sent: {message.sid}")
        return True
    except Exception as e:
        print(f"Error sending WhatsApp message: {e}")
        return False
