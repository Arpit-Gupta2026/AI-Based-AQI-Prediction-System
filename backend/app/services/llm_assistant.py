import os
import json
import urllib.request
import urllib.error

def process_fallback(message: str, context: dict) -> str:
    msg = message.lower()
    aqi = context.get('current_aqi') if context else None
    loc = context.get('location_name', 'your selected area') if context else None
    
    if any(word in msg for word in ['run', 'running', 'exercise', 'workout', 'sports']):
        if aqi is None: return "I don't have the AQI data for your location yet. Please search for a city first!"
        if aqi <= 50: return f"Yes! The AQI in {loc} is excellent ({aqi}). It's a perfect time for an outdoor run!"
        elif aqi <= 100: return f"The AQI in {loc} is acceptable ({aqi}). It's generally fine to run."
        elif aqi <= 150: return f"The AQI in {loc} is unhealthy for sensitive groups ({aqi}). Better to exercise indoors today."
        else: return f"I would strongly advise against running outside right now. The AQI in {loc} is {aqi}."

    if any(word in msg for word in ['aqi', 'air quality', 'pollution']):
        if aqi is None: return "Please select a location on the dashboard first!"
        status = "Good" if aqi <= 50 else "Moderate" if aqi <= 100 else "Poor"
        return f"The current AQI in {loc} is {aqi} ({status})."

    if 'why' in msg:
        return "Air quality can be affected by vehicle emissions, industrial pollution, and weather patterns like humidity trapping pollutants."

    return "I am the EcoGuard AI. I can give you personalized advice on whether it's safe to exercise outdoors. What would you like to know?"

def call_gemini_api(prompt: str, context: dict = None) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    
    # Fallback to simple rule-based if no API key
    if not api_key:
        return process_fallback(prompt, context)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    system_instruction = "You are EcoGuard AI, an environmental intelligence assistant. Provide concise, helpful advice about air quality, exercising outdoors, and pollution. Keep responses under 3 sentences."
    
    if context and 'current_aqi' in context:
        loc = context.get('location_name', 'your location')
        aqi = context.get('current_aqi')
        system_instruction += f"\nCurrent context: The user is in {loc} where the AQI is {aqi}."

    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        }
    }
    
    try:
        req = urllib.request.Request(
            url, 
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            # Extract text
            if 'candidates' in result and len(result['candidates']) > 0:
                parts = result['candidates'][0]['content']['parts']
                if len(parts) > 0 and 'text' in parts[0]:
                    return parts[0]['text']
                    
            return "Sorry, I received an unexpected response format from the intelligence engine."
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        print(f"Gemini API Error: {error_msg}")
        return "Sorry, I'm having trouble connecting to the intelligence engine right now. Please check your API key."
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return "Sorry, an unexpected error occurred while connecting to the intelligence engine."
