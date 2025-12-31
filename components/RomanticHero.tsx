import React, { useEffect, useRef, useState } from 'react';
import { LetterModal } from './LetterModal';

// 短句祝福
const WISHES = [
  "愿你天天开心", "平安喜乐", "万事胜意", 
  "岁岁常欢愉", "年年皆胜意", "多喜乐", 
  "长安宁", "所求皆如愿", "前路浩浩荡荡", 
  "万物尽可期待", "好运连连", "心想事成",
  "身体健康", "永远可爱", "自由自在"
];

const COLORS = ['#fff0f5', '#ffe4e1', '#ffb7c5', '#ffffff'];

const KittyBow = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 60" className={className} style={style} fill="currentColor">
    <path d="M50 25c-5-8-20-15-35-5S5 55 25 55s20-10 25-20c5 10 5 20 25 20s25-25 10-35-30 3-35 5z" />
    <circle cx="50" cy="30" r="8" />
  </svg>
);

// Easing Function: Cubic Out
const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};

export const RomanticHero: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState<'flying' | 'envelope' | 'reading'>('flying');
  const [showLetter, setShowLetter] = useState(false);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    const CARD_COUNT = 80; 
    const DUST_COUNT = 100; // 魔法尘埃
    const STREAM_COUNT = 40; // 流光
    const HEART_SCALE = Math.min(w, h) / 45;
    const ANIMATION_DURATION = 2500; 

    // --- 1. 魔法尘埃 (Magic Dust - Twinkling) ---
    class MagicDust {
      x: number;
      y: number;
      size: number;
      opacity: number;
      fadeSpeed: number;
      direction: number;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2;
        this.opacity = Math.random();
        this.fadeSpeed = 0.005 + Math.random() * 0.01;
        this.direction = 1; // 1 for fade in, -1 for fade out
      }

      update() {
        this.opacity += this.fadeSpeed * this.direction;
        if (this.opacity > 0.8 || this.opacity < 0.1) {
          this.direction *= -1;
        }
        // 缓慢漂浮
        this.y -= 0.2;
        if (this.y < 0) this.y = h;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- 2. 流光粒子 (Stream Particle - Flowing) ---
    class StreamParticle {
      x: number;
      y: number;
      speed: number;
      size: number;
      angle: number;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.speed = 0.5 + Math.random();
        this.size = Math.random() * 1.5;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += Math.cos(this.angle) * 0.2;
        this.y -= this.speed;
        this.angle += 0.01; // 螺旋上升

        if (this.y < -10) {
          this.y = h + 10;
          this.x = Math.random() * w;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 182, 193, ${0.3 + Math.random() * 0.2})`; // 淡粉色
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- 3. 主体卡片粒子 ---
    class CardParticle {
      x: number; y: number;
      startX: number; startY: number;
      targetX: number; targetY: number;
      vx: number; vy: number;
      angle: number;
      text: string;
      w: number; h: number;
      color: string;
      delay: number;
      isArrived: boolean;

      constructor(index: number, tx: number, ty: number) {
        this.targetX = tx;
        this.targetY = ty;
        this.vx = 0; this.vy = 0;
        
        const side = Math.floor(Math.random() * 4);
        const dist = 400;
        if (side === 0) { this.startX = Math.random() * w; this.startY = -dist; }
        else if (side === 1) { this.startX = w + dist; this.startY = Math.random() * h; }
        else if (side === 2) { this.startX = Math.random() * w; this.startY = h + dist; }
        else { this.startX = -dist; this.startY = Math.random() * h; }
        
        this.x = this.startX;
        this.y = this.startY;
        this.text = WISHES[index % WISHES.length];
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.w = 90; this.h = 28;
        this.angle = (Math.random() - 0.5) * 0.5;
        this.delay = Math.random() * 1000;
        this.isArrived = false;
      }

      update(now: number, appStartTime: number) {
        if (now < appStartTime + this.delay) return;
        
        const lifeTime = now - (appStartTime + this.delay);
        
        if (lifeTime < ANIMATION_DURATION) {
            const progress = lifeTime / ANIMATION_DURATION;
            const ease = easeOutCubic(progress);
            this.x = this.startX + (this.targetX - this.startX) * ease;
            this.y = this.startY + (this.targetY - this.startY) * ease;
            this.angle = Math.sin(lifeTime * 0.002) * 0.1;
        } else {
            this.isArrived = true;
            const k = 0.08; 
            const damp = 0.92;
            const ax = (this.targetX - this.x) * k;
            const ay = (this.targetY - this.y) * k;
            this.vx += ax; this.vy += ay;
            
            const mx = this.x - mouseRef.current.x;
            const my = this.y - mouseRef.current.y;
            const distSq = mx * mx + my * my;
            const minDist = 150;
            
            if (distSq < minDist * minDist) {
                const dist = Math.sqrt(distSq);
                const force = (minDist - dist) / minDist;
                const angle = Math.atan2(my, mx);
                const push = 3.0 * force;
                this.vx += Math.cos(angle) * push;
                this.vy += Math.sin(angle) * push;
                this.angle += (Math.random() - 0.5) * 0.1 * force;
            } else {
                this.angle *= 0.95;
            }
            this.vx *= damp; this.vy *= damp;
            this.x += this.vx; this.y += this.vy;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.shadowColor = "rgba(255, 182, 193, 0.8)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = this.color;
        
        const r = 4; const hw = this.w / 2; const hh = this.h / 2;
        ctx.beginPath();
        ctx.moveTo(-hw + r, -hh); ctx.lineTo(hw - r, -hh);
        ctx.quadraticCurveTo(hw, -hh, hw, -hh + r); ctx.lineTo(hw, hh - r);
        ctx.quadraticCurveTo(hw, hh, hw - r, hh); ctx.lineTo(-hw + r, hh);
        ctx.quadraticCurveTo(-hw, hh, -hw, hh - r); ctx.lineTo(-hw, -hh + r);
        ctx.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.fillStyle = "#db2777"; 
        ctx.font = `bold 13px "Ma Shan Zheng", cursive`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, 0, 1);
        ctx.restore();
      }
    }

    // --- 初始化 ---
    const magicDusts: MagicDust[] = [];
    for(let i=0; i<DUST_COUNT; i++) magicDusts.push(new MagicDust());

    const streamParticles: StreamParticle[] = [];
    for(let i=0; i<STREAM_COUNT; i++) streamParticles.push(new StreamParticle());

    const cardParticles: CardParticle[] = [];
    for (let i = 0; i < CARD_COUNT; i++) {
      const t = (i / CARD_COUNT) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const tx = w / 2 + x * HEART_SCALE;
      const ty = h / 2 + y * HEART_SCALE;
      cardParticles.push(new CardParticle(i, tx, ty));
    }

    // --- 动画循环 ---
    let animationId: number;
    const appStartTime = Date.now();
    let isFinished = false;

    const animate = () => {
      const now = Date.now();
      
      // 背景绘制
      ctx.fillStyle = '#fff0f5'; 
      ctx.fillRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
      grad.addColorStop(0, '#fff0f5');
      grad.addColorStop(1, '#ffe4e1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 1. 绘制梦幻背景
      streamParticles.forEach(p => { p.update(); p.draw(); });
      magicDusts.forEach(p => { p.update(); p.draw(); });

      // 2. 绘制前景卡片
      cardParticles.forEach(p => { p.update(now, appStartTime); p.draw(); });

      if (!isFinished && (now - appStartTime) > 4500) {
        isFinished = true;
        setAnimationState('envelope');
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleOpenLetter = () => {
    setAnimationState('reading');
    setShowLetter(true);
  };

  const handleCloseLetter = () => {
    setShowLetter(false);
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 500);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#fff0f5] overflow-hidden cursor-pointer">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      {/* 信封容器 */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 z-10 flex flex-col items-center justify-center
          ${animationState !== 'flying' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}
        `}
      >
        <div 
          onClick={handleOpenLetter}
          className="relative cursor-pointer group animate-float"
        >
            {/* 信封 */}
            <div className="w-80 h-52 bg-white border-[6px] border-rose-200 shadow-[0_25px_60px_rgba(255,105,180,0.4)] rounded-3xl relative overflow-hidden flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
                <div className="absolute inset-0 opacity-10" 
                    style={{ backgroundImage: 'radial-gradient(#ff69b4 2px, transparent 2px)', backgroundSize: '18px 18px' }}>
                </div>
                
                {/* 替换为抱心 Kitty */}
                <img 
                    src="https://pngimg.com/uploads/hello_kitty/hello_kitty_PNG20.png"
                    alt="Kitty"
                    className="w-28 h-28 object-contain z-10 drop-shadow-md"
                />
                
                <div className="absolute bottom-4 left-0 right-0 text-center">
                   <div className="inline-block px-5 py-1.5 bg-rose-100 rounded-full text-rose-500 font-romantic font-bold text-xl tracking-wider shadow-sm">
                      To: 乐丽欣
                   </div>
                </div>
            </div>

            <KittyBow className="w-24 h-24 text-[#E60012] absolute -top-10 -right-10 drop-shadow-xl z-20 rotate-12 group-hover:rotate-[20deg] transition-transform duration-300" />
            
            {/* 增加吉他 Kitty 装饰在旁边 */}
             <img 
                src="https://pngimg.com/uploads/hello_kitty/hello_kitty_PNG32.png" 
                className="absolute -bottom-8 -left-12 w-20 h-20 rotate-[-15deg] drop-shadow-lg z-30"
                alt="Angel Kitty"
            />

            <div className="absolute -bottom-24 left-0 right-0 text-center">
                <p className="text-rose-400 font-romantic text-2xl animate-pulse tracking-widest drop-shadow-sm">点击开启碎片日记</p>
            </div>
        </div>
      </div>

      <LetterModal isOpen={showLetter} onClose={handleCloseLetter} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-float {
          animation: float 4.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
