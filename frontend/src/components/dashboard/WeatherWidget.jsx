import React, { useState } from 'react';
import { Cloud, Droplets, Wind, Sun, Sunrise, Sunset, Eye, Loader } from 'lucide-react';
import { useAQI } from '../../contexts/AQIContext';

export default function WeatherWidget() {
  const { data, loading } = useAQI();
  const [view, setView] = useState('today');

  if (loading || !data?.current) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-3xl shadow-sm h-full flex items-center justify-center min-h-[300px]">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const { temperature, humidity, wind_speed } = data.current;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-3xl shadow-sm h-full relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute -top-10 -right-10 opacity-10">
        <Sun className="w-48 h-48" />
      </div>

      <div className="flex justify-between items-start relative z-10 mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          ☀️ Weather
        </h2>
        
        {/* Toggle */}
        <div className="flex bg-white/20 p-1 rounded-xl backdrop-blur-sm">
          <button 
            onClick={() => setView('today')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${view === 'today' ? 'bg-white text-blue-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setView('forecast')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${view === 'forecast' ? 'bg-white text-blue-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
          >
            Forecast
          </button>
        </div>
      </div>

      {view === 'today' ? (
        <>
          <div className="flex-1 flex flex-col justify-center relative z-10 py-2">
            <div className="flex items-center gap-4">
              <Cloud className="w-16 h-16 text-blue-100" strokeWidth={1.5} />
              <div>
                <div className="text-5xl font-black tracking-tighter">
                  {Math.round(temperature)}<span className="text-3xl text-blue-200 font-bold">°C</span>
                </div>
                <p className="text-blue-100 font-medium mt-1">Live Conditions</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10 mt-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-200" />
              <div>
                <p className="text-xs text-blue-200 font-medium">Humidity</p>
                <p className="text-sm font-bold">{Math.round(humidity)}%</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <Wind className="w-5 h-5 text-blue-200" />
              <div>
                <p className="text-xs text-blue-200 font-medium">Wind</p>
                <p className="text-sm font-bold">{Math.round(wind_speed)} km/h</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-200" />
              <div>
                <p className="text-xs text-blue-200 font-medium">Visibility</p>
                <p className="text-sm font-bold">--</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <Sunset className="w-5 h-5 text-blue-200" />
              <div>
                <p className="text-xs text-blue-200 font-medium">Sunset</p>
                <p className="text-sm font-bold">--:--</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-center gap-3 relative z-10">
          {[
            { day: 'Tomorrow', temp: Math.round(temperature) + 1, icon: Sun },
            { day: 'Wednesday', temp: Math.round(temperature) - 1, icon: Cloud },
            { day: 'Thursday', temp: Math.round(temperature) + 2, icon: Sun }
          ].map((forecast, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
              <span className="font-semibold text-sm">{forecast.day}</span>
              <div className="flex items-center gap-4">
                <forecast.icon className="w-5 h-5 text-blue-200" />
                <span className="font-bold">{forecast.temp}°C</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
