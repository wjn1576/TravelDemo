import React from 'react';

// ============================================================================
// 📷 你的专属回忆相册
// ============================================================================

const MEMORIES = [
  "https://i.postimg.cc/pLhx6HbF/0da298d610f26c5d7e766b37f096c226.jpg",
  "https://i.postimg.cc/d3xp2h1t/1ac0a0b26ff04d846b93f1b9e0003503.jpg",
  "https://i.postimg.cc/Qd5w7xZ1/8063a57470dbea24883f90b069b1990f.jpg",
  "https://i.postimg.cc/VLJ3YW7h/72be057593ded3149f5bc9b584c8fc5b.jpg",
  "https://i.postimg.cc/MKZ1Rsk9/f343111e9046467863e45bb0c62e93fe.jpg"
];

const TITLES = [
  "爱你", "", "幸福", "可爱捏", 
  "", "", "", "",
  "", "未完待续"
];

const KittyBow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" className={className} fill="currentColor">
    <path d="M50 25c-5-8-20-15-35-5S5 55 25 55s20-10 25-20c5 10 5 20 25 20s25-25 10-35-30 3-35 5z" />
    <circle cx="50" cy="30" r="8" />
  </svg>
);

// 复合贴纸组件（同 App.tsx）
const CompositeSticker = ({ type, className }: { type: 'bear' | 'ok', className?: string }) => {
    const baseImg = "https://upload.wikimedia.org/wikipedia/en/0/05/Hello_kitty_character_portrait.png";
    return (
      <div className={`relative inline-block ${className}`}>
        <img 
            src={baseImg} 
            alt="Sticker" 
            className="w-full h-full object-contain drop-shadow-md"
        />
        {type === 'bear' && <span className="absolute -top-1/3 left-0 text-[3rem] animate-bounce">🐻</span>}
        {type === 'ok' && <span className="absolute -top-1/4 -right-1/4 text-[2.5rem] font-bold text-rose-500 rotate-12 font-romantic">OK!</span>}
      </div>
    );
};

export const MemoryGallery: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-8 pb-40 relative"> 
      {/* 增加背景大贴纸装饰 - 使用可靠的 Logo */}
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Hello_Kitty_logo.svg/512px-Hello_Kitty_logo.svg.png" 
        className="absolute top-20 -left-10 w-48 opacity-5 rotate-12 pointer-events-none hidden md:block" 
        alt="Decor Logo"
      />
       <img 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Hello_Kitty_bow.svg/1200px-Hello_Kitty_bow.svg.png" 
        className="absolute bottom-40 -right-10 w-40 opacity-5 -rotate-12 pointer-events-none hidden md:block" 
        alt="Decor Bow"
      />

      <div className="flex items-center gap-10 mb-24 justify-center">
        <div className="h-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent flex-1"></div>
        <div className="text-center px-6 relative group">
          <KittyBow className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-16 text-[#E60012] opacity-80 group-hover:scale-110 transition-transform" />
          
          <h2 className="text-5xl font-romantic text-rose-500 flex items-center justify-center gap-6 relative z-10">
            乐乐
          </h2>
          <p className="text-rose-300 text-[10px] tracking-[0.8em] uppercase font-black mt-2">Fragments of Life</p>
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent flex-1"></div>
      </div>
      
      <div className="columns-2 md:columns-3 gap-8 space-y-12">
        {MEMORIES.map((url, idx) => {
          const rotation = (idx % 2 === 0 ? 1 : -1) * ((idx * 2 % 5) + 2);
          const hasBow = idx % 2 === 0; 
          const isFirst = idx === 0; 
          
          return (
            <div 
              key={idx} 
              className="break-inside-avoid animate-in zoom-in fade-in duration-1000"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div 
                className="polaroid-kitty group relative cursor-pointer"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* 第一张照片: 模仿 "Kitty Bear OK" 贴纸风格 */}
                {isFirst && (
                  <div className="absolute -top-12 -left-8 z-20 animate-bounce delay-700">
                    <CompositeSticker type="bear" className="w-24 h-24 -rotate-12" />
                  </div>
                )}

                {/* 偶数张显示蝴蝶结 */}
                {!isFirst && hasBow && <KittyBow className="absolute -top-3 -right-3 w-10 h-10 text-[#E60012] z-10 drop-shadow-sm rotate-12 transition-transform group-hover:rotate-45" />}
                
                <div className="aspect-[3/4] overflow-hidden bg-rose-50 rounded-lg shadow-inner relative">
                  <img 
                    src={url} 
                    alt={`Memory ${idx}`} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                  {isFirst && <div className="absolute inset-0 bg-rose-200/10 pointer-events-none mix-blend-overlay"></div>}
                </div>
                <div className="pt-8 pb-4 text-center">
                  <p className="font-romantic text-rose-500 text-2xl tracking-wide">{TITLES[idx] || "回忆"}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .polaroid-kitty {
          background: #ffffff;
          padding: 16px 16px 32px 16px;
          border-radius: 4px;
          box-shadow: 0 10px 40px rgba(255, 182, 193, 0.3);
          border: 1px solid rgba(255, 182, 193, 0.2);
          transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .polaroid-kitty:hover {
          transform: scale(1.05) rotate(0deg) !important;
          box-shadow: 0 20px 60px rgba(255, 182, 193, 0.5);
          z-index: 50;
        }
      `}</style>
    </div>
  );
};