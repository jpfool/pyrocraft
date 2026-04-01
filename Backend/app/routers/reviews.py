from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Review
from app.schemas import ReviewResponse, ReviewCreate
from typing import List

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

@router.get("/", response_model=List[ReviewResponse])
def get_approved_reviews(db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.is_approved == True).order_by(Review.created_at.desc()).all()

@router.get("/all", response_model=List[ReviewResponse])
def get_all_reviews(db: Session = Depends(get_db)):
    return db.query(Review).order_by(Review.created_at.desc()).all()

@router.post("/", response_model=ReviewResponse)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    db_review = Review(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.patch("/{review_id}/approve", response_model=ReviewResponse)
def approve_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review.is_approved = True
    db.commit()
    db.refresh(review)
    return review

@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(review)
    db.commit()
    return {"message": "Review deleted successfully"}
