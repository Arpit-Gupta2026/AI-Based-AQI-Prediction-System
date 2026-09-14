import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Info as InfoIcon, BookOpen, AlertCircle } from 'lucide-react';

export default function Info() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" /> Educational Info
            </h1>
            <p className="text-gray-500 mt-1">Understanding the Air Quality Index and Pollutants.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-4 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <InfoIcon className="text-blue-500" /> What is the AQI?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            The Air Quality Index (AQI) is used for reporting daily air quality. It tells you how clean or polluted your air is, and what associated health effects might be a concern for you. The AQI focuses on health effects you may experience within a few hours or days after breathing polluted air.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">AQI Categories</h3>
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-xl border-l-4 border-green-500 bg-green-50">
              <strong className="text-green-800">Good (0 - 50):</strong> Air quality is satisfactory, and air pollution poses little or no risk.
            </div>
            <div className="p-4 rounded-xl border-l-4 border-yellow-400 bg-yellow-50">
              <strong className="text-yellow-800">Moderate (51 - 100):</strong> Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.
            </div>
            <div className="p-4 rounded-xl border-l-4 border-orange-500 bg-orange-50">
              <strong className="text-orange-800">Unhealthy for Sensitive Groups (101 - 150):</strong> Members of sensitive groups may experience health effects. The general public is less likely to be affected.
            </div>
            <div className="p-4 rounded-xl border-l-4 border-red-500 bg-red-50">
              <strong className="text-red-800">Unhealthy (151 - 200):</strong> Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.
            </div>
            <div className="p-4 rounded-xl border-l-4 border-purple-600 bg-purple-50">
              <strong className="text-purple-800">Very Unhealthy (201 - 300):</strong> Health alert: The risk of health effects is increased for everyone.
            </div>
            <div className="p-4 rounded-xl border-l-4 border-rose-900 bg-rose-50">
              <strong className="text-rose-900">Hazardous (301 and higher):</strong> Health warning of emergency conditions: everyone is more likely to be affected.
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4 mt-10">Common Pollutants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 border border-gray-200 rounded-2xl">
              <h4 className="font-bold text-gray-900 mb-2">PM 2.5</h4>
              <p className="text-sm text-gray-600">Fine particulate matter. Tiny particles in the air that reduce visibility and cause the air to appear hazy when levels are elevated. Due to their small size, they can travel deeply into the respiratory tract.</p>
            </div>
            <div className="p-5 border border-gray-200 rounded-2xl">
              <h4 className="font-bold text-gray-900 mb-2">PM 10</h4>
              <p className="text-sm text-gray-600">Inhalable particulate matter. Slightly larger particles that can irritate the eyes, nose, and throat. Common sources include dust from construction sites, landfills, and agriculture.</p>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
