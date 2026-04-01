from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import User
from app.routers.auth import hash_password
import sys

def seed_users():
    db = SessionLocal()
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        
        # Check if admin already exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            print("Creating admin user...")
            admin = User(
                username="admin",
                email="admin@pyrocraft.in",
                hashed_password=hash_password("admin123"),
                full_name="Administrator",
                role="admin",
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists.")
            
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
