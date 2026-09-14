def get_aqi_category(aqi: int) -> str:
    """
    Returns the AQI category based on the Indian National Air Quality Index.
    """
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Satisfactory"
    elif aqi <= 200:
        return "Moderate"
    elif aqi <= 300:
        return "Poor"
    elif aqi <= 400:
        return "Very Poor"
    else:
        return "Severe"

def generate_recommendation(aqi: int, activity: str, duration: int) -> dict:
    """
    Deterministic rule-based recommendation engine.
    """
    category = get_aqi_category(aqi)
    
    recommendation = ""
    precautions = []
    
    # Base logic on AQI category
    if category == "Good":
        recommendation = f"It's a great day for {activity} outdoors!"
        precautions.append("Enjoy your outdoor activity.")
    elif category == "Satisfactory":
        recommendation = f"Conditions are fine for {activity} outdoors."
        precautions.append("Unusually sensitive people should consider reducing prolonged or heavy exertion.")
    elif category == "Moderate":
        if duration > 60:
            recommendation = f"Consider reducing the duration of your {activity}."
        else:
            recommendation = f"You can proceed with {activity}, but monitor how you feel."
        precautions.append("People with lung/heart diseases should reduce prolonged exertion.")
        precautions.append("Consider taking breaks if you feel discomfort.")
    elif category == "Poor":
        recommendation = f"It is not recommended to do heavy {activity} outdoors today."
        precautions.append("Consider moving your activity indoors.")
        precautions.append("Avoid prolonged or heavy exertion.")
        precautions.append("If you must go out, consider wearing a mask.")
    elif category == "Very Poor":
        recommendation = f"Avoid {activity} outdoors. The air quality is very poor."
        precautions.append("Stay indoors as much as possible.")
        precautions.append("Keep windows closed to prevent outdoor pollution from entering.")
        precautions.append("Use an air purifier if available.")
    else: # Severe
        recommendation = f"DANGER: Do not engage in {activity} outdoors."
        precautions.append("Remain indoors.")
        precautions.append("Avoid all physical exertion outdoors.")
        precautions.append("Seek medical advice if you experience respiratory issues.")

    # Activity specific modifiers
    if activity.lower() in ["running", "cycling", "outdoor sports"]:
        if category in ["Moderate", "Poor", "Very Poor", "Severe"]:
            precautions.insert(0, f"Heavy exertion from {activity} significantly increases pollutant inhalation.")
            
    return {
        "aqi_category": category,
        "recommendation": recommendation,
        "precautions": precautions
    }
