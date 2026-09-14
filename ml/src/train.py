import csv
import os
import pickle
import math

def load_data(filepath):
    print(f"Loading data from {filepath}...")
    with open(filepath, mode='r') as f:
        reader = csv.reader(f)
        headers = next(reader)
        data = [[float(val) for val in row] for row in reader]
    
    X = [row[:-1] for row in data]
    y = [row[-1] for row in data]
    return X, y, headers[:-1]

class PurePythonLinearRegression:
    def __init__(self, learning_rate=0.01, epochs=1000):
        self.lr = learning_rate
        self.epochs = epochs
        self.weights = []
        self.bias = 0.0
        
    def fit(self, X, y):
        num_samples = len(X)
        num_features = len(X[0])
        self.weights = [0.0] * num_features
        self.bias = 0.0
        
        for epoch in range(self.epochs):
            y_pred = self.predict(X)
            
            # Gradients
            dw = [0.0] * num_features
            db = 0.0
            
            for i in range(num_samples):
                error = y_pred[i] - y[i]
                db += error
                for j in range(num_features):
                    dw[j] += error * X[i][j]
                    
            db = (2 / num_samples) * db
            dw = [(2 / num_samples) * w for w in dw]
            
            # Update weights
            self.bias -= self.lr * db
            for j in range(num_features):
                self.weights[j] -= self.lr * dw[j]
                
    def predict(self, X):
        y_pred = []
        for row in X:
            pred = self.bias
            for j in range(len(row)):
                pred += row[j] * self.weights[j]
            y_pred.append(pred)
        return y_pred

def evaluate_model(y_true, y_pred, model_name):
    num_samples = len(y_true)
    
    mae = sum(abs(y_true[i] - y_pred[i]) for i in range(num_samples)) / num_samples
    mse = sum((y_true[i] - y_pred[i]) ** 2 for i in range(num_samples)) / num_samples
    rmse = math.sqrt(mse)
    
    mean_y = sum(y_true) / num_samples
    ss_tot = sum((y - mean_y) ** 2 for y in y_true)
    ss_res = sum((y_true[i] - y_pred[i]) ** 2 for i in range(num_samples))
    
    r2 = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0
    
    print(f"--- {model_name} ---")
    print(f"MAE : {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"R2  : {r2:.4f}\n")
    return mae, rmse, r2

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(__file__))
    processed_dir = os.path.join(base_dir, 'data', 'processed')
    models_dir = os.path.join(base_dir, 'models')
    
    X_train, y_train, feature_names = load_data(os.path.join(processed_dir, 'train_scaled.csv'))
    X_test, y_test, _ = load_data(os.path.join(processed_dir, 'test_scaled.csv'))
    
    print("Training Pure Python Linear Regression...")
    model = PurePythonLinearRegression(learning_rate=0.05, epochs=500)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    evaluate_model(y_test, y_pred, "Pure Python Linear Regression")
    
    model_path = os.path.join(models_dir, 'best_aqi_model.pkl')
    print(f"Saving model to {model_path}...")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    print("Training process completed successfully!")
