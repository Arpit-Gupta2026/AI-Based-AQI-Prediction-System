import os
import pickle

# The same class definition is required to unpickle the PurePythonLinearRegression
class PurePythonLinearRegression:
    def __init__(self, learning_rate=0.01, epochs=1000):
        self.lr = learning_rate
        self.epochs = epochs
        self.weights = []
        self.bias = 0.0
        
    def fit(self, X, y):
        pass # Not needed for inference
                
    def predict(self, X):
        y_pred = []
        for row in X:
            pred = self.bias
            for j in range(len(row)):
                pred += row[j] * self.weights[j]
            y_pred.append(pred)
        return y_pred

# Global variables to hold the loaded model and scaler
_model = None
_scaler = None

def load_ml_artifacts():
    global _model, _scaler
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    models_dir = os.path.join(base_dir, 'ml', 'models')
    
    scaler_path = os.path.join(models_dir, 'scaler.pkl')
    model_path = os.path.join(models_dir, 'best_aqi_model.pkl')
    
    if os.path.exists(scaler_path) and os.path.exists(model_path):
        with open(scaler_path, 'rb') as f:
            _scaler = pickle.load(f)
            
        import sys
        import __main__
        __main__.PurePythonLinearRegression = PurePythonLinearRegression
            
        with open(model_path, 'rb') as f:
            _model = pickle.load(f)
        print("ML artifacts loaded successfully.")
    else:
        print("Warning: ML artifacts not found. Predictions will return dummy values.")

def predict_aqi(features: dict) -> int:
    if _model is None or _scaler is None:
        return 100 # Dummy value if not loaded
    
    # Extract features in the correct order:
    # ['Temperature', 'Humidity', 'Wind_Speed', 'PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3']
    raw_input = [
        features['temperature'], features['humidity'], features['wind_speed'],
        features['pm25'], features['pm10'], features['no2'],
        features['so2'], features['co'], features['o3']
    ]
    
    # Scale input
    scaled_input = []
    for i in range(len(raw_input)):
        scaled_val = (raw_input[i] - _scaler['means'][i]) / _scaler['stds'][i]
        scaled_input.append(scaled_val)
        
    # Predict
    prediction = _model.predict([scaled_input])[0]
    return max(0, int(round(prediction)))
