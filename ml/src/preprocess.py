import csv
import random
import os
import pickle

def load_data(filepath):
    print(f"Loading data from {filepath}...")
    with open(filepath, mode='r') as f:
        reader = csv.reader(f)
        headers = next(reader)
        data = [[float(val) for val in row] for row in reader]
    return headers, data

def preprocess_data(headers, data):
    print("Preprocessing data using pure Python...")
    # Train-test split (80-20)
    random.seed(42)
    random.shuffle(data)
    split_idx = int(len(data) * 0.8)
    train_data = data[:split_idx]
    test_data = data[split_idx:]
    
    # Calculate mean and std for scaling (excluding AQI target which is the last column)
    num_features = len(headers) - 1
    means = [0] * num_features
    for row in train_data:
        for i in range(num_features):
            means[i] += row[i]
    means = [m / len(train_data) for m in means]
    
    variances = [0] * num_features
    for row in train_data:
        for i in range(num_features):
            variances[i] += (row[i] - means[i]) ** 2
    stds = [(v / len(train_data)) ** 0.5 for v in variances]
    # avoid division by zero
    stds = [s if s > 0 else 1.0 for s in stds]
    
    scaler = {'means': means, 'stds': stds}
    
    def scale_dataset(dataset):
        scaled = []
        for row in dataset:
            scaled_row = [(row[i] - means[i]) / stds[i] for i in range(num_features)]
            scaled_row.append(row[-1]) # Append target unscaled
            scaled.append(scaled_row)
        return scaled

    train_scaled = scale_dataset(train_data)
    test_scaled = scale_dataset(test_data)
    
    return train_scaled, test_scaled, scaler

def save_csv(filepath, headers, data):
    with open(filepath, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(data)

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(__file__))
    input_file = os.path.join(base_dir, 'data', 'raw', 'synthetic_aqi_data.csv')
    processed_dir = os.path.join(base_dir, 'data', 'processed')
    models_dir = os.path.join(base_dir, 'models')
    
    os.makedirs(processed_dir, exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)
    
    headers, data = load_data(input_file)
    train_scaled, test_scaled, scaler = preprocess_data(headers, data)
    
    # Save processed data
    print("Saving processed data...")
    save_csv(os.path.join(processed_dir, 'train_scaled.csv'), headers, train_scaled)
    save_csv(os.path.join(processed_dir, 'test_scaled.csv'), headers, test_scaled)
    
    # Save scaler for future use in FastAPI
    print("Saving scaler...")
    with open(os.path.join(models_dir, 'scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)
    
    print("Preprocessing completed successfully!")
