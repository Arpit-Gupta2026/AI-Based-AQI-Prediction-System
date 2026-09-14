import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAQI } from '../contexts/AQIContext';
import { Loader, Activity, Bike, Footprints, HeartPulse, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Activities() {
  const { data, loading } = useAQI();
  const [selectedActivity, setSelectedActivity] = useState('running');

  if (loading || !data?.current) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const aqi = data.current.current_aqi;

  const activitiesList = [
    { id: 'running', name: 'Running', icon: <Activity className="w-6 h-6" />, intensity: 'High' },
    { id: 'cycling', name: 'Cycling', icon: <Bike className="w-6 h-6" />, intensity: 'Medium' },
    { id: 'walking', name: 'Walking', icon: <Footprints className="w-6 h-6" />, intensity: 'Low' },
    { id: 'workout', name: 'Outdoor Workout', icon: <HeartPulse className="w-6 h-6" />, intensity: 'High' }
  ];

  const getSafetyRecommendation = (activityId, aqiValue) => {
    const activity = activitiesList.find(a => a.id === activityId);
    const isHighIntensity = activity.intensity === 'High';

    if (aqiValue <= 50) {
      return {
        safe: true,
        title: "Perfect Conditions!",
        desc: `The air quality is excellent. It is a perfect time for ${activity.name.toLowerCase()} outdoors. Enjoy your activity without any restrictions.`,
        color: 'bg-green-500',
        lightBg: 'bg-green-50',
        textColor: 'text-green-700'
      };
    } else if (aqiValue <= 100) {
      return {
        safe: true,
        title: "Good Conditions",
        desc: `The air quality is acceptable. You can proceed with ${activity.name.toLowerCase()}, but if you are unusually sensitive to air pollution, consider reducing prolonged or heavy exertion.`,
        color: 'bg-lime-500',
        lightBg: 'bg-lime-50',
        textColor: 'text-lime-700'
      };
    } else if (aqiValue <= 150) {
      return {
        safe: !isHighIntensity,
        title: isHighIntensity ? "Exercise Caution" : "Acceptable for Low Intensity",
        desc: `Air quality is unhealthy for sensitive groups. Since ${activity.name.toLowerCase()} is a ${activity.intensity.toLowerCase()} intensity activity, ${isHighIntensity ? 'we recommend reducing your duration or moving indoors.' : 'it is generally okay for healthy individuals, but limit your time.'}`,
        color: 'bg-orange-500',
        lightBg: 'bg-orange-50',
        textColor: 'text-orange-700'
      };
    } else {
      return {
        safe: false,
        title: "Unsafe for Outdoor Activities",
        desc: `The AQI is currently ${aqiValue} (Unhealthy/Hazardous). Everyone may begin to experience health effects. We strongly advise against ${activity.name.toLowerCase()} outside right now. Please move your activity indoors.`,
        color: 'bg-red-500',
        lightBg: 'bg-red-50',
        textColor: 'text-red-700'
      };
    }
  };

  const currentRec = getSafetyRecommendation(selectedActivity, aqi);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" /> Smart Activity Planner
            </h1>
            <p className="text-gray-500 mt-1">Get personalized health advice for your outdoor activities in {data.current.location_name}.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          
          {/* Activity Selector */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Select Activity</h2>
            {activitiesList.map(act => (
              <button
                key={act.id}
                onClick={() => setSelectedActivity(act.id)}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                  selectedActivity === act.id 
                    ? 'border-blue-600 bg-blue-50 shadow-sm' 
                    : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${selectedActivity === act.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}>
                    {act.icon}
                  </div>
                  <span className={`font-bold ${selectedActivity === act.id ? 'text-blue-900' : 'text-gray-700'}`}>
                    {act.name}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  act.intensity === 'High' ? 'bg-red-100 text-red-700' : 
                  act.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-green-100 text-green-700'
                }`}>
                  {act.intensity} Intensity
                </span>
              </button>
            ))}
          </div>

          {/* Recommendation Display */}
          <div className="md:col-span-2">
             <div className={`p-8 rounded-3xl shadow-sm border ${currentRec.safe ? 'border-green-200' : 'border-red-200'} ${currentRec.lightBg} h-full flex flex-col justify-center`}>
               <div className="flex items-start gap-6">
                 <div className={`p-4 rounded-full text-white shadow-md ${currentRec.color}`}>
                   {currentRec.safe ? <CheckCircle2 className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                 </div>
                 <div>
                   <div className="flex items-center gap-3 mb-2">
                     <span className={`font-black text-2xl ${currentRec.textColor}`}>{currentRec.title}</span>
                     <span className={`px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm ${currentRec.color}`}>
                       AQI: {aqi}
                     </span>
                   </div>
                   <p className={`text-lg leading-relaxed ${currentRec.textColor} opacity-90`}>
                     {currentRec.desc}
                   </p>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
