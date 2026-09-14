import React from 'react';
import { Lightbulb, ArrowUpRight, Wind, MapPin } from 'lucide-react';

export default function EnvironmentalInsights() {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-3xl shadow-sm h-full w-full relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="text-lg font-bold flex items-center gap-2">
          ✨ Environmental Insights
        </h2>
      </div>

      <div className="space-y-3 relative z-10 flex-1">
        
        <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
          <div className="mt-0.5 bg-white/20 p-1 rounded-lg">
            <Lightbulb className="h-4 w-4 text-yellow-300" />
          </div>
          <p className="text-sm font-medium leading-relaxed">
            <span className="font-bold text-yellow-200">PM2.5</span> is currently the dominant pollutant in your area.
          </p>
        </div>

        <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
          <div className="mt-0.5 bg-white/20 p-1 rounded-lg">
            <ArrowUpRight className="h-4 w-4 text-red-300" />
          </div>
          <p className="text-sm font-medium leading-relaxed">
            AQI has <span className="font-bold text-red-200">increased by 8%</span> compared with yesterday.
          </p>
        </div>

        <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
          <div className="mt-0.5 bg-white/20 p-1 rounded-lg">
            <MapPin className="h-4 w-4 text-green-300" />
          </div>
          <p className="text-sm font-medium leading-relaxed">
            <span className="font-bold text-green-200">Lodhi Gardens</span> currently has a lower AQI if you want to exercise outdoors.
          </p>
        </div>

      </div>
    </div>
  );
}
