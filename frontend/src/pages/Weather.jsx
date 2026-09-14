import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAQI } from '../contexts/AQIContext';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Cloud, Droplets, Wind, Sun, Loader } from 'lucide-react';

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

export default function Weather() {
  const { data, loading } = useAQI();

  if (loading || !data?.current) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const { lat, lon, location_name, temperature, humidity, wind_speed } = data.current;
  const center = [lat, lon];

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 p-6">
        
        {/* Header Section */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weather Intelligence</h1>
            <p className="text-gray-500 mt-1">Real-time global weather and local conditions</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 font-semibold text-gray-700 flex items-center gap-2">
            📍 {location_name}
          </div>
        </div>

        {/* Top Cards: Specific Location Weather */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-3xl shadow-sm text-white flex flex-col justify-center relative overflow-hidden">
             <Sun className="absolute -right-6 -bottom-6 w-32 h-32 opacity-20" />
             <p className="text-blue-100 font-medium">Temperature</p>
             <div className="text-4xl font-black mt-2 flex items-center gap-3">
               {Math.round(temperature)}°C
               <Sun className="w-8 h-8 text-yellow-300" />
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
               <Droplets className="w-8 h-8" />
             </div>
             <div>
               <p className="text-sm font-bold text-gray-500">Humidity</p>
               <p className="text-2xl font-black text-gray-900">{Math.round(humidity)}%</p>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
               <Wind className="w-8 h-8" />
             </div>
             <div>
               <p className="text-sm font-bold text-gray-500">Wind Speed</p>
               <p className="text-2xl font-black text-gray-900">{Math.round(wind_speed)} km/h</p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
               <Cloud className="w-8 h-8" />
             </div>
             <div>
               <p className="text-sm font-bold text-gray-500">Conditions</p>
               <p className="text-2xl font-black text-gray-900">Clear</p>
             </div>
          </div>
        </div>

        {/* Global Map Section */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">
          <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-200 font-bold text-sm text-gray-700">
            Global Weather Map
          </div>
          
          <MapContainer center={center} zoom={4} zoomControl={false} className="h-full w-full">
            <ChangeView center={center} zoom={4} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ZoomControl position="bottomright" />
            
            <Marker position={center}>
              <Popup className="rounded-xl">
                <div className="text-center font-sans p-1">
                  <h3 className="font-bold text-gray-900 text-base">{location_name}</h3>
                  <div className="mt-2 text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                    <Sun className="w-4 h-4" /> {Math.round(temperature)}°C
                  </div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

      </div>
    </MainLayout>
  );
}
