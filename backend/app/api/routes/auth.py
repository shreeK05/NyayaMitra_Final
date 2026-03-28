from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import User
import uuid
import structlog
from datetime import datetime
from typing import Optional

logger = structlog.get_logger()
router = APIRouter()

class SendOTPRequest(BaseModel):
    phone_number: str

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str
    name: Optional[str] = None
    state: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/send-otp")
async def send_otp(req: SendOTPRequest):
    logger.info(f"OTP requested for {req.phone_number}")
    # In production, integrate SMS API here (Twilio/AWS SNS)
    return {"message": "OTP sent successfully. For local testing use 123456."}

@router.post("/verify-otp", response_model=AuthResponse)
async def verify_otp(req: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    # Verify OTP (Master bypass for demo: 123456)
    if req.otp != "123456":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP. Use 123456 for demo.")
        
    # Check if user exists
    # For demo, using unhashed phone directly for simplicity
    query = select(User).where(User.phone_hash == req.phone_number)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        # Create new user
        user = User(
            id=str(uuid.uuid4()),
            phone_hash=req.phone_number,
            state=req.state or "Maharashtra",
            created_at=datetime.utcnow()
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        logger.info(f"New user created: {user.id}")
    else:
        # Update details if needed
        if req.state:
            user.state = req.state
        await db.commit()
    
    # In production, use pyjwt for actual tokens
    fake_token = f"fake-jwt-token-{user.id}"
    
    return AuthResponse(
        access_token=fake_token,
        user={
            "id": user.id,
            "phone": user.phone_hash,
            "name": req.name or "User",
            "state": user.state
        }
    )
