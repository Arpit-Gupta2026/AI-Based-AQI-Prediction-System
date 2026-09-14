import sqlite3
import os
import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'aqi_data.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS observations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location_name TEXT NOT NULL,
            lat REAL,
            lon REAL,
            timestamp TEXT NOT NULL,
            current_aqi INTEGER,
            pm25 REAL,
            pm10 REAL,
            no2 REAL,
            so2 REAL,
            co REAL,
            o3 REAL,
            temperature REAL,
            humidity REAL,
            wind_speed REAL,
            predicted_aqi INTEGER
        )
    ''')
    conn.commit()
    conn.close()

def save_observation(data):
    """
    data dict expects: location_name, lat, lon, current_aqi, pm25, pm10, no2, so2, co, o3, 
    temperature, humidity, wind_speed, predicted_aqi
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    timestamp = datetime.datetime.utcnow().isoformat()
    
    c.execute('''
        INSERT INTO observations (
            location_name, lat, lon, timestamp, current_aqi, pm25, pm10, no2, so2, co, o3,
            temperature, humidity, wind_speed, predicted_aqi
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('location_name'),
        data.get('lat'),
        data.get('lon'),
        timestamp,
        data.get('current_aqi'),
        data.get('pm25'),
        data.get('pm10'),
        data.get('no2'),
        data.get('so2'),
        data.get('co'),
        data.get('o3'),
        data.get('temperature'),
        data.get('humidity'),
        data.get('wind_speed'),
        data.get('predicted_aqi')
    ))
    conn.commit()
    conn.close()
    return timestamp

def get_previous_observation(location_name):
    """Returns the most recent observation before the current one (or the latest if only one exists)"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('''
        SELECT * FROM observations 
        WHERE location_name = ? 
        ORDER BY timestamp DESC 
        LIMIT 1 OFFSET 1
    ''', (location_name,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def get_latest_observation(location_name):
    """Returns the absolute latest observation"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('''
        SELECT * FROM observations 
        WHERE location_name = ? 
        ORDER BY timestamp DESC 
        LIMIT 1
    ''', (location_name,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def get_history(location_name, limit=30):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('''
        SELECT * FROM observations 
        WHERE location_name = ? 
        ORDER BY timestamp DESC 
        LIMIT ?
    ''', (location_name, limit))
    rows = c.fetchall()
    conn.close()
    # Return chronologically (oldest first) for charting
    return [dict(row) for row in reversed(rows)]

def get_24h_history(location_name):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    cutoff = (datetime.datetime.utcnow() - datetime.timedelta(hours=24)).isoformat()
    
    c.execute('''
        SELECT * FROM observations 
        WHERE location_name = ? AND timestamp >= ?
        ORDER BY timestamp ASC
    ''', (location_name, cutoff))
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]
