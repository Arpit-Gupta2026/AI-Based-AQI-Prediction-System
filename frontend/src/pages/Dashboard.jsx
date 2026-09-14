import React from 'react';
import MainLayout from '../components/layout/MainLayout';

import AQIHeroCard from '../components/dashboard/AQIHeroCard';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import PollutantGrid from '../components/dashboard/PollutantGrid';
import AQITrendChart from '../components/dashboard/AQITrendChart';
import EnvironmentalInsights from '../components/dashboard/EnvironmentalInsights';

import MiniWorldMap from '../components/maps/MiniWorldMap';
import NearbyAQI from '../components/maps/NearbyAQI';

import ActivityPlanner from '../components/recommendations/ActivityPlanner';

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Row: AQI Hero and Weather */}
        <div className="lg:col-span-8 h-full min-h-[300px]">
          <AQIHeroCard />
        </div>
        <div className="lg:col-span-4 h-full min-h-[300px]">
           <WeatherWidget />
        </div>

        {/* Middle Row: Pollutants Grid */}
        <div className="lg:col-span-12">
           <PollutantGrid />
        </div>

        {/* Chart Row */}
        <div className="lg:col-span-12 h-[400px]">
           <AQITrendChart />
        </div>

        {/* Map and Nearby AQI */}
        <div className="lg:col-span-8 h-[550px]">
           <MiniWorldMap />
        </div>
        <div className="lg:col-span-4 space-y-6 h-full flex flex-col">
           <div className="flex-1">
              <NearbyAQI />
           </div>
           <div className="flex-1">
              <ActivityPlanner />
           </div>
        </div>
        
        {/* Insights Row */}
        <div className="lg:col-span-12">
           <EnvironmentalInsights />
        </div>

      </div>
    </MainLayout>
  );
}
