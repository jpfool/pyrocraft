from fastapi import APIRouter, File, UploadFile, HTTPException
from pathlib import Path
import shutil
import os
from datetime import datetime

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

UPLOAD_DIR = Path("uploads/products")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/product-image")
async def upload_product_image(file: UploadFile = File(...)):
    """Upload a product image"""
    
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Only images allowed.")
    
    # Validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB.")
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"product_{timestamp}{file_ext}"
    file_path = UPLOAD_DIR / filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
    
    # Return URL
    image_url = f"/uploads/products/{filename}"
    return {
        "filename": filename,
        "url": image_url,
        "message": "Image uploaded successfully"
    }

@router.delete("/product-image/{filename}")
def delete_product_image(filename: str):
    """Delete a product image"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Security check - ensure file is in uploads directory
    if not str(file_path.resolve()).startswith(str(UPLOAD_DIR.resolve())):
        raise HTTPException(status_code=403, detail="Invalid path")
    
    os.remove(file_path)
    return {"message": "Image deleted"}
