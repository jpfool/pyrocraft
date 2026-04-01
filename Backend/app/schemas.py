from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Product Schemas
class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    description: str
    emoji: Optional[str] = None
    original_price: Optional[float] = None
    badge: Optional[str] = None

class ProductCreate(ProductBase):
    image_url: Optional[str] = None
    stock: int = 100

class ProductResponse(ProductBase):
    id: int
    image_url: Optional[str] = None
    stock: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class PaginatedProductResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    size: int
    pages: int

# Order Schemas
class CartItem(BaseModel):
    product_id: int
    quantity: int
    price: float

class CustomerDetails(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    pincode: str
    special_instructions: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[CartItem]
    customer: CustomerDetails

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: float
    product: ProductResponse
    
    class Config:
        from_attributes = True

class OrderTrackingResponse(BaseModel):
    status: str
    message: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_number: str
    name: str
    email: str
    phone: str
    address: str
    total_price: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse]
    tracking: List[OrderTrackingResponse]
    
    class Config:
        from_attributes = True

class OrderDetailResponse(OrderResponse):
    pass

# Tracking Schema
class TrackingResponse(BaseModel):
    order_number: str
    customer_name: str
    total_price: float
    status: str
    items: List[OrderItemResponse]
    tracking_history: List[OrderTrackingResponse]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Settings Schemas
class SettingsBase(BaseModel):
    company_name: str
    marquee_text: str
    contact_email: str
    contact_phone: str

class SettingsResponse(SettingsBase):
    id: int
    updated_at: datetime
    
    class Config:
        from_attributes = True

class SettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    marquee_text: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


# Review Schemas
class ReviewBase(BaseModel):
    customer_name: str
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    order_id: Optional[int] = None

class ReviewResponse(ReviewBase):
    id: int
    is_approved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReviewModerate(BaseModel):
    is_approved: bool


# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


# Auth Schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict
