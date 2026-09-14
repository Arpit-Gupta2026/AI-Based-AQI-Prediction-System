import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, Layers, Loader } from 'lucide-react';
import { useAQI } from '../contexts/AQIContext';

// Fix Leaflet's default icon path issues with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map flying when coordinates change
function MapFlyTo({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, map, zoom]);
  return null;
}

export default function MapPage() {
  const { data } = useAQI();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Default to global view or user's current context
  const defaultCenter = data?.current ? [data.current.lat, data.current.lon] : [20, 0];
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerData, setMarkerData] = useState(data?.current ? {
    lat: data.current.lat,
    lon: data.current.lon,
    name: data.current.location_name
  } : null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // 1. Geocode the address using Nominatim
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const results = await response.json();

      if (results && results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const newCenter = [parseFloat(lat), parseFloat(lon)];
        
        // 2. Fly to location and set marker
        setMapCenter(newCenter);
        setMarkerData({
          lat: newCenter[0],
          lon: newCenter[1],
          name: display_name.split(',')[0] // Short name
        });
      } else {
        alert("Location not found. Please try a different address.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Error searching for location.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <MainLayout>
      <div className="relative h-[calc(100vh-5rem)] w-full flex flex-col bg-gray-50">
        
        {/* Map Header Overlay */}
        <div className="absolute top-6 left-6 right-6 z-[400] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white pointer-events-auto">
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              🌍 Interactive World AQI
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Live Global Air Quality Heatmap</p>
          </div>

          {/* Map Search Bar */}
          <form 
            onSubmit={handleSearch} 
            className="w-full md:w-96 bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white flex items-center gap-2 pointer-events-auto"
          >
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any address or city globally..."
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium px-3 text-gray-700 placeholder-gray-400"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSearching ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-8 left-6 z-[400] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white pointer-events-auto">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" /> AQI Heatmap Scale
          </h3>
          <div className="flex flex-col gap-2 text-xs font-bold text-gray-700">
            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-green-500"></div> Good (0-50)</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-yellow-400"></div> Moderate (51-100)</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-orange-500"></div> Unhealthy for Sensitive (101-150)</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-red-500"></div> Unhealthy (151-200)</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-purple-600"></div> Very Unhealthy (201-300)</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-rose-900"></div> Hazardous (300+)</div>
          </div>
        </div>

        {/* Full Screen Map */}
        <div className="flex-1 w-full relative z-0">
          <MapContainer 
            center={defaultCenter} 
            zoom={data?.current ? 10 : 3} 
            zoomControl={false} 
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <MapFlyTo center={mapCenter} zoom={11} />
            
            {/* Standard Basemap */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {/* WAQI Global Heatmap Overlay */}
            <TileLayer
              url="https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=9e15647a61d15d658b4566d529241b714b304c52"
              attribution='Air Quality Tiles &copy; <a href="http://waqi.info">waqi.info</a>'
              opacity={0.8}
            />

            <ZoomControl position="bottomright" />

            {/* User Search Marker */}
            {markerData && (
              <Marker position={[markerData.lat, markerData.lon]}>
                <Popup className="rounded-xl font-sans">
                  <div className="text-center p-1">
                    <h3 className="font-bold text-gray-900">{markerData.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" /> Targeted Location
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

          </MapContainer>
        </div>

      </div>
    </MainLayout>
  );
}
