from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:sdvIpScbYNiQjQzMuvowmOiynxxsTKnZ@hopper.proxy.rlwy.net:30761/railway"
    SECRET_KEY: str = "your-secret-key"
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_WHATSAPP_NUMBER: str = ""
    FRONTEND_URL: str = "https://frontend-production-814b2.up.railway.app"

    class Config:
        env_file = ".env"

settings = Settings()
