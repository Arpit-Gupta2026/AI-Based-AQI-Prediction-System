from fastapi import APIRouter
from app.schemas.predict import PredictionRequest, PredictionResponse
from app.ml_integration.model import predict_aqi
from app.services.recommendation import generate_recommendation

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    # Predict AQI using the ML model
    predicted_aqi = predict_aqi(request.dict())
    
    # Generate recommendations based on predicted AQI
    rec_result = generate_recommendation(
        aqi=predicted_aqi,
        activity=request.activity_type,
        duration=request.duration_minutes
    )
    
    return PredictionResponse(
        predicted_aqi=predicted_aqi,
        aqi_category=rec_result["aqi_category"],
        activity=request.activity_type,
        duration=request.duration_minutes,
        recommendation=rec_result["recommendation"],
        precautions=rec_result["precautions"]
    )
