import React from 'react';
import { TechCard, NumberCounter, LottieIcon, GlowButton } from './TechUI';
import { Send, Sparkles, Map, Train } from 'lucide-react';

interface DashboardProps {
  onQuickStart: (text: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onQuickStart }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider animate-in slide-in-from-top-4 fade-in duration-700">
          <Sparkles className="w-3 h-3" /> System Ready
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 tracking-tight animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
          TravelOrchestra <span className="font-light italic">AI</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
          基于多智能体协作的下一代旅行规划系统。您只需描述需求，我们为您协调一切。
        </p>
      </div>

      {/* Data Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <TechCard delay={100}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
               {/* Weather Lottie */}
               <LottieIcon src="https://lottie.host/embed/9e3a35a6-9815-4654-8025-5460f8526569/db3g4v45Cg.json" size="50px" />
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">LIVE</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">
            <NumberCounter end={24} suffix="°C" />
          </div>
          <p className="text-sm text-slate-500">实时气象监控</p>
        </TechCard>

        <TechCard delay={200}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
               {/* Transport Lottie */}
               <LottieIcon src="https://lottie.host/embed/84102947-f542-4217-b088-75c6130e5444/P4W0Ww2K5E.json" size="50px" />
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">API</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">
            <NumberCounter end={1250} />+
          </div>
          <p className="text-sm text-slate-500">车次航班数据</p>
        </TechCard>

        <TechCard delay={300}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
               {/* Location Lottie */}
               <LottieIcon src="https://lottie.host/embed/14e2467d-616c-486a-8b83-b78996b99b50/rG1L5f5Q8M.json" size="50px" />
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">POI</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">
            <NumberCounter end={8500} />+
          </div>
          <p className="text-sm text-slate-500">热门景点收录</p>
        </TechCard>
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto pt-8">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 pl-2">快速开始 (Quick Start)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <button 
             onClick={() => onQuickStart("帮我规划一个北京到上海的五天四晚行程，预算8000元，想去迪士尼")}
             className="group relative p-4 bg-white/50 hover:bg-white border border-slate-200 rounded-xl text-left transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
           >
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:rotate-12 transition-transform">
                 <Train className="w-5 h-5" />
               </div>
               <div>
                 <div className="font-semibold text-slate-800">北京 -> 上海 经典游</div>
                 <div className="text-xs text-slate-500 mt-0.5">包含迪士尼、外滩、高铁</div>
               </div>
             </div>
           </button>

           <button 
             onClick={() => onQuickStart("这周末去杭州玩两天，推荐好吃的和西湖附近的景点")}
             className="group relative p-4 bg-white/50 hover:bg-white border border-slate-200 rounded-xl text-left transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
           >
             <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:rotate-12 transition-transform">
                 <Map className="w-5 h-5" />
               </div>
               <div>
                 <div className="font-semibold text-slate-800">杭州周末短途</div>
                 <div className="text-xs text-slate-500 mt-0.5">西湖、灵隐寺、龙井茶</div>
               </div>
             </div>
           </button>
        </div>
      </div>
    </div>
  );
};