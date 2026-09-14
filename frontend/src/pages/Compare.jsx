import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAQI } from '../contexts/AQIContext';
import { GitCompare, Search, Loader, Wind, Thermometer, Droplets } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function Compare() {
  const { data: globalData } = useAQI();
  const [city1, setCity1] = useState(globalData?.current?.location_name || 'Delhi');
  const [city2, setCity2] = useState('Mumbai');
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!city1.trim() || !city2.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch data for both cities from our backend API
      // Since our backend takes lat/lon, we first need to geocode.
      // To keep it simple and fast, we'll use Nominatim directly, then hit our backend.
      
      const geocode = async (city) => {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
        const json = await res.json();
        if (!json || json.length === 0) throw new Error(`Could not find location: ${city}`);
        return { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon), name: json[0].display_name.split(',')[0] };
      };

      const loc1 = await geocode(city1);
      const loc2 = await geocode(city2);

      const fetchAQI = async (loc) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_URL}/api/aqi/current?lat=${loc.lat}&lon=${loc.lon}&location_name=${encodeURIComponent(loc.name)}`);
        if (!res.ok) throw new Error(`Backend error for ${loc.name}`);
        return await res.json();
      };

      const aqi1 = await fetchAQI(loc1);
      const aqi2 = await fetchAQI(loc2);

      setCompareData({ city1: aqi1, city2: aqi2 });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to compare locations.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = compareData ? [
    {
      name: 'Overall AQI',
      [compareData.city1.location_name]: compareData.city1.current_aqi,
      [compareData.city2.location_name]: compareData.city2.current_aqi,
    },
    {
      name: 'PM 2.5',
      [compareData.city1.location_name]: compareData.city1.pm25,
      [compareData.city2.location_name]: compareData.city2.pm25,
    },
    {
      name: 'PM 10',
      [compareData.city1.location_name]: compareData.city1.pm10,
      [compareData.city2.location_name]: compareData.city2.pm10,
    }
  ] : [];

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
        
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <GitCompare className="w-8 h-8 text-blue-600" /> Compare Locations
            </h1>
            <p className="text-gray-500 mt-1">Side-by-side air quality and weather comparison.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mt-4">
          <form onSubmit={handleCompare} className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="text-sm font-bold text-gray-700 mb-2 block">City 1</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={city1} onChange={(e)=>setCity1(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            
            <div className="hidden md:flex pb-3 text-gray-400 font-bold">VS</div>
            
            <div className="flex-1 w-full">
              <label className="text-sm font-bold text-gray-700 mb-2 block">City 2</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={city2} onChange={(e)=>setCity2(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors h-[50px] w-full md:w-auto">
              {loading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Compare Now'}
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3 text-center font-medium">{error}</p>}
        </div>

        {/* Results */}
        {compareData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            
            {/* Chart Area */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[400px]">
               <h2 className="text-lg font-bold text-gray-900 mb-6">Pollution Comparison</h2>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                   <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} />
                   <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                   <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                   <Bar dataKey={compareData.city1.location_name} fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                   <Bar dataKey={compareData.city2.location_name} fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60} />
                 </BarChart>
               </ResponsiveContainer>
            </div>

            {/* City 1 Details */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-t-blue-500">
               <h3 className="text-2xl font-black text-gray-900 text-center mb-6">{compareData.city1.location_name}</h3>
               <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                   <div className="flex items-center gap-3 text-gray-700 font-bold"><Wind className="text-gray-400"/> Total AQI</div>
                   <div className="text-2xl font-black">{compareData.city1.current_aqi}</div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                   <div className="flex items-center gap-3 text-gray-700 font-bold"><Thermometer className="text-orange-500"/> Temperature</div>
                   <div className="text-xl font-bold">{Math.round(compareData.city1.temperature)}°C</div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                   <div className="flex items-center gap-3 text-gray-700 font-bold"><Droplets className="text-blue-500"/> Humidity</div>
                   <div className="text-xl font-bold">{Math.round(compareData.city1.humidity)}%</div>
                 </div>
               </div>
            </div>

            {/* City 2 Details */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-t-emerald-500">
               <h3 className="text-2xl font-black text-gray-900 text-center mb-6">{compareData.city2.location_name}</h3>
               <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                   <div className="flex items-center gap-3 text-gray-700 font-bold"><Wind className="text-gray-400"/> Total AQI</div>
                   <div className="text-2xl font-black">{compareData.city2.current_aqi}</div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                   <div className="flex items-center gap-3 text-gray-700 font-bold"><Thermometer className="text-orange-500"/> Temperature</div>
                   <div className="text-xl font-bold">{Math.round(compareData.city2.temperature)}°C</div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                   <div className="flex items-center gap-3 text-gray-700 font-bold"><Droplets className="text-blue-500"/> Humidity</div>
                   <div className="text-xl font-bold">{Math.round(compareData.city2.humidity)}%</div>
                 </div>
               </div>
            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
}
