import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useAQI } from '../../contexts/AQIContext';
import { Loader } from 'lucide-react';

export default function AQITrendChart() {
  const { data: contextData } = useAQI();
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);
  const [dataType, setDataType] = useState('AQI');

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!contextData?.current?.location_name) return;
      
      setLoading(true);
      try {
        const locationName = encodeURIComponent(contextData.current.location_name);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_URL}/api/analytics/historical?location_name=${locationName}`);
        const json = await res.json();
        
        if (json.history) {
          setHistoricalData(json.history);
        }
      } catch (err) {
        console.error("Failed to fetch historical analytics", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistoricalData();
  }, [contextData?.current?.location_name]);

  if (loading || historicalData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center h-full w-full min-h-[300px]">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Format the real history data from SQLite for Recharts
  const chartData = historicalData.map(obs => {
    const d = new Date(obs.timestamp);
    return {
      time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
      aqi: obs.current_aqi,
      pm25: obs.pm25,
      pm10: obs.pm10
    };
  });

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full w-full">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          📈 24H Air Quality Trends
        </h2>
        
        <div className="flex items-center gap-4 flex-wrap">
          {/* Data Type Toggles */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
             {['AQI', 'PM2.5', 'PM10', 'All'].map(type => (
              <button 
                key={type}
                onClick={() => setDataType(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${dataType === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} domain={[0, 'dataMax + 20']} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            />
            
            {dataType === 'AQI' && (
              <>
                <ReferenceLine y={50} stroke="#22c55e" strokeOpacity={0.2} />
                <ReferenceLine y={100} stroke="#eab308" strokeOpacity={0.2} />
                <ReferenceLine y={150} stroke="#f97316" strokeOpacity={0.2} />
              </>
            )}
            
            {(dataType === 'AQI' || dataType === 'All') && (
              <Line 
                type="monotone" 
                dataKey="aqi" 
                name="AQI"
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{r: 3, strokeWidth: 2}}
                activeDot={{r: 6, strokeWidth: 0}}
              />
            )}
            
            {(dataType === 'PM2.5' || dataType === 'All') && (
              <Line 
                type="monotone" 
                dataKey="pm25"
                name="PM2.5" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{r: 3, strokeWidth: 2}}
                activeDot={{r: 6, strokeWidth: 0}}
              />
            )}

            {(dataType === 'PM10' || dataType === 'All') && (
              <Line 
                type="monotone" 
                dataKey="pm10"
                name="PM10" 
                stroke="#f43f5e" 
                strokeWidth={3}
                dot={{r: 3, strokeWidth: 2}}
                activeDot={{r: 6, strokeWidth: 0}}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
