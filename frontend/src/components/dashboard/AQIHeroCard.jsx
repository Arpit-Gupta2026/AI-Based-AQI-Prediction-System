import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Info, Loader } from 'lucide-react';
import { useAQI } from '../../contexts/AQIContext';

export default function AQIHeroCard() {
  const { data, loading } = useAQI();
  const [view, setView] = useState('current'); // 'current' or 'predicted'

  // If still loading or no data
  if (loading || !data?.current) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center h-full min-h-[300px]">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Map API values to our UI format
  const getCategoryTheme = (aqi) => {
    if (aqi <= 50) return { category: 'Good', color: 'text-green-500', bg: 'bg-green-500' };
    if (aqi <= 100) return { category: 'Satisfactory', color: 'text-lime-500', bg: 'bg-lime-500' };
    if (aqi <= 200) return { category: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    if (aqi <= 300) return { category: 'Poor', color: 'text-orange-500', bg: 'bg-orange-500' };
    if (aqi <= 400) return { category: 'Very Poor', color: 'text-red-500', bg: 'bg-red-500' };
    return { category: 'Severe', color: 'text-red-800', bg: 'bg-red-800' };
  };

  const currTheme = getCategoryTheme(data.current.current_aqi);
  const predTheme = getCategoryTheme(data.current.predicted_aqi);
  
  // Calculate trend from previous observation if available
  let trendText = 'Stable';
  let TrendIcon = TrendingUp; // default
  let trendColor = 'text-gray-500 bg-gray-50';
  
  if (data.previous && data.previous.current_aqi) {
    const diff = data.current.current_aqi - data.previous.current_aqi;
    if (diff > 0) {
      trendText = `+${diff} (Worsening)`;
      trendColor = 'text-red-600 bg-red-50';
    } else if (diff < 0) {
      trendText = `${diff} (Improving)`;
      trendColor = 'text-green-600 bg-green-50';
      TrendIcon = TrendingDown;
    }
  } else {
     trendText = "Initial Reading";
  }

  const displayData = {
    current: {
      aqi: data.current.current_aqi,
      ...currTheme,
      trend: trendText,
      trendColor: trendColor,
      Icon: TrendIcon,
      trendDesc: data.previous ? 'from previous' : 'no prior data'
    },
    predicted: {
      aqi: data.current.predicted_aqi,
      ...predTheme,
      trend: `${data.current.predicted_aqi > data.current.current_aqi ? '+' : ''}${data.current.predicted_aqi - data.current.current_aqi}`,
      trendColor: data.current.predicted_aqi > data.current.current_aqi ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50',
      Icon: data.current.predicted_aqi > data.current.current_aqi ? TrendingUp : TrendingDown,
      trendDesc: 'expected change'
    }
  };

  const activeData = displayData[view];

  // Calculate SVG stroke dasharray for the gauge (0 to 500 scale)
  const maxAQI = 500;
  const percentage = Math.min((activeData.aqi / maxAQI) * 100, 100);
  const strokeDasharray = `${percentage} 100`;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden group hover:shadow-md transition-shadow">
      
      {/* Header & Toggle */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            🌫️ Air Quality
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Info className="h-4 w-4" />
            </button>
          </h2>
        </div>
        
        {/* Current / Predicted Toggle Switch */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setView('current')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${view === 'current' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Current
          </button>
          <button 
            onClick={() => setView('predicted')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${view === 'predicted' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Predicted
          </button>
        </div>
      </div>

      {/* Main Gauge Visualization */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-4">
        {/* SVG Semi-Circle Gauge */}
        <svg viewBox="0 0 36 36" className="w-48 h-48 drop-shadow-sm transform -rotate-90">
          <path
            className="text-gray-100"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={activeData.color}
            strokeWidth="3"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        
        {/* Central Values */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-6xl font-black tracking-tighter ${activeData.color}`}>
            {activeData.aqi}
          </span>
          <span className={`mt-1 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${activeData.bg}`}>
            {activeData.category}
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-sm">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg font-medium ${activeData.trendColor}`}>
            <activeData.Icon className="h-4 w-4" />
            {activeData.trend}
          </div>
          <span className="text-gray-500">{activeData.trendDesc}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <Clock className="h-3.5 w-3.5" />
          Updated just now
        </div>
      </div>
    </div>
  );
}
