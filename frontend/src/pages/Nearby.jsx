import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAQI } from '../contexts/AQIContext';
import { MapPin, Loader, Navigation } from 'lucide-react';

export default function Nearby() {
  const { data, loading } = useAQI();
  const [nearbyCities, setNearbyCities] = useState([]);
  const [fetching, setFetching] = useState(false);

  const fetchNearby = useCallback(async () => {
    setFetching(true);
    try {
      // Mocking nearby cities based on the current location.
      // In a full production app, this would query a spatial DB or geocoding API for neighbors.
      const mockNearby = [
        { name: "North District", distance: "5 km", aqi: Math.round(data.current.current_aqi * 1.1) },
        { name: "South District", distance: "8 km", aqi: Math.round(data.current.current_aqi * 0.9) },
        { name: "East District", distance: "12 km", aqi: Math.round(data.current.current_aqi * 1.05) },
        { name: "West District", distance: "15 km", aqi: Math.round(data.current.current_aqi * 0.85) },
        { name: "Industrial Zone", distance: "22 km", aqi: Math.round(data.current.current_aqi * 1.4) },
      ];
      
      // Simulate API delay
      setTimeout(() => {
        setNearbyCities(mockNearby);
        setFetching(false);
      }, 800);
      
    } catch (err) {
      console.error(err);
      setFetching(false);
    }
  }, [data]);

  useEffect(() => {
    if (data?.current) {
      fetchNearby();
    }
  }, [data?.current?.location_name, fetchNearby]);

  const getCategoryColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600 bg-green-50';
    if (aqi <= 100) return 'text-lime-600 bg-lime-50';
    if (aqi <= 200) return 'text-yellow-600 bg-yellow-50';
    if (aqi <= 300) return 'text-orange-600 bg-orange-50';
    if (aqi <= 400) return 'text-red-600 bg-red-50';
    return 'text-red-900 bg-red-100';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Navigation className="w-8 h-8 text-blue-600" /> Nearby Locations
            </h1>
            <p className="text-gray-500 mt-1">Air quality in surrounding areas near {data?.current?.location_name || 'you'}.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-4 overflow-hidden">
          {fetching ? (
            <div className="p-12 flex flex-col items-center justify-center">
               <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" />
               <p className="text-gray-500 font-medium">Scanning surrounding area...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {nearbyCities.map((city, idx) => (
                <div key={idx} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{city.name}</h3>
                      <p className="text-sm font-medium text-gray-500">{city.distance} away</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black text-xl ${getCategoryColor(city.aqi)}`}>
                    {city.aqi} AQI
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
