import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Menu, Sparkles, Settings2, ChevronDown, Lock, KeyRound } from 'lucide-react';
import { Message, AgentType, ResponseType, ModelConfig } from './types';
import { planTrip, AVAILABLE_MODELS } from './services/orchestratorService';
import { ItineraryView } from './components/ItineraryView';
import { AgentSidebar } from './components/AgentSidebar';

// 简单的登录组件
const LoginScreen = ({ onLogin }: { onLogin: (status: boolean) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'wjn' && password === '123456') {
      onLogin(true);
    } else {
      setError('账号或密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">TravelOrchestra AI</h1>
          <p className="text-slate-500 text-sm mt-2">多智能体旅行规划系统</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">账号</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="请输入账号"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">密码</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="请输入密码"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-95"
          >
            登 录
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 如果未登录，直接显示登录页
  if (!isAuthenticated) {
    return <LoginScreen onLogin={setIsAuthenticated} />;
  }

  return <MainApp />;
}

// 主应用逻辑拆分为子组件
function MainApp() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelConfig>(AVAILABLE_MODELS[0]);
  const [showModelMenu, setShowModelMenu] = useState(false);
  
  // Track which agents are "active" (lit up)
  const [activeAgents, setActiveAgents] = useState<AgentType[]>([AgentType.ORCHESTRATOR]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是 TravelOrchestra 智能旅行规划师。\n\n我可以帮你：\n1. 🌤️ 查询各地天气 (支持"明天"、"后天"等时间推断)\n2. 🚄 查询交通车票\n3. 📅 规划完整行程\n\n请告诉我你的需求。'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // 1. Create User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    // Update UI immediately
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);
    
    // Reset active agents to just Orchestrator while thinking
    setActiveAgents([AgentType.ORCHESTRATOR]);

    try {
      // 2. Call Service with HISTORY and SELECTED MODEL
      const { logs, itinerary, replyText, responseType } = await planTrip(userMsg.content, messages, currentModel);

      // 3. Determine Active Agents based on logs
      const usedAgents = Array.from(new Set(logs.map(log => log.agent)));
      
      if (!usedAgents.includes(AgentType.ORCHESTRATOR)) {
        usedAgents.unshift(AgentType.ORCHESTRATOR);
      }
      if (responseType === 'CHAT' && usedAgents.length === 0) {
        usedAgents.push(AgentType.ORCHESTRATOR);
      }

      setActiveAgents(usedAgents);

      // 4. Create Assistant Message
      const finalContent = (replyText && replyText.trim() !== "") 
        ? replyText 
        : "（收到，任务已执行。详情请见下方信息或重试。）";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: finalContent,
        agentLogs: logs,
        relatedItinerary: responseType === 'PLAN' ? itinerary : undefined
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，${currentModel.name} 连接似乎出了点问题，请切换模型或稍后再试。`
      }]);
      setActiveAgents([AgentType.ORCHESTRATOR]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Left Sidebar - Agent Status Board */}
      <AgentSidebar activeAgents={activeAgents} isProcessing={loading} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <header className="flex-none bg-white border-b border-slate-200 px-4 py-3 flex md:hidden items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5 text-slate-600" />
            <h1 className="font-bold text-slate-800">TravelOrchestra</h1>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="flex-none w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 mt-1">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
              )}
              
              <div className={`flex flex-col max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Text Bubble */}
                <div className={`
                  px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}
                `}>
                  {msg.content}
                </div>

                {/* Agent Logs */}
                {msg.agentLogs && msg.agentLogs.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                     {Array.from(new Set(msg.agentLogs.map(l => l.agent))).filter(a => a !== AgentType.ORCHESTRATOR).map(agent => (
                        <span key={agent} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200 font-medium animate-in fade-in slide-in-from-left-1">
                           {agent} Agent 已响应
                        </span>
                     ))}
                  </div>
                )}

                {/* Itinerary Card */}
                {msg.relatedItinerary && (
                   <div className="w-full mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ItineraryView itinerary={msg.relatedItinerary} />
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="flex-none w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 mt-1">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4">
               <div className="flex-none w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 animate-pulse">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="bg-white border border-slate-200 px-5 py-3.5 rounded-2xl rounded-tl-none text-sm text-slate-500 flex items-center gap-2 shadow-sm">
                  <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span className="animate-pulse">{currentModel.name} (Orchestrator) 正在思考...</span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input Area */}
        <div className="flex-none p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-slate-200">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex gap-2">
            
            {/* Model Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="h-full px-3 py-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm font-medium min-w-[140px]"
              >
                <Settings2 className="w-4 h-4" />
                <span className="truncate max-w-[100px]">{currentModel.name}</span>
                <ChevronDown className="w-3 h-3 ml-auto opacity-50" />
              </button>
              
              {showModelMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowModelMenu(false)} />
                  <div className="absolute bottom-full mb-2 left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20 animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Select AI Model
                    </div>
                    {AVAILABLE_MODELS.map(model => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          setCurrentModel(model);
                          setShowModelMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${currentModel.id === model.id ? 'text-indigo-600 font-medium bg-indigo-50' : 'text-slate-700'}`}
                      >
                        {model.name}
                        {currentModel.id === model.id && <Sparkles className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`输入你的旅行计划... (Using ${currentModel.name})`}
                className="w-full pl-6 pr-14 py-4 rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner text-slate-700 placeholder:text-slate-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="text-center mt-3 text-xs text-slate-400 font-medium">
             由 {currentModel.name} 驱动的 Multi-Agent 架构 | 支持上下文记忆
          </div>
        </div>
      </div>
    </div>
  );
}