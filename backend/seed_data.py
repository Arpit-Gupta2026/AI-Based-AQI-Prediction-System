import sqlite3
import os
import datetime
import random
import sys

# Ensure backend directory is in path for imports
sys.path.insert(0, os.path.dirname(__file__))

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'aqi_data.db')

def seed_24h_data(location_name="New Delhi"):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Ensure table exists
    from app.database import init_db
    init_db()

    now = datetime.datetime.utcnow()
    
    # Base values for New Delhi
    base_aqi = 150
    base_pm25 = 55.0
    base_pm10 = 120.0
    
    # Generate data for the past 24 hours
    for i in range(24, -1, -1):
        timestamp = (now - datetime.timedelta(hours=i)).isoformat()
        
        # Add some random fluctuations
        current_aqi = max(0, int(base_aqi + random.uniform(-30, 40) + (10 * (i % 3))))
        pm25 = max(0, round(base_pm25 + random.uniform(-10, 15), 1))
        pm10 = max(0, round(base_pm10 + random.uniform(-20, 30), 1))
        
        # Predicted AQI is usually close to current but slightly shifted
        predicted_aqi = max(0, int(current_aqi + random.uniform(-15, 20)))
        
        c.execute('''
            INSERT INTO observations (
                location_name, lat, lon, timestamp, current_aqi, pm25, pm10, no2, so2, co, o3,
                temperature, humidity, wind_speed, predicted_aqi
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            location_name,
            28.6139, # lat
            77.2090, # lon
            timestamp,
            current_aqi,
            pm25,
            pm10,
            25.0, # no2
            10.0, # so2
            0.5,  # co
            40.0, # o3
            30.0, # temp
            60.0, # humidity
            10.0, # wind_speed
            predicted_aqi
        ))
        
    conn.commit()
    conn.close()
    print(f"Successfully seeded 24 hours of mock data for {location_name}")

if __name__ == '__main__':
    seed_24h_data("New Delhi")
