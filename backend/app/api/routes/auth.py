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
    return {"message": "OTP sent successfully. For demo use 123456."}

@router.post("/verify-otp", response_model=AuthResponse)
async def verify_otp(req: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    logger.info(f"Verifying OTP for {req.phone_number}")
    
    # ── Master Bypass for Demo ──────────────────────────
    if req.otp != "123456":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid OTP. Please use 123456 for the demo version."
        )
        
    # ── User Handling ──────────────────────────────────
    try:
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
            logger.info(f"New demo user created: {user.id}")
        else:
            if req.state:
                user.state = req.state
                await db.commit()
    except Exception as e:
        logger.error(f"Database error during auth: {e}")
        # Fallback for demo if DB is weird
        return AuthResponse(
            access_token=f"demo-token-{req.phone_number}",
            user={
                "id": "demo-user-id",
                "phone": req.phone_number,
                "name": req.name or "Demo User",
                "state": req.state or "Maharashtra"
            }
        )
    
    # Return success
    return AuthResponse(
        access_token=f"fake-jwt-{user.id}",
        user={
            "id": user.id,
            "phone": user.phone_hash,
            "name": req.name or "Nyaya User",
            "state": user.state
        }
    )
