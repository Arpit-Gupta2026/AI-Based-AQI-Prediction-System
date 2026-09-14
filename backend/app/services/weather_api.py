import urllib.request
import json
import concurrent.futures

def _fetch_url(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def fetch_current_environment(lat, lon):
    """
    Fetches current weather and air quality from Open-Meteo API.
    Does not require an API key.
    """
    # Air Quality URL
    aqi_url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi"
    
    # Weather URL
    weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
    
    try:
        # Fetch concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            future_aqi = executor.submit(_fetch_url, aqi_url)
            future_weather = executor.submit(_fetch_url, weather_url)
            
            aqi_data = future_aqi.result()
            weather_data = future_weather.result()
            
        current_aqi_raw = aqi_data.get('current', {})
        current_weather_raw = weather_data.get('current', {})
            
        # Standardize format
        return {
            "current_aqi": current_aqi_raw.get('european_aqi', 50),
            "pm25": current_aqi_raw.get('pm2_5', 10.0),
            "pm10": current_aqi_raw.get('pm10', 20.0),
            "no2": current_aqi_raw.get('nitrogen_dioxide', 15.0),
            "so2": current_aqi_raw.get('sulphur_dioxide', 5.0),
            "co": current_aqi_raw.get('carbon_monoxide', 200.0) / 1000.0, # convert to mg/m3
            "o3": current_aqi_raw.get('ozone', 30.0),
            "temperature": current_weather_raw.get('temperature_2m', 25.0),
            "humidity": current_weather_raw.get('relative_humidity_2m', 50.0),
            "wind_speed": current_weather_raw.get('wind_speed_10m', 10.0)
        }
    except Exception as e:
        print(f"Error fetching from Open-Meteo: {e}")
        return None
