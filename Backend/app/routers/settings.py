from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Settings
from app.schemas import SettingsResponse, SettingsUpdate
from typing import List

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("/", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(Settings).first()
    if not settings:
        # Create default settings if they don't exist
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/", response_model=SettingsResponse)
def update_settings(settings_update: SettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    update_data = settings_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
    
    db.commit()
    db.refresh(settings)
    return settings
