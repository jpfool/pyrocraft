from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product
from app.schemas import ProductResponse, ProductCreate, PaginatedProductResponse
from typing import List

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("", response_model=PaginatedProductResponse)
@router.get("/", response_model=PaginatedProductResponse)
def get_products(
    category: str = Query(None),
    search: str = Query(None),
    sort_by: str = Query("default"),
    skip: int = Query(0),
    limit: int = Query(20),
    db: Session = Depends(get_db)
):
    """Get all products with optional filters"""
    query = db.query(Product)
    
    if category and category != "all":
        query = query.filter(Product.category == category)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_term)) | 
            (Product.description.ilike(search_term))
        )
    
    # Sorting
    if sort_by == "price-asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price-desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "name":
        query = query.order_by(Product.name.asc())
    
    # Get total count for metadata
    total = query.count()
    
    # Calculate pages
    pages = (total + limit - 1) // limit
    
    # Get paginated items
    products = query.offset(skip).limit(limit).all()
    
    return {
        "items": products,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit,
        "pages": pages
    }

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Create a new product"""
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int, 
    product: ProductCreate, 
    db: Session = Depends(get_db)
):
    """Update a product"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}
