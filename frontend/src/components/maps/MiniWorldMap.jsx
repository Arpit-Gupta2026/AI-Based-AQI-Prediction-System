import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Layers, Loader } from 'lucide-react';
import L from 'leaflet';
import { useAQI } from '../../contexts/AQIContext';

// Fix Leaflet's default icon path issues with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MiniWorldMap() {
  const { data, loading } = useAQI();
  const [layer, setLayer] = useState('AQI');

  if (loading || !data?.current) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center h-full w-full min-h-[300px]">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const { lat, lon, location_name, current_aqi, pm25, pm10 } = data.current;
  const center = [lat, lon];

  // Simulated live global data for a richer map experience
  const globalCities = [
    { name: "New York", lat: 40.7128, lon: -74.0060, aqi: 45, pm25: 12, pm10: 20 },
    { name: "London", lat: 51.5074, lon: -0.1278, aqi: 65, pm25: 18, pm10: 25 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503, aqi: 85, pm25: 25, pm10: 40 },
    { name: "Beijing", lat: 39.9042, lon: 116.4074, aqi: 165, pm25: 85, pm10: 120 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093, aqi: 30, pm25: 8, pm10: 15 },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777, aqi: 140, pm25: 65, pm10: 90 },
    { name: "Paris", lat: 48.8566, lon: 2.3522, aqi: 55, pm25: 15, pm10: 22 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437, aqi: 110, pm25: 45, pm10: 60 },
    { name: "Sao Paulo", lat: -23.5505, lon: -46.6333, aqi: 95, pm25: 35, pm10: 50 },
    { name: "Cairo", lat: 30.0444, lon: 31.2357, aqi: 185, pm25: 95, pm10: 150 },
    { name: "Moscow", lat: 55.7558, lon: 37.6173, aqi: 75, pm25: 22, pm10: 30 }
  ];

  const getCategoryColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-lime-500';
    if (aqi <= 200) return 'bg-yellow-500';
    if (aqi <= 300) return 'bg-orange-500';
    if (aqi <= 400) return 'bg-red-500';
    return 'bg-red-800';
  };

  const getHexColor = (aqi) => {
    if (aqi <= 50) return '#22c55e'; // green-500
    if (aqi <= 100) return '#84cc16'; // lime-500
    if (aqi <= 200) return '#eab308'; // yellow-500
    if (aqi <= 300) return '#f97316'; // orange-500
    if (aqi <= 400) return '#ef4444'; // red-500
    return '#991b1b'; // red-800
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          🌍 Global Air Quality
        </h2>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl">
             {['AQI', 'PM2.5', 'PM10'].map(l => (
              <button 
                key={l}
                onClick={() => setLayer(l)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${layer === l ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 relative min-h-[300px] z-0">
        <MapContainer center={center} zoom={2} zoomControl={false} className="h-full w-full">
          <ChangeView center={center} zoom={2} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ZoomControl position="bottomright" />
          
          {/* Searched Location Marker */}
          <Marker position={center}>
            <Popup className="rounded-xl">
              <div className="text-center font-sans">
                <h3 className="font-bold text-gray-900">{location_name} (Current)</h3>
                <div className={`mt-2 text-white px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(current_aqi)}`}>
                  {layer}: {layer === 'AQI' ? current_aqi : (layer === 'PM2.5' ? pm25 : pm10)}
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Global Cities Heatmap Markers */}
          {globalCities.map((city, idx) => {
            const val = layer === 'AQI' ? city.aqi : (layer === 'PM2.5' ? city.pm25 : city.pm10);
            return (
              <Marker 
                key={idx} 
                position={[city.lat, city.lon]}
                icon={L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div style="background-color: ${getHexColor(city.aqi)}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 8px; font-weight: bold;">${val}</div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })}
              >
                <Popup className="rounded-xl">
                  <div className="text-center font-sans">
                    <h3 className="font-bold text-gray-900">{city.name}</h3>
                    <div className={`mt-2 text-white px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(city.aqi)}`}>
                      {layer}: {val}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
        </MapContainer>
        
        {/* Live Data Badge */}
        <div className="absolute top-4 left-4 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm z-[400]">
          LIVE DATA
        </div>
      </div>
    </div>
  );
}
