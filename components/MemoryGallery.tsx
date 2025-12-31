import React from 'react';
import { Heart } from 'lucide-react';

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
  "爱你", "", "", "", 
  "", "可爱捏", "", "",
  "", ""
];

const KittyBow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" className={className} fill="currentColor">
    <path d="M50 25c-5-8-20-15-35-5S5 55 25 55s20-10 25-20c5 10 5 20 25 20s25-25 10-35-30 3-35 5z" />
    <circle cx="50" cy="30" r="8" />
  </svg>
);

// 像素风 Kitty 头部 (模仿你照片里的贴纸)
const PixelKitty = ({ className }: { className?: string }) => (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Hello_Kitty_logo.svg/2560px-Hello_Kitty_logo.svg.png" 
    className={`drop-shadow-md filter contrast-125 ${className}`}
    alt="Pixel Kitty"
  />
);

export const MemoryGallery: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-8 pb-40"> {/* 增加底部 padding 防止被按钮遮挡 */}
      <div className="flex items-center gap-10 mb-24 justify-center">
        <div className="h-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent flex-1"></div>
        <div className="text-center px-6 relative">
          <KittyBow className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-16 text-[#E60012] opacity-80" />
          <h2 className="text-5xl font-romantic text-rose-500 flex items-center justify-center gap-6">
            乐乐
          </h2>
          <p className="text-rose-300 text-[10px] tracking-[0.8em] uppercase font-black mt-2">Fragments of Life</p>
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent flex-1"></div>
      </div>
      
      {/* 调整布局：columns-2 (手机) -> md:columns-3 (电脑) 
          对于5张照片，3列布局会形成 2-2-1 的错落感，比单行5张更好看 */}
      <div className="columns-2 md:columns-3 gap-8 space-y-12">
        {MEMORIES.map((url, idx) => {
          // 随机旋转角度，制造拍立得随意散落的感觉
          const rotation = (idx % 2 === 0 ? 1 : -1) * ((idx * 2 % 5) + 2);
          const hasBow = idx % 2 === 0; 
          const isFirst = idx === 0; // 第一张照片特殊处理
          
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
                {/* 第一张照片加特殊的像素Kitty装饰，还原你的照片风格 */}
                {isFirst && (
                  <div className="absolute -top-6 -left-6 z-20 animate-bounce delay-700">
                    <img 
                      src="https://pngimg.com/uploads/hello_kitty/hello_kitty_PNG32.png" 
                      className="w-16 h-16 object-contain drop-shadow-lg -rotate-12"
                      alt="Sticker"
                    />
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
                  {/* 第一张照片加一点粉色爱心滤镜感 */}
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