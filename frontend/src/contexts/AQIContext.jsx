import React, { createContext, useContext, useState, useEffect } from 'react';

const AQIContext = createContext();

export function useAQI() {
  return useContext(AQIContext);
}

export function AQIProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchLocationData = async (lat, lon, locationName = 'Unknown Location') => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const [currentRes, historyRes] = await Promise.all([
        fetch(`${API_URL}/api/aqi/current?lat=${lat}&lon=${lon}&location_name=${locationName}`),
        fetch(`${API_URL}/api/aqi/history?location_name=${locationName}`)
      ]);
      
      if (!currentRes.ok || !historyRes.ok) {
        throw new Error('Failed to fetch AQI data');
      }
      
      const currentData = await currentRes.json();
      const historyData = await historyRes.json();
      
      setData({ ...currentData, history: historyData.history });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // By default, load Delhi data if no location is specified
  useEffect(() => {
    fetchLocationData(28.6139, 77.2090, 'Delhi');
  }, []);

  const value = {
    data,
    loading,
    error,
    fetchLocationData,
  };

  return (
    <AQIContext.Provider value={value}>
      {children}
    </AQIContext.Provider>
  );
}
