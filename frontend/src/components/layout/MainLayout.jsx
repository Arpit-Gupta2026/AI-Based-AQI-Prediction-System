import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import FloatingAssistant from '../shared/FloatingAssistant';
import { useAQI } from '../../contexts/AQIContext';

export default function MainLayout({ children }) {
  const { data, loading, fetchAQI } = useAQI();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning 🌅');
    else if (hour < 18) setGreeting('Good Afternoon ☀️');
    else setGreeting('Good Evening 🌙');
  }, []);

  const locationName = data?.current?.location_name || 'Loading...';
  const timestamp = data?.current?.timestamp 
    ? new Date(data.current.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    : 'Waiting for data...';

  const handleRefresh = () => {
    if (data?.current?.lat && data?.current?.lon) {
      fetchAQI(data.current.lat, data.current.lon, data.current.location_name);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-gray-700 font-medium">
                    📍 {locationName}
                  </span>
                  <span>•</span>
                  <span>Last updated: {timestamp}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRefresh}
                  disabled={loading}
                  className={`px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </div>
            
            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
      <FloatingAssistant />
    </div>
  );
}
