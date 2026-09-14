import json
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import sys
import os

# Ensure the backend directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.ml_integration.model import load_ml_artifacts, predict_aqi
from app.services.recommendation import generate_recommendation
from app.database import init_db, save_observation, get_previous_observation, get_history, get_24h_history
from app.services.weather_api import fetch_current_environment
from app.services.llm_assistant import call_gemini_api

class CentralizedAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        query = dict(urllib.parse.parse_qsl(parsed_path.query))
        
        if parsed_path.path == '/api/aqi/current':
            # 1. Get query params
            lat = float(query.get('lat', 28.6139))
            lon = float(query.get('lon', 77.2090))
            loc_name = query.get('location_name', 'New Delhi')
            
            # 2. Fetch live data from Open-Meteo
            live_data = fetch_current_environment(lat, lon)
            if not live_data:
                self.send_error(500, "Failed to fetch live data")
                return
                
            # 3. Use EXISTING ML model to predict AQI using live environmental data
            predicted_aqi = predict_aqi(live_data)
            live_data['predicted_aqi'] = predicted_aqi
            live_data['location_name'] = loc_name
            live_data['lat'] = lat
            live_data['lon'] = lon
            
            # 4. Save this observation to SQLite history
            timestamp = save_observation(live_data)
            live_data['timestamp'] = timestamp
            
            # 5. Fetch previous observation for change context
            prev_obs = get_previous_observation(loc_name)
            
            # 6. Recommendation
            rec = generate_recommendation(live_data['current_aqi'], "General", 30)
            
            # 7. Construct unified response
            response = {
                "location_name": loc_name,
                "current": live_data,
                "previous": prev_obs,
                "recommendation": rec
            }
            
            self._set_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        elif parsed_path.path == '/api/aqi/history':
            loc_name = query.get('location_name', 'New Delhi')
            history = get_history(loc_name, limit=30)
            self._set_headers()
            self.wfile.write(json.dumps({"history": history}).encode('utf-8'))
            
        elif parsed_path.path == '/api/analytics/historical':
            loc_name = query.get('location_name', 'New Delhi')
            history = get_24h_history(loc_name)
            self._set_headers()
            self.wfile.write(json.dumps({"history": history}).encode('utf-8'))
            
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/api/predict':
            # Kept for backward compatibility with older UI parts if needed
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            predicted_aqi = predict_aqi(request_data)
            rec = generate_recommendation(predicted_aqi, 'Walking', 30)
            response = {"predicted_aqi": predicted_aqi, **rec}
            self._set_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
        elif self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            message = request_data.get('message', '')
            context = request_data.get('context', None)
            
            reply = call_gemini_api(message, context)
            
            response = {"reply": reply}
            self._set_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run():
    port = int(os.environ.get('PORT', 8000))
    server_address = ('0.0.0.0', port)
    httpd = ThreadingHTTPServer(server_address, CentralizedAPIHandler)
    print(f"Starting Centralized API server on port {port}...")
    init_db()
    load_ml_artifacts()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Server stopped.")

if __name__ == '__main__':
    run()
