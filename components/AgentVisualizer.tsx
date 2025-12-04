import React, { useEffect, useState } from 'react';
import { AgentLog, AgentType } from '../types';
import { 
  CloudSun, 
  TrainFront, 
  MapPinned, 
  Ticket, 
  Utensils, 
  Bot, 
  CheckCircle2 
} from 'lucide-react';

interface AgentVisualizerProps {
  logs: AgentLog[];
  isLoading: boolean;
}

const getAgentIcon = (type: AgentType) => {
  switch (type) {
    case AgentType.WEATHER: return <CloudSun className="w-5 h-5 text-blue-500" />;
    case AgentType.TRANSPORT: return <TrainFront className="w-5 h-5 text-indigo-500" />;
    case AgentType.ROUTE: return <MapPinned className="w-5 h-5 text-green-500" />;
    case AgentType.ATTRACTION: return <Ticket className="w-5 h-5 text-purple-500" />;
    case AgentType.FOOD: return <Utensils className="w-5 h-5 text-orange-500" />;
    case AgentType.ORCHESTRATOR: return <Bot className="w-5 h-5 text-slate-700" />;
    default: return <Bot className="w-5 h-5" />;
  }
};

export const AgentVisualizer: React.FC<AgentVisualizerProps> = ({ logs, isLoading }) => {
  const [visibleLogs, setVisibleLogs] = useState<AgentLog[]>([]);

  // Simple animation effect to show logs appearing one by one if they are already loaded
  useEffect(() => {
    if (logs.length > 0) {
      setVisibleLogs([]);
      logs.forEach((log, index) => {
        setTimeout(() => {
          setVisibleLogs(prev => [...prev, log]);
        }, index * 200); // Stagger appearance
      });
    } else if (isLoading) {
      // Show simulated "thinking" logs if loading
      setVisibleLogs([
        { agent: AgentType.ORCHESTRATOR, status: 'working', message: '解析用户意图...', details: '提取关键参数: 目的地, 时间' }
      ]);
    }
  }, [logs, isLoading]);

  if (!isLoading && logs.length === 0) return null;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Bot className="w-4 h-4" /> 多智能体协同执行中 (MCP Protocol)
      </h3>
      <div className="space-y-3">
        {visibleLogs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-3 text-sm animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="mt-0.5 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
              {getAgentIcon(log.agent)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-800">{log.agent} Agent</span>
                {log.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {log.status === 'working' && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
              </div>
              <p className="text-slate-600">{log.message}</p>
              {log.details && (
                <p className="text-xs text-slate-400 mt-1 font-mono bg-slate-50 p-1 rounded">
                  {`> ${log.details}`}
                </p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center py-2">
             <span className="loading-dots text-slate-400 text-xs">正在协调子Agent...</span>
          </div>
        )}
      </div>
    </div>
  );
};