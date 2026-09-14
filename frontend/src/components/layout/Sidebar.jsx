import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Activity, Map, MapPin, BarChart2, History, 
  ArrowLeftRight, PersonStanding, Bot, CloudRain, Info, Settings 
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Activity, label: 'AQI Prediction', path: '/prediction' },
  { icon: Map, label: 'World AQI Map', path: '/map' },
  { icon: MapPin, label: 'Nearby AQI', path: '/nearby' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: History, label: 'History', path: '/history' },
  { icon: ArrowLeftRight, label: 'Compare Locations', path: '/compare' },
  { icon: PersonStanding, label: 'Outdoor Activities', path: '/activities' },
  { icon: Bot, label: 'AI Assistant', path: '/assistant' },
  { icon: CloudRain, label: 'Weather', path: '/weather' },
];

const secondaryItems = [
  { icon: Info, label: 'AQI Information', path: '/info' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col hidden lg:flex">
      <div className="p-6 flex items-center gap-3">
        <Activity className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold text-gray-900 tracking-tight">EcoGuard</span>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Main Menu</p>
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={idx} 
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}

        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-8">System</p>
        {secondaryItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={idx} 
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center text-center">
          <div className="bg-white p-2 rounded-full mb-2 shadow-sm">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-900">Need help?</p>
          <p className="text-xs text-gray-500 mb-3">Ask the AI Assistant</p>
          <Link to="/assistant" className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition-colors">
            Open Chat
          </Link>
        </div>
      </div>
    </aside>
  );
}
