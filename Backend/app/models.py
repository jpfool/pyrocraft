from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(50))
    emoji = Column(String(10))
    image_url = Column(String(500))
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    description = Column(Text)
    badge = Column(String(20), nullable=True)
    stock = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order_items = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    name = Column(String(255), nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(10))
    total_price = Column(Float, nullable=False)
    status = Column(String(50), default="pending")  # pending, confirmed, processing, shipped, delivered
    special_instructions = Column(Text, nullable=True)
    whatsapp_sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    tracking = relationship("OrderTracking", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class OrderTracking(Base):
    __tablename__ = "order_tracking"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    status = Column(String(50), nullable=False)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order = relationship("Order", back_populates="tracking")


class Settings(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), default="PYROCRAFT")
    marquee_text = Column(Text, default="Free Shipping Above ₹2000 ✦ Premium Quality ✦ Festival Ready ✦ Handcrafted Excellence ✦ Safe & Certified")
    contact_email = Column(String(255), default="support@pyrocraft.in")
    contact_phone = Column(String(20), default="+919876543210")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    customer_name = Column(String(255), nullable=False)
    rating = Column(Integer, default=5)
    comment = Column(Text)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(20), default="user")  # admin, user
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
