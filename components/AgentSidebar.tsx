import React from 'react';
import { AgentType } from '../types';
import { 
  CloudSun, 
  TrainFront, 
  MapPinned, 
  Ticket, 
  Utensils, 
  Bot, 
  Cpu
} from 'lucide-react';

interface AgentSidebarProps {
  activeAgents: AgentType[];
  isProcessing: boolean;
}

const AGENT_CONFIG = [
  { type: AgentType.ORCHESTRATOR, label: 'Orchestrator', subLabel: '总控调度', icon: Bot, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { type: AgentType.WEATHER, label: 'Weather', subLabel: '气象服务', icon: CloudSun, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { type: AgentType.TRANSPORT, label: 'Transport', subLabel: '票务交通', icon: TrainFront, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { type: AgentType.ROUTE, label: 'Route', subLabel: '路线规划', icon: MapPinned, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { type: AgentType.ATTRACTION, label: 'Attraction', subLabel: '景点向导', icon: Ticket, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { type: AgentType.FOOD, label: 'Food', subLabel: '本地美食', icon: Utensils, color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

export const AgentSidebar: React.FC<AgentSidebarProps> = ({ activeAgents, isProcessing }) => {
  return (
    <div className="w-64 bg-slate-900 h-full flex flex-col border-r border-slate-800 text-slate-300 flex-none hidden md:flex">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight">TravelOrchestra</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Multi-Agent System</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Active Agents</div>
        
        {AGENT_CONFIG.map((agent) => {
          const isActive = activeAgents.includes(agent.type);
          const isOrchestrator = agent.type === AgentType.ORCHESTRATOR;
          
          // Special animation state for Orchestrator when processing
          const isPulsing = isOrchestrator && isProcessing;

          return (
            <div 
              key={agent.type}
              className={`
                relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ease-out
                ${isActive || isPulsing
                  ? 'bg-slate-800 border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.3)] translate-x-1' 
                  : 'bg-transparent border-transparent opacity-40 grayscale hover:opacity-60'}
              `}
            >
              {/* Glowing Indicator Line */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-500
                ${isActive || isPulsing ? `bg-current ${agent.color} shadow-[0_0_10px_currentColor]` : 'bg-transparent w-0'}
              `} />

              <div className={`p-2 rounded-lg transition-colors duration-300 ${isActive ? agent.bg : 'bg-slate-800'}`}>
                <agent.icon className={`w-5 h-5 transition-colors duration-300 ${isActive || isPulsing ? agent.color : 'text-slate-500'}`} />
              </div>
              
              <div className="flex-1">
                <div className={`font-medium text-sm transition-colors duration-300 ${isActive || isPulsing ? 'text-white' : 'text-slate-500'}`}>
                  {agent.label}
                </div>
                <div className="text-xs text-slate-500">
                  {agent.subLabel}
                </div>
              </div>

              {/* Status Dot */}
              <div className={`w-2 h-2 rounded-full transition-all duration-500 
                ${isPulsing ? 'bg-indigo-400 animate-ping' : ''}
                ${isActive && !isPulsing ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : ''}
                ${!isActive && !isPulsing ? 'bg-slate-700' : ''}
              `} />
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-500 leading-relaxed">
          <span className="text-indigo-400 font-medium">系统状态:</span> 
          {isProcessing ? ' 正在协调多个智能体并行计算...' : ' 待机中，等待用户指令。'}
        </div>
      </div>
    </div>
  );
};
