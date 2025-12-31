import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Loader2 } from 'lucide-react';

const API_KEY = "sk-3fab2ba09ca14c1f95bc87c05e2b9601";
const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: '嗨！我是小万，乐乐的专属小管家 ( ⸝⸝•ᴗ•⸝⸝ )੭⁾⁾ \n有什么我可以帮你的吗？' 
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // 构建上下文：System Prompt + 滑动窗口（最近10轮/20条消息）
      const historyWindow = newMessages.slice(-20); 
      
      const payloadMessages = [
        { 
          role: 'system', 
          content: '你是小万，乐乐的专属贴心小客服。你的性格活泼、可爱，说话语气像Hello Kitty一样软萌，喜欢用颜文字（如 (｡♥‿♥｡), (≧◡≦) 等）。你非常了解乐乐（用户），你的任务是陪伴她，解答她的问题，或者只是陪她聊天。永远保持温柔和耐心。请不要提及你是AI或模型，要沉浸在“小万”这个可爱的角色里。' 
        },
        ...historyWindow
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: payloadMessages
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const botContent = data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: botContent }]);
      } else {
        throw new Error("API Response format error");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: '呜呜，小万好像断网了... 稍后再试试好吗？(T_T)' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-auto font-romantic">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-[#fff0f5] rounded-3xl shadow-2xl border-4 border-white overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-rose-400 p-4 flex items-center justify-between text-white shadow-md relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '10px 10px' }}></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white rounded-full p-1 border-2 border-rose-200">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/220px-Hello_kitty_character_portrait.png" alt="Avatar" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg">客服小万</h3>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> 在线中
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-rose-500 p-1 rounded-full transition-colors relative z-10">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50 custom-scrollbar">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                   {!isUser && (
                     <div className="w-8 h-8 mr-2 rounded-full overflow-hidden border border-rose-200 flex-shrink-0 bg-white mt-1">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/220px-Hello_kitty_character_portrait.png" className="w-full h-full object-contain" />
                     </div>
                   )}
                   <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isUser 
                        ? 'bg-rose-400 text-white rounded-br-none' 
                        : 'bg-white text-slate-700 border border-rose-100 rounded-bl-none'
                    }`}
                   >
                     {msg.content}
                   </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="w-8 h-8 mr-2 rounded-full overflow-hidden border border-rose-200 flex-shrink-0 bg-white">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/220px-Hello_kitty_character_portrait.png" className="w-full h-full object-contain" />
                 </div>
                 <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-rose-100 shadow-sm flex items-center gap-2 text-rose-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> 小万正在思考...
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-rose-100 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="和我说说话吧..."
              className="flex-1 bg-rose-50 border-transparent focus:border-rose-300 focus:ring-0 rounded-full px-4 py-2 text-sm text-slate-700 placeholder-rose-300 outline-none transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-rose-400 text-white rounded-full hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md transform active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-16 h-16 bg-white border-4 border-rose-200 rounded-full shadow-[0_4px_20px_rgba(255,105,180,0.4)] flex items-center justify-center hover:scale-110 transition-transform duration-300"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/220px-Hello_kitty_character_portrait.png" 
          alt="Chat" 
          className="w-10 h-10 object-contain z-10"
        />
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
          </span>
        )}
        <div className="absolute -bottom-8 bg-white/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-rose-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            找小万聊天
        </div>
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #fca5a5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
};
