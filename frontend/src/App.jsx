import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import Analytics from './pages/Analytics';
import Activities from './pages/Activities';
import MapPage from './pages/MapPage';
import Prediction from './pages/Prediction';
import Compare from './pages/Compare';
import Nearby from './pages/Nearby';
import History from './pages/History';
import Info from './pages/Info';
import Settings from './pages/Settings';
import Assistant from './pages/Assistant';
import { AQIProvider } from './contexts/AQIContext';

function App() {
  return (
    <AQIProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<History />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/info" element={<Info />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Default fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AQIProvider>
  );
}

export default App;
