import React from 'react';
import { TravelItinerary, DayPlan, TravelActivity } from '../types';
import { Calendar, MapPin, Clock, DollarSign, Cloud, Utensils, Camera, Car } from 'lucide-react';

interface ItineraryViewProps {
  itinerary: TravelItinerary;
}

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'food': return <Utensils className="w-4 h-4 text-orange-500" />;
    case 'attraction': return <Camera className="w-4 h-4 text-purple-500" />;
    case 'transport': return <Car className="w-4 h-4 text-blue-500" />;
    default: return <Clock className="w-4 h-4 text-slate-400" />;
  }
};

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary }) => {
  if (!itinerary || !itinerary.days || itinerary.days.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{itinerary.tripTitle}</h2>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {itinerary.destination}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {itinerary.duration}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> 预估预算: {itinerary.totalBudgetEstimate}
          </div>
        </div>
      </div>

      {/* Days */}
      <div className="p-6 space-y-8">
        {itinerary.days.map((day, idx) => (
          <div key={idx} className="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-8 last:pb-0">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
            
            {/* Day Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Day {idx + 1} <span className="text-sm font-normal text-slate-500">({day.date})</span>
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                <Cloud className="w-4 h-4 text-blue-400" />
                <span>{day.weather}</span>
                <span className="mx-1">•</span>
                <span>{day.summary}</span>
              </div>
            </div>

            {/* Activities Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {day.activities.map((activity, actIdx) => (
                <div key={actIdx} className="bg-slate-50 hover:bg-slate-100 transition-colors p-3 rounded-lg border border-slate-200 flex gap-3">
                  <div className="mt-1">
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-800 text-sm">{activity.title}</h4>
                      <span className="text-xs font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">{activity.description}</p>
                    {(activity.location || activity.cost) && (
                      <div className="flex gap-3 mt-2 text-xs text-slate-400">
                        {activity.location && <span>📍 {activity.location}</span>}
                        {activity.cost && <span>💰 {activity.cost}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};