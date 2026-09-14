import React, { useState } from 'react';
import { Search, MapPin, Bell, Moon, User, RefreshCw, Loader } from 'lucide-react';
import { useAQI } from '../../contexts/AQIContext';

export default function TopNav() {
  const { data, loading, fetchLocationData } = useAQI();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [locPermission, setLocPermission] = useState(null); // null, 'granted', 'denied'

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      // Use free Nominatim geocoding API
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const results = await res.json();
      
      if (results && results.length > 0) {
        const { lat, lon, display_name } = results[0];
        // Split by comma and take first part as city name
        const cityName = display_name.split(',')[0];
        fetchLocationData(lat, lon, cityName);
        setSearchQuery('');
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocPermission('loading');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocPermission('granted');
        const { latitude, longitude } = position.coords;
        // Optional: Reverse geocode to get city name, or just use coords
        try {
           const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
           const result = await res.json();
           const city = result.address?.city || result.address?.town || result.address?.village || "My Location";
           fetchLocationData(latitude, longitude, city);
        } catch {
           fetchLocationData(latitude, longitude, "My Location");
        }
      },
      (error) => {
        setLocPermission('denied');
        alert("Location access denied or unavailable.");
      }
    );
  };

  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would toggle a global tailwind dark class
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      alert("Dark mode is currently a UI placeholder toggle.");
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-10 sticky top-0">
      
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Good Evening 👋</h2>
          <p className="text-xs text-gray-500">Air Quality Intelligence Dashboard</p>
        </div>
      </div>

      {/* Center Search & Actions */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search city..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          {searchLoading && <Loader className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />}
        </form>

        <button 
          onClick={handleUseMyLocation}
          className={`flex items-center gap-2 text-sm font-semibold border py-2 px-3 rounded-xl transition-colors ${locPermission === 'granted' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'}`}
        >
          {locPermission === 'loading' ? <Loader className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          {locPermission === 'granted' ? 'Location Enabled' : 'Use My Location'}
        </button>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3 relative">
        {data?.current?.timestamp && (
          <span className="text-xs text-gray-400 mr-2">
            Last updated: {new Date(data.current.timestamp).toLocaleTimeString()}
          </span>
        )}
        <button 
          onClick={() => {
            if (data?.current) {
              fetchLocationData(data.current.lat, data.current.lon, data.current.location_name);
            }
          }}
          className={`p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors ${loading ? 'animate-spin' : ''}`}
          title="Refresh Data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
        
        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              </div>
              <div className="p-4 text-xs text-gray-500">
                {data?.current?.current_aqi > 100 ? (
                  <p className="text-orange-600 font-medium">⚠️ AQI is poor in your selected area. Consider reducing outdoor activity.</p>
                ) : (
                  <p>Air quality looks good today! No active alerts.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode */}
        <button 
          onClick={toggleDarkMode}
          className={`p-2 rounded-xl transition-colors ${darkMode ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
        >
          <Moon className="h-5 w-5" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors ml-1 border border-gray-200 bg-gray-50"
          >
            <User className="h-5 w-5" />
          </button>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">Demo User</p>
                <p className="text-xs text-gray-500">user@ecoguard.com</p>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
