import React from 'react';
import { AgentType } from '../types';
import { 
  CloudSun, 
  MapPin, 
  Sparkles, 
  Heart, 
  UtensilsCrossed, 
  Plane,
  Gift
} from 'lucide-react';

interface AgentSidebarProps {
  activeAgents: AgentType[];
  isProcessing: boolean;
}

const AGENT_CONFIG = [
  { type: AgentType.ORCHESTRATOR, label: '浪漫管家', subLabel: '用心筹备', icon: Sparkles, color: 'text-rose-500', bg: 'bg-rose-50', glow: 'shadow-rose-200' },
  { type: AgentType.WEATHER, label: '晴雨守护', subLabel: '温暖每一天', icon: CloudSun, color: 'text-orange-400', bg: 'bg-orange-50', glow: 'shadow-orange-200' },
  { type: AgentType.TRANSPORT, label: '奔赴于你', subLabel: '山海皆可平', icon: Plane, color: 'text-sky-400', bg: 'bg-sky-50', glow: 'shadow-sky-200' },
  { type: AgentType.ROUTE, label: '漫步余生', subLabel: '轨迹皆是你', icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-50', glow: 'shadow-emerald-200' },
  { type: AgentType.ATTRACTION, label: '此间风景', subLabel: '因你而绚烂', icon: Gift, color: 'text-purple-400', bg: 'bg-purple-50', glow: 'shadow-purple-200' },
  { type: AgentType.FOOD, label: '烟火人间', subLabel: '尝遍世间味', icon: UtensilsCrossed, color: 'text-pink-400', bg: 'bg-pink-50', glow: 'shadow-pink-200' },
];

export const AgentSidebar: React.FC<AgentSidebarProps> = ({ activeAgents, isProcessing }) => {
  return (
    <div className="w-64 bg-white/80 h-full flex flex-col border-r border-rose-100 flex-none hidden md:flex z-20 backdrop-blur-lg">
      <div className="p-8 border-b border-rose-100 text-center">
        <div className="inline-flex p-3 bg-rose-500 rounded-full shadow-lg shadow-rose-200 mb-4 animate-soft-glow">
          <Heart className="w-6 h-6 text-white fill-white" />
        </div>
        <h1 className="font-romantic text-2xl text-rose-600 tracking-wide">情书与足迹</h1>
        <p className="text-[10px] text-rose-300 uppercase tracking-widest mt-1">专属你的春节旅行</p>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {AGENT_CONFIG.map((agent) => {
          const isActive = activeAgents.includes(agent.type);
          return (
            <div 
              key={agent.type}
              className={`
                group flex items-center gap-4 p-4 rounded-2xl transition-all duration-500
                ${isActive ? `bg-white shadow-xl ${agent.glow} translate-x-2` : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}
              `}
            >
              <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? agent.bg : 'bg-slate-100'}`}>
                <agent.icon className={`w-5 h-5 ${isActive ? agent.color : 'text-slate-400'}`} />
              </div>
              <div>
                <div className={`text-sm font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{agent.label}</div>
                <div className="text-[10px] text-slate-400">{agent.subLabel}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 border-t border-rose-50 bg-rose-50/30">
        <div className="text-[10px] text-rose-400 text-center font-medium">
          {isProcessing ? "正在为你编织浪漫行程..." : "陪伴是最长情的告白 ❤️"}
        </div>
      </div>
    </div>
  );
};