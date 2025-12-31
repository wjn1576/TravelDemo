
import React, { useEffect, useState, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

// --- 1. Number Counter Animation ---
interface NumberCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

export const NumberCounter: React.FC<NumberCounterProps> = ({ end, duration = 1500, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - percentage, 4);
      
      setCount(Math.floor(ease * end));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span className="font-mono-tech">{count.toLocaleString()}{suffix}</span>;
};

// --- 2. Lottie Icon Wrapper ---
// Uses dotlottie-player custom element defined in index.html
interface LottieIconProps {
  src: string; // URL to .lottie or .json
  size?: string;
}

export const LottieIcon: React.FC<LottieIconProps> = ({ src, size = '100px' }) => {
  return (
    <div style={{ width: size, height: size }} className="relative">
      {/* Fix: Use React.createElement to avoid 'JSX.IntrinsicElements' error for the 'dotlottie-player' custom web component */}
      {React.createElement('dotlottie-player' as any, {
        src: src,
        background: 'transparent',
        speed: '1',
        style: { width: '100%', height: '100%' },
        loop: true,
        autoplay: true,
      })}
    </div>
  );
};

// --- 3. Glow Button ---
interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
}

export const GlowButton: React.FC<GlowButtonProps> = ({ children, icon: Icon, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 animate-glow-pulse shadow-[0_0_15px_rgba(79,70,229,0.4)]",
    secondary: "bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 hover:bg-white/20"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </span>
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
    </button>
  );
};

// --- 4. Gradient Tech Card ---
interface TechCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const TechCard: React.FC<TechCardProps> = ({ children, delay = 0, className = '' }) => {
  return (
    <div 
      className={`relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 group overflow-hidden animate-rise-glow ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      
      {/* Corner Accents */}
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-indigo-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-indigo-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {children}
    </div>
  );
};
