from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
import re

router = APIRouter()

def process_chat_query(message: str, context: dict) -> str:
    msg = message.lower()
    
    # Extract context safely
    aqi = context.get('current_aqi') if context else None
    loc = context.get('location_name', 'your selected area') if context else None
    
    # 1. Ask about running/exercise
    if any(word in msg for word in ['run', 'running', 'exercise', 'workout', 'sports']):
        if aqi is None:
            return "I don't have the AQI data for your location yet. Please search for a city or use your location first!"
        if aqi <= 50:
            return f"Yes! The AQI in {loc} is excellent ({aqi}). It's a perfect time for an outdoor run!"
        elif aqi <= 100:
            return f"The AQI in {loc} is acceptable ({aqi}). It's generally fine to run, but unusually sensitive people should consider reducing prolonged exertion."
        elif aqi <= 150:
            return f"The AQI in {loc} is unhealthy for sensitive groups ({aqi}). If you have asthma or respiratory issues, it's better to exercise indoors today."
        else:
            return f"I would strongly advise against running outside right now. The AQI in {loc} is {aqi}, which is dangerous for outdoor exertion."

    # 2. Ask about current AQI
    if any(word in msg for word in ['aqi', 'air quality', 'pollution']):
        if aqi is None:
             return "Please select a location on the dashboard first, and I can give you the exact air quality details!"
        status = "Good" if aqi <= 50 else "Moderate" if aqi <= 100 else "Poor"
        return f"The current AQI in {loc} is {aqi} ({status}). " + (
            "The air is clean and safe!" if aqi <= 50 else 
            "You might want to take precautions if you are sensitive to air pollution."
        )

    # 3. Ask about why it's high
    if 'why' in msg:
        return "Air quality can be affected by vehicle emissions, industrial pollution, weather patterns (like stagnant air or high humidity trapping pollutants), and regional dust. PM2.5 and PM10 particles are the primary contributors to the AQI score you see."

    # Fallback response
    return "I am the EcoGuard AI. I can give you personalized advice on whether it's safe to exercise outdoors, provide details about the current AQI in your selected city, or explain how air pollution works. What would you like to know?"

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    reply = process_chat_query(request.message, request.context)
    return ChatResponse(reply=reply)
