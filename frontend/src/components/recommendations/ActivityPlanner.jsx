import React, { useState } from 'react';
import { PersonStanding, AlertTriangle, CheckCircle, Info, Loader } from 'lucide-react';
import { useAQI } from '../../contexts/AQIContext';

export default function ActivityPlanner() {
  const { data, loading } = useAQI();
  const [activity, setActivity] = useState('Running');

  if (loading || !data?.recommendation) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[300px] w-full">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // The backend already calculates the recommendation based on the current AQI.
  // In a full implementation, we could pass the 'activity' to the backend to get a specific rec,
  // but for now we use the general one provided by the centralized API.
  const { aqi_category, recommendation, precautions } = data.recommendation;
  
  const isGood = aqi_category === 'Good' || aqi_category === 'Satisfactory';

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full w-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          🏃 Outdoor Activity Advisor
        </h2>
      </div>

      <div className="space-y-4 relative z-10 flex-1">
        
        {/* Activity Selector */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Select Activity</label>
          <div className="grid grid-cols-2 gap-2">
            {['Walking', 'Running', 'Cycling', 'Sports'].map(act => (
              <button 
                key={act}
                onClick={() => setActivity(act)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all border ${activity === act ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendation Result */}
        <div className={`rounded-2xl p-4 border ${isGood ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
          <div className={`flex items-center gap-2 font-bold mb-2 uppercase tracking-wide text-sm ${isGood ? 'text-green-600' : 'text-orange-600'}`}>
            {isGood ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {aqi_category}
          </div>
          <p className={`text-sm font-medium ${isGood ? 'text-green-900' : 'text-orange-900'}`}>
            {recommendation}
          </p>
        </div>

        <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
          <Info className="h-4 w-4 text-gray-400" />
          {precautions[0] || "View Detailed Precautions"}
        </button>

      </div>
    </div>
  );
}
