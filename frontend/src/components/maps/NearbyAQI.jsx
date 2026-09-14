import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const nearbyLocations = [
  { id: 1, name: 'Connaught Place', distance: '2.1 km', aqi: 142, category: 'Poor', pm25: 65, color: 'text-orange-600 bg-orange-50' },
  { id: 2, name: 'India Gate', distance: '4.8 km', aqi: 98, category: 'Moderate', pm25: 45, color: 'text-yellow-600 bg-yellow-50' },
  { id: 3, name: 'Lodhi Gardens', distance: '7.2 km', aqi: 121, category: 'Moderate', pm25: 55, color: 'text-yellow-600 bg-yellow-50' },
];

export default function NearbyAQI() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          📍 Air Quality Around You
        </h2>
      </div>

      <div className="space-y-3 flex-1">
        {nearbyLocations.map(loc => (
          <div key={loc.id} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${loc.color}`}>
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{loc.name}</h4>
                <p className="text-xs text-gray-500">{loc.distance}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="font-bold text-gray-900">{loc.aqi}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">AQI</span>
              </div>
              <p className={`text-[10px] font-bold uppercase ${loc.color.split(' ')[0]}`}>{loc.category}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl transition-colors">
        <Navigation className="h-4 w-4" />
        View on Map
      </button>
    </div>
  );
}
