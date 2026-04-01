from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
from app.database import engine, Base
import app.models

# Import routers
from app.routers import products, orders, uploads, auth, analytics, settings, reviews

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="PYROCRAFT API",
    description="Premium Crackers E-commerce API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=[
    #     "http://localhost:3000",
    #     "http://localhost:3001",
    #     "http://127.0.0.1:3000",
    #     "http://127.0.0.1:3001",
    #     "http://192.168.1.4:3000",
    #     "http://192.168.1.4:3001",
    #     " http://0.0.0.0:8000"
    # ],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if not exists
Path("uploads").mkdir(exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(uploads.router)
app.include_router(auth.router)
app.include_router(analytics.router)
app.include_router(settings.router)
app.include_router(reviews.router)

@app.get("/")
def read_root():
    return {"message": "PYROCRAFT API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
