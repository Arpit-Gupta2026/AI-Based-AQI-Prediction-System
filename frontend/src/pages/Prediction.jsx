import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Brain, Thermometer, Droplets, Wind, CloudRain, Activity, Clock, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAQI } from '../contexts/AQIContext';

export default function Prediction() {
  const { data } = useAQI();
  const current = data?.current;

  const [formData, setFormData] = useState({
    temperature: current?.temperature || 25,
    humidity: current?.humidity || 50,
    wind_speed: current?.wind_speed || 10,
    precipitation: 0.0,
    activity_type: 'running',
    duration_minutes: 30
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'activity_type' ? value : parseFloat(value) || 0
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPredictionResult(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to get prediction');
      
      const result = await response.json();
      setPredictionResult(result);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the Machine Learning Engine. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Good': return 'bg-green-500';
      case 'Moderate': return 'bg-yellow-400';
      case 'Unhealthy for Sensitive Groups': return 'bg-orange-500';
      case 'Unhealthy': return 'bg-red-500';
      case 'Very Unhealthy': return 'bg-purple-600';
      case 'Hazardous': return 'bg-rose-900';
      default: return 'bg-gray-500';
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-indigo-600" /> Machine Learning Prediction
            </h1>
            <p className="text-gray-500 mt-1">Simulate weather conditions to predict future AQI and get AI safety recommendations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          
          {/* Form Side */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Input Parameters</h2>
            <form onSubmit={handlePredict} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2"><Thermometer className="w-4 h-4 text-orange-500" /> Temperature (°C)</label>
                  <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2"><Droplets className="w-4 h-4 text-blue-500" /> Humidity (%)</label>
                  <input type="number" step="1" name="humidity" value={formData.humidity} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2"><Wind className="w-4 h-4 text-gray-500" /> Wind Speed (km/h)</label>
                  <input type="number" step="0.1" name="wind_speed" value={formData.wind_speed} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2"><CloudRain className="w-4 h-4 text-blue-400" /> Precipitation (mm)</label>
                  <input type="number" step="0.1" name="precipitation" value={formData.precipitation} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>

              <div className="border-t border-gray-100 my-2"></div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-emerald-500" /> Activity Type</label>
                  <select name="activity_type" value={formData.activity_type} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="running">Running</option>
                    <option value="walking">Walking</option>
                    <option value="cycling">Cycling</option>
                    <option value="outdoor_sports">Outdoor Sports</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-gray-500" /> Duration (mins)</label>
                  <input type="number" step="5" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? 'Running ML Inference...' : 'Generate Prediction'} <ArrowRight className="w-5 h-5" />
              </button>
              
              {error && <p className="text-red-500 text-sm font-medium mt-2 text-center">{error}</p>}
            </form>
          </div>

          {/* Result Side */}
          <div className="flex flex-col h-full">
            {predictionResult ? (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-center relative overflow-hidden">
                {/* Background decorative blob */}
                <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-10 blur-3xl ${getCategoryColor(predictionResult.aqi_category)}`}></div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-6">Prediction Results</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-lg ${getCategoryColor(predictionResult.aqi_category)}`}>
                    <span className="text-4xl font-black">{Math.round(predictionResult.predicted_aqi)}</span>
                    <span className="text-xs font-bold uppercase mt-1 opacity-90">Predicted AQI</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{predictionResult.aqi_category}</h3>
                    <p className="text-gray-500 font-medium">For {formData.activity_type} ({formData.duration_minutes} mins)</p>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl mb-4 ${predictionResult.predicted_aqi <= 100 ? 'bg-green-50 border border-green-100 text-green-800' : 'bg-red-50 border border-red-100 text-red-800'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {predictionResult.predicted_aqi <= 100 ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <AlertTriangle className="w-6 h-6 text-red-600" />}
                    <span className="font-bold text-lg">AI Recommendation</span>
                  </div>
                  <p className="font-medium">{predictionResult.recommendation}</p>
                </div>

                {predictionResult.precautions && predictionResult.precautions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Precautions</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {predictionResult.precautions.map((precaution, idx) => (
                        <li key={idx}>{precaution}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-indigo-50 border border-indigo-100 border-dashed p-8 rounded-3xl h-full flex flex-col items-center justify-center text-center">
                <Brain className="w-16 h-16 text-indigo-300 mb-4" />
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Awaiting Input Parameters</h3>
                <p className="text-indigo-700/70 max-w-sm">Adjust the weather and activity parameters on the left to simulate and predict future air quality levels.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
