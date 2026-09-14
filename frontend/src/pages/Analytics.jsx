import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAQI } from '../contexts/AQIContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Loader, TrendingUp, BarChart2, PieChart as PieChartIcon } from 'lucide-react';

export default function Analytics() {
  const { data, loading } = useAQI();

  if (loading || !data?.history || data.history.length === 0) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  // Format data for Recharts
  const historyData = data.history.map(item => {
    const dateObj = new Date(item.timestamp);
    return {
      time: `${dateObj.getHours()}:00`,
      date: dateObj.toLocaleDateString(),
      AQI: item.aqi,
      'PM2.5': item.pm25,
      'PM10': item.pm10,
    };
  }).reverse(); // chronological order

  const current = data.current;
  
  // Data for Pie Chart
  const pieData = [
    { name: 'PM2.5', value: current.pm25, color: '#3b82f6' }, // blue-500
    { name: 'PM10', value: current.pm10, color: '#10b981' },  // emerald-500
    { name: 'NO2', value: 25, color: '#f59e0b' },             // amber-500 (mock data)
    { name: 'O3', value: 30, color: '#ef4444' },              // red-500 (mock data)
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-6">
        
        {/* Header Section */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" /> Advanced Analytics
            </h1>
            <p className="text-gray-500 mt-1">Deep dive into air quality trends for {data.current.location_name}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          
          {/* Main Trend Line Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[450px]">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-500" /> Historical AQI Trend (Last 24h)
            </h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="AQI" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAQI)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pollutant Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[450px]">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-emerald-500" /> Pollutant Breakdown
            </h2>
            <p className="text-sm text-gray-500 mb-6">Current composition of air pollutants</p>
            <div className="flex-1 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} µg/m³`, 'Concentration']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-gray-900">{current.aqi}</span>
                <span className="text-xs font-bold text-gray-400">Total AQI</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparative Line Chart */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" /> PM2.5 vs PM10 Comparison (Last 24h)
            </h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="PM2.5" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="PM10" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
