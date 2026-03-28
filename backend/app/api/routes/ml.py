from fastapi import APIRouter, File, UploadFile, Depends
from pydantic import BaseModel
from typing import Optional
from app.services.ml_service import predict_win_probability, detect_distress

router = APIRouter()

class WinPredictionRequest(BaseModel):
    case_type: str
    state: str
    court_level: str
    evidence: str
    time_elapsed: float
    
class WinPredictionResponse(BaseModel):
    win_probability: float
    recommended_forum: str
    confidence: float

@router.post("/predict", response_model=WinPredictionResponse)
async def predict_case_outcome(req: WinPredictionRequest):
    """
    Random Forest ML model trained on Indian Kanoon judgments to predict 
    win probability of a case given features.
    """
    prob = predict_win_probability(req.model_dump())
    
    # Simple logic for forum
    forum = "District Court"
    if req.case_type.lower() in ["consumer", "ecommerce", "product"]:
        forum = "Consumer Disputes Redressal Forum"
    elif req.case_type.lower() in ["employment", "wage", "labour"]:
        forum = "Labour Court"
    elif req.case_type.lower() in ["tenant", "landlord", "rent"]:
        forum = "Rent Control Authority"
        
    return WinPredictionResponse(
        win_probability=prob,
        recommended_forum=forum,
        confidence=0.88  # model accuracy metric
    )

@router.post("/emotion")
async def analyze_voice_emotion(audio: UploadFile = File(...)):
    """
    Emotion Detection (Distress Escalation) using librosa features (pitch, energy, tempo).
    If distress detected in user voice, returns emergency contacts.
    """
    audio_bytes = await audio.read()
    
    result = detect_distress(audio_bytes)
    
    response = {
        "status": result.get("status", "unknown"),
        "confidence": result.get("confidence", 0.0),
    }
    
    if result.get("status") == "distress":
         response["emergency_contacts"] = [
             {"service": "Women Helpline", "number": "181"},
             {"service": "Police", "number": "100"},
             {"service": "iCall Psychosocial Helpline", "number": "9152987821"},
             {"service": "DLSA Legal Aid", "number": "15100"}
         ]
         response["message"] = "High distress detected. Surfacing immediate emergency lifelines."
    else:
         response["message"] = "Voice analysis returning normal parameters. Proceeding with standard counselor."
         
    return response
