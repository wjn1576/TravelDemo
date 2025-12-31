import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PetalBackground } from './components/PetalBackground';
import { MemoryGallery } from './components/MemoryGallery';
import { RomanticHero } from './components/RomanticHero';
import { ChatWidget } from './components/ChatWidget';

const KittyBow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" className={className} fill="currentColor">
    <path d="M50 25c-5-8-20-15-35-5S5 55 25 55s20-10 25-20c5 10 5 20 25 20s25-25 10-35-30 3-35 5z" />
    <circle cx="50" cy="30" r="8" />
  </svg>
);

// 可靠的组合贴纸组件
// 使用官方 Wiki 图像作为底图，确保 100% 可访问
const CompositeKitty = ({ type, className }: { type: 'bear' | 'love' | 'normal', className?: string }) => {
  const baseImg = "https://upload.wikimedia.org/wikipedia/en/0/05/Hello_kitty_character_portrait.png";
  
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <div className="relative hover:scale-110 transition-transform duration-300">
        {/* 白边效果模拟贴纸感 */}
        <img 
          src={baseImg} 
          alt="Kitty"
          className="w-full h-full object-contain drop-shadow-[0_5px_15px_rgba(255,105,180,0.3)] relative z-10" 
        />
        
        {/* 组合装饰元素 */}
        {type === 'bear' && (
          <span className="absolute -top-1/4 left-1/4 text-[3em] z-20 animate-bounce" style={{ animationDuration: '3s' }}>
            🐻
          </span>
        )}
        {type === 'love' && (
          <span className="absolute top-0 -right-4 text-[2.5em] z-20 animate-pulse text-rose-500">
            💕
          </span>
        )}
      </div>
    </div>
  );
};

// 新增：悬浮装饰组件
const FloatingDecorations = () => (
  <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
    {/* 左侧：头顶小熊的 Kitty */}
    <CompositeKitty 
      type="bear"
      className="absolute top-32 -left-4 w-32 md:w-40 opacity-90 rotate-12 animate-float-slow" 
    />
    
    {/* 右侧：拿着爱心的 Kitty */}
    <CompositeKitty 
      type="love"
      className="absolute bottom-20 -right-4 w-28 md:w-36 opacity-90 -rotate-12 animate-float-delayed" 
    />

    {/* 随机散落的小蝴蝶结 */}
    <KittyBow className="absolute top-1/4 right-10 w-8 h-8 text-rose-200 rotate-45 opacity-60" />
    <KittyBow className="absolute top-2/3 left-12 w-6 h-6 text-rose-300 -rotate-12 opacity-50" />
  </div>
);

export default function App() {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff5f8] text-rose-400 overflow-x-hidden relative selection:bg-rose-200 selection:text-rose-600">
      
      {/* 全局客服组件：只有在进入主画廊后才显示，避免遮挡开场动画 */}
      {showGallery && <ChatWidget />}

      {!showGallery ? (
        <div className="fixed inset-0 z-50">
          <RomanticHero onComplete={() => setShowGallery(true)} />
        </div>
      ) : (
        <div className="relative animate-in fade-in duration-1000 pb-20">
          <PetalBackground /> 
          
          {/* 装饰层 z-index 设为 1，确保在背景之上 */}
          <FloatingDecorations />
          
          <header className="relative z-20 pt-16 pb-8 text-center">
            {/* Header Icon: Hello Kitty Portrait */}
            <div className="relative inline-block mb-6 group cursor-pointer hover:rotate-3 transition-transform duration-500">
              <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-pink-200 shadow-[0_0_40px_rgba(255,192,203,0.6)] border-[6px] border-rose-100 flex items-center justify-center animate-heart-beat overflow-hidden relative">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/220px-Hello_kitty_character_portrait.png" 
                  alt="Hello Kitty" 
                  className="w-24 h-24 object-contain mt-3"
                />
              </div>
              <KittyBow className="absolute -top-4 -right-4 w-14 h-14 text-[#E60012] drop-shadow-lg rotate-12 animate-pulse" />
              <div className="absolute -left-12 top-4 text-4xl animate-bounce delay-700 drop-shadow-md">👼</div>
              <div className="absolute -right-12 top-4 text-4xl animate-bounce delay-1000 drop-shadow-md">✨</div>
            </div>
            
            {/* 修复：使用官方可靠 Logo 源 */}
            <div className="flex justify-center mb-2">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Hello_Kitty_logo.svg/512px-Hello_Kitty_logo.svg.png" 
                 alt="Logo" 
                 className="h-12 object-contain opacity-90 drop-shadow-sm"
               />
            </div>

            <h1 className="text-6xl font-romantic text-rose-500 mb-3 tracking-tighter drop-shadow-sm">碎片日记</h1>
            <p className="text-rose-300 tracking-[0.6em] text-xs font-bold uppercase">2026 . Lele's Journal</p>
          </header>

          <main className="relative z-20">
            <MemoryGallery />
            
            <div className="max-w-2xl mx-auto mt-32 p-12 bg-white/60 backdrop-blur-xl rounded-[4rem] text-center border-4 border-rose-50 shadow-2xl shadow-rose-100/50 relative group transition-all hover:shadow-rose-200/60 hover:-translate-y-2 duration-500">
              {/* 装饰：组合 Kitty 抱着小熊 */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-110 z-20">
                 <CompositeKitty type="bear" className="w-40 h-40" />
              </div>

               <KittyBow className="absolute top-10 left-10 w-8 h-8 text-rose-200 rotate-[-15deg] opacity-60" />
               <KittyBow className="absolute bottom-10 right-10 w-8 h-8 text-rose-200 rotate-[15deg] opacity-60" />
              
              <div className="mt-12">
                <p className="font-romantic text-3xl text-rose-500 leading-loose">
                  “生活里的碎片，<br/>
                  拼凑成了我们珍贵的每一天。”
                </p>
              </div>
              
              <div className="mt-10 flex justify-center items-center gap-6">
                <div className="h-1 w-16 bg-rose-200 rounded-full"></div>
                <Sparkles className="text-rose-400 w-6 h-6 animate-spin-slow" />
                <div className="h-1 w-16 bg-rose-200 rounded-full"></div>
              </div>
            </div>
          </main>

          <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30">
            <button 
              onClick={() => setShowGallery(false)}
              className="px-10 py-4 bg-white/90 backdrop-blur-md rounded-full text-sm font-bold tracking-widest text-rose-500 shadow-[0_10px_40px_rgba(255,105,180,0.3)] border-2 border-rose-100 hover:bg-rose-50 hover:scale-105 transition-all flex items-center gap-4 group"
            >
              <KittyBow className="w-5 h-5 group-hover:rotate-12 transition-transform text-[#E60012]" /> 回看日记
            </button>
          </footer>
        </div>
      )}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(-15px) rotate(-10deg); }
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
}