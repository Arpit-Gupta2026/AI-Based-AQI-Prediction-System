from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import predict, chat
from app.ml_integration.model import load_ml_artifacts

app = FastAPI(
    title="AQI Prediction & Smart Outdoor Activity Recommendation API",
    description="Backend API for predicting AQI and recommending activities.",
    version="1.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev purposes, allow all. In prod, specify frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Models at startup
@app.on_event("startup")
def startup_event():
    load_ml_artifacts()


# Include routes
app.include_router(predict.router, prefix="/api", tags=["prediction"])
app.include_router(chat.router, prefix="/api", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AQI Prediction API"}
