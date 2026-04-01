from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:admin@localhost:5432/pyrochats"
    SECRET_KEY: str = "your-secret-key"
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_WHATSAPP_NUMBER: str = ""
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()
