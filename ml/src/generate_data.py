import csv
import random
import os

def generate_synthetic_aqi_data(num_samples=5000):
    print("Generating synthetic AQI dataset using pure Python...")
    random.seed(42)
    
    data = []
    headers = ['Temperature', 'Humidity', 'Wind_Speed', 'PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'AQI']
    
    for _ in range(num_samples):
        temp = random.gauss(25, 10)
        humidity = random.gauss(60, 20)
        wind_speed = random.gauss(10, 5)
        
        pm25 = max(0, random.gauss(40, 30) - wind_speed * 0.5 + humidity * 0.2)
        pm10 = pm25 * random.uniform(1.2, 2.5)
        no2 = max(0, random.gauss(30, 20))
        so2 = max(0, random.gauss(15, 10))
        co = max(0, random.gauss(1.0, 0.8))
        o3 = max(0, random.gauss(30, 15) + temp * 0.5)
        
        si_pm25 = pm25 * (100 / 60)
        si_pm10 = pm10 * (100 / 100)
        si_no2 = no2 * (100 / 80)
        si_so2 = so2 * (100 / 80)
        si_co = co * (100 / 2)
        si_o3 = o3 * (100 / 100)
        
        aqi = max(si_pm25, si_pm10, si_no2, si_so2, si_co, si_o3)
        aqi = max(0, aqi + random.gauss(0, 5))
        
        data.append([
            round(temp, 1), round(humidity, 1), round(wind_speed, 1),
            round(pm25, 1), round(pm10, 1), round(no2, 1),
            round(so2, 1), round(co, 2), round(o3, 1),
            int(round(aqi))
        ])
        
    return headers, data

if __name__ == "__main__":
    headers, data = generate_synthetic_aqi_data(1000)
    
    output_dir = os.path.join(os.path.dirname(__file__), '../data/raw')
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, 'synthetic_aqi_data.csv')
    with open(output_path, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(data)
    
    print(f"Dataset generated successfully at {output_path}")
