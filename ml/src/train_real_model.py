import urllib.request
import json
import csv
import os
import pickle

class PurePythonLinearRegression:
    def __init__(self, learning_rate=0.001, epochs=1000):
        self.lr = learning_rate
        self.epochs = epochs
        self.weights = []
        self.bias = 0.0
        
    def fit(self, X, y):
        n_samples = len(X)
        n_features = len(X[0])
        self.weights = [0.0] * n_features
        self.bias = 0.0
        
        for epoch in range(self.epochs):
            for i in range(n_samples):
                # Predict
                y_pred = self.bias
                for j in range(n_features):
                    y_pred += X[i][j] * self.weights[j]
                    
                # Compute gradient
                error = y_pred - y[i]
                
                # Update
                self.bias -= self.lr * error * 2 / n_samples
                for j in range(n_features):
                    self.weights[j] -= self.lr * error * X[i][j] * 2 / n_samples
                    
    def predict(self, X):
        y_pred = []
        for row in X:
            pred = self.bias
            for j in range(len(row)):
                pred += row[j] * self.weights[j]
            y_pred.append(pred)
        return y_pred

def fetch_real_data():
    print("Fetching 90 days of real historical data from Open-Meteo for New Delhi...")
    lat, lon = 28.6139, 77.2090
    
    aqi_url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi&past_days=90"
    weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&past_days=90"
    
    req_aqi = urllib.request.Request(aqi_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req_aqi) as response:
        aqi_data = json.loads(response.read().decode())['hourly']
        
    req_weather = urllib.request.Request(weather_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req_weather) as response:
        weather_data = json.loads(response.read().decode())['hourly']

    # Combine
    dataset = []
    # ['Temperature', 'Humidity', 'Wind_Speed', 'PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'] => Target: AQI
    for i in range(len(aqi_data['time'])):
        # Skip if missing data
        if any(x is None for x in [
            weather_data['temperature_2m'][i], weather_data['relative_humidity_2m'][i], weather_data['wind_speed_10m'][i],
            aqi_data['pm2_5'][i], aqi_data['pm10'][i], aqi_data['nitrogen_dioxide'][i],
            aqi_data['sulphur_dioxide'][i], aqi_data['carbon_monoxide'][i], aqi_data['ozone'][i], aqi_data['european_aqi'][i]
        ]):
            continue
            
        dataset.append({
            'Temperature': weather_data['temperature_2m'][i],
            'Humidity': weather_data['relative_humidity_2m'][i],
            'Wind_Speed': weather_data['wind_speed_10m'][i],
            'PM2.5': aqi_data['pm2_5'][i],
            'PM10': aqi_data['pm10'][i],
            'NO2': aqi_data['nitrogen_dioxide'][i],
            'SO2': aqi_data['sulphur_dioxide'][i],
            'CO': aqi_data['carbon_monoxide'][i] / 1000.0, # convert to mg/m3
            'O3': aqi_data['ozone'][i],
            'AQI': aqi_data['european_aqi'][i]
        })
        
    print(f"Fetched {len(dataset)} valid hourly records.")
    return dataset

def train_and_save(dataset):
    print("Training model with real data...")
    # Prepare X and y
    features = ['Temperature', 'Humidity', 'Wind_Speed', 'PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3']
    X_raw = [[row[f] for f in features] for row in dataset]
    y = [row['AQI'] for row in dataset]
    
    # Scale features
    n_features = len(features)
    means = [sum(col) / len(col) for col in zip(*X_raw)]
    
    stds = []
    for j in range(n_features):
        variance = sum((X_raw[i][j] - means[j]) ** 2 for i in range(len(X_raw))) / len(X_raw)
        stds.append(variance ** 0.5 if variance > 0 else 1.0)
        
    X_scaled = []
    for i in range(len(X_raw)):
        X_scaled.append([(X_raw[i][j] - means[j]) / stds[j] for j in range(n_features)])
        
    # Train
    model = PurePythonLinearRegression(learning_rate=0.05, epochs=100) # Quick training
    model.fit(X_scaled, y)
    
    # Save artifacts
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    scaler_data = {'means': means, 'stds': stds}
    with open(os.path.join(models_dir, 'scaler.pkl'), 'wb') as f:
        pickle.dump(scaler_data, f)
        
    with open(os.path.join(models_dir, 'best_aqi_model.pkl'), 'wb') as f:
        pickle.dump(model, f)
        
    print("Model and scaler saved successfully in ml/models/.")

if __name__ == '__main__':
    data = fetch_real_data()
    if data:
        train_and_save(data)
