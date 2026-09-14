import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAQI } from '../contexts/AQIContext';
import { Clock, Loader, Calendar } from 'lucide-react';

export default function History() {
  const { data, loading } = useAQI();

  if (loading || !data?.history) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  // Sort history chronologically descending
  const sortedHistory = [...data.history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const getCategoryColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600 bg-green-50 border-green-100';
    if (aqi <= 100) return 'text-lime-600 bg-lime-50 border-lime-100';
    if (aqi <= 200) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    if (aqi <= 300) return 'text-orange-600 bg-orange-50 border-orange-100';
    if (aqi <= 400) return 'text-red-600 bg-red-50 border-red-100';
    return 'text-red-900 bg-red-100 border-red-200';
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" /> Historical Log
            </h1>
            <p className="text-gray-500 mt-1">Detailed past air quality records for {data?.current?.location_name || 'your location'}.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-bold rounded-tl-3xl">Date & Time</th>
                  <th className="p-4 font-bold">Total AQI</th>
                  <th className="p-4 font-bold">PM 2.5</th>
                  <th className="p-4 font-bold">PM 10</th>
                  <th className="p-4 font-bold rounded-tr-3xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedHistory.map((item, idx) => {
                  const date = new Date(item.timestamp);
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {date.toLocaleDateString()} at {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="p-4 font-black text-gray-900">{item.aqi}</td>
                      <td className="p-4 font-medium text-gray-600">{item.pm25} µg/m³</td>
                      <td className="p-4 font-medium text-gray-600">{item.pm10} µg/m³</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getCategoryColor(item.aqi)}`}>
                          {item.aqi <= 50 ? 'Good' : item.aqi <= 100 ? 'Moderate' : item.aqi <= 200 ? 'Unhealthy for Sensitive' : 'Unhealthy'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
