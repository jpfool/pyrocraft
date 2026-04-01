from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models import User
from app.schemas import Token, TokenData, UserResponse, LoginRequest, TokenResponse
import hashlib

router = APIRouter(prefix="/api/auth", tags=["auth"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """User login endpoint"""
    
    # Query user from database
    user = db.query(User).filter(User.username == credentials.username).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify hashed password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": user.username,
            "role": user.role,
            "full_name": user.full_name
        }
    }

@router.get("/verify")
def verify_auth(token: str = None):
    """Verify if token is valid"""
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")
    
    payload = verify_token(token)
    return {
        "valid": True,
        "user": payload.get("sub"),
        "role": payload.get("role")
    }

@router.post("/logout")
def logout():
    """Logout endpoint"""
    return {"message": "Logged out successfully"}


def get_current_user(token: str = Depends(verify_token), db: Session = Depends(get_db)):
    """Dependency to get current authenticated user"""
    username = token.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Get details of current logged in user"""
    return current_user
