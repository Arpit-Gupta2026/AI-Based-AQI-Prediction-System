import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Settings as SettingsIcon, Bell, Moon, Globe, Shield } from 'lucide-react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [celsius, setCelsius] = useState(true);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-blue-600" /> Settings
            </h1>
            <p className="text-gray-500 mt-1">Manage your application preferences.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-4 overflow-hidden divide-y divide-gray-100">
          
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive alerts when AQI reaches unhealthy levels.</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 rounded-full transition-colors relative ${notifications ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`}></div>
            </button>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-3 rounded-full text-purple-600">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Dark Mode</h3>
                <p className="text-sm text-gray-500">Switch to a dark UI theme.</p>
              </div>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-8 rounded-full transition-colors relative ${darkMode ? 'bg-purple-600' : 'bg-gray-200'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
            </button>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 p-3 rounded-full text-orange-600">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Temperature Unit</h3>
                <p className="text-sm text-gray-500">Choose between Celsius and Fahrenheit.</p>
              </div>
            </div>
            <div className="bg-gray-100 p-1 rounded-xl flex items-center">
              <button onClick={() => setCelsius(true)} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${celsius ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>°C</button>
              <button onClick={() => setCelsius(false)} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${!celsius ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>°F</button>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-full text-green-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Privacy & Data</h3>
                <p className="text-sm text-gray-500">Manage location permissions and history.</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors">
              Manage
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
