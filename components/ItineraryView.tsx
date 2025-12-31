import React from 'react';
import { TravelItinerary } from '../types';
import { Calendar, MapPin, Clock, DollarSign, Cloud, Utensils, Camera, Car, Heart } from 'lucide-react';

interface ItineraryViewProps {
  itinerary: TravelItinerary;
}

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'food': return <Utensils className="w-4 h-4 text-rose-400" />;
    case 'attraction': return <Camera className="w-4 h-4 text-rose-400" />;
    case 'transport': return <Car className="w-4 h-4 text-rose-400" />;
    default: return <Clock className="w-4 h-4 text-rose-400" />;
  }
};

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary }) => {
  if (!itinerary || !itinerary.days) return null;

  return (
    <div className="w-full glass-romantic rounded-3xl overflow-hidden animate-love-in border-2 border-rose-100/50">
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-8 text-white relative">
        <div className="absolute top-4 right-6 opacity-20"><Heart className="w-20 h-20 fill-white" /></div>
        <h2 className="text-3xl font-romantic mb-3 relative z-10">{itinerary.tripTitle}</h2>
        <div className="flex flex-wrap gap-4 text-sm relative z-10">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2"><MapPin size={14}/>{itinerary.destination}</span>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2"><Calendar size={14}/>{itinerary.duration}</span>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2"><DollarSign size={14}/>{itinerary.totalBudgetEstimate}</span>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {itinerary.days.map((day, idx) => (
          <div key={idx} className="relative pl-10 border-l-2 border-rose-100 last:border-0 pb-10 last:pb-0 animate-timeline-slide" style={{animationDelay: `${idx*100}ms`}}>
            <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-rose-500 border-4 border-white shadow-lg z-10" />
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-rose-800 flex items-center gap-3">
                第 {idx + 1} 天 <span className="text-sm font-normal text-rose-400 font-mono-tech italic">({day.date})</span>
              </h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed flex items-center gap-2">
                <Cloud size={16} className="text-sky-400" /> {day.weather} | {day.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {day.activities.map((act, i) => (
                <div key={i} className="bg-white/60 hover:bg-white p-4 rounded-2xl border border-rose-50 transition-all hover:shadow-xl hover:-translate-y-1 group">
                  <div className="flex gap-4">
                    <div className="p-3 bg-rose-50 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <ActivityIcon type={act.type} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-800 text-sm">{act.title}</span>
                        <span className="text-[10px] font-mono-tech bg-rose-50 px-2 py-1 rounded text-rose-400">{act.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{act.description}</p>
                    </div>
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