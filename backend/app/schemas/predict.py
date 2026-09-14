from pydantic import BaseModel
from typing import List, Optional

class PredictionRequest(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    pm25: float
    pm10: float
    no2: float
    so2: float
    co: float
    o3: float
    activity_type: str
    duration_minutes: int

class PredictionResponse(BaseModel):
    predicted_aqi: int
    aqi_category: str
    activity: str
    duration: int
    recommendation: str
    precautions: List[str]
