import React from 'react';
import { TrendingUp, TrendingDown, Minus, Loader } from 'lucide-react';
import { useAQI } from '../../contexts/AQIContext';

const TrendIcon = ({ type, className }) => {
  if (type === 'up') return <TrendingUp className={className} />;
  if (type === 'down') return <TrendingDown className={className} />;
  return <Minus className={className} />;
};

export default function PollutantGrid() {
  const { data, loading } = useAQI();

  if (loading || !data?.current) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[150px] w-full">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const { pm25, pm10, no2, so2, co, o3 } = data.current;

  // Helper to determine status and mock a trend based on live value
  const getStatus = (val, threshold) => val > threshold ? 'High' : (val > threshold/2 ? 'Moderate' : 'Low');
  
  const pollutants = [
    { id: 'pm25', name: 'PM2.5', icon: '🟣', value: Math.round(pm25), unit: 'µg/m³', status: getStatus(pm25, 35), trend: 'up', trendVal: 'Live', color: 'purple' },
    { id: 'pm10', name: 'PM10', icon: '🟠', value: Math.round(pm10), unit: 'µg/m³', status: getStatus(pm10, 50), trend: 'up', trendVal: 'Live', color: 'indigo' },
    { id: 'no2', name: 'NO₂', icon: '🔵', value: Math.round(no2), unit: 'µg/m³', status: getStatus(no2, 40), trend: 'flat', trendVal: 'Live', color: 'orange' },
    { id: 'so2', name: 'SO₂', icon: '🟡', value: Math.round(so2), unit: 'µg/m³', status: getStatus(so2, 20), trend: 'down', trendVal: 'Live', color: 'yellow' },
    { id: 'o3', name: 'O₃', icon: '🟦', value: Math.round(o3), unit: 'µg/m³', status: getStatus(o3, 100), trend: 'down', trendVal: 'Live', color: 'cyan' },
    { id: 'co', name: 'CO', icon: '⚪', value: co.toFixed(1), unit: 'mg/m³', status: getStatus(co, 4.0), trend: 'flat', trendVal: 'Live', color: 'gray' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
      {pollutants.map((pol) => {
        const isUp = pol.trend === 'up';
        const isFlat = pol.trend === 'flat';
        
        let trendColor = 'text-green-600 bg-green-50'; // down is good for pollution
        if (isUp) trendColor = 'text-red-600 bg-red-50'; // up is bad
        if (isFlat) trendColor = 'text-gray-600 bg-gray-50';

        return (
          <div 
            key={pol.id} 
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xl">{pol.icon}</span>
                <span className="font-semibold text-gray-700">{pol.name}</span>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight text-gray-900">{pol.value}</span>
                <span className="text-xs text-gray-500 font-medium">{pol.unit}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                {pol.status}
              </span>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${trendColor}`}>
                <TrendIcon type={pol.trend} className="w-3 h-3" />
                {pol.trendVal}
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-xl bg-gray-900"></div>
          </div>
        );
      })}
    </div>
  );
}
