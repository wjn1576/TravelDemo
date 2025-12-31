import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PetalBackground } from './components/PetalBackground';
import { MemoryGallery } from './components/MemoryGallery';
import { RomanticHero } from './components/RomanticHero';

const KittyBow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" className={className} fill="currentColor">
    <path d="M50 25c-5-8-20-15-35-5S5 55 25 55s20-10 25-20c5 10 5 20 25 20s25-25 10-35-30 3-35 5z" />
    <circle cx="50" cy="30" r="8" />
  </svg>
);

export default function App() {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff5f8] text-rose-400 overflow-x-hidden relative">
      {!showGallery ? (
        <div className="fixed inset-0 z-50">
          <RomanticHero onComplete={() => setShowGallery(true)} />
        </div>
      ) : (
        <div className="relative animate-in fade-in duration-1000 pb-20">
          <PetalBackground />
          
          <header className="relative z-10 pt-16 pb-8 text-center">
            {/* Header Icon Replacement: Hello Kitty Portrait */}
            <div className="relative inline-block mb-6 group cursor-pointer">
              <div className="w-28 h-28 mx-auto bg-white rounded-full shadow-pink-200 shadow-2xl border-[6px] border-rose-100 flex items-center justify-center animate-heart-beat overflow-hidden relative transition-transform group-hover:scale-105">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/220px-Hello_kitty_character_portrait.png" 
                  alt="Hello Kitty" 
                  className="w-20 h-20 object-contain mt-3"
                />
              </div>
              <KittyBow className="absolute -top-2 -right-2 w-12 h-12 text-[#E60012] drop-shadow-md rotate-12 animate-pulse" />
              {/* Added Extra Element: Angel Wings */}
              <div className="absolute -left-12 top-0 text-3xl animate-bounce delay-700">👼</div>
              <div className="absolute -right-12 top-0 text-3xl animate-bounce delay-1000">✨</div>
            </div>
            <h1 className="text-6xl font-romantic text-rose-500 mb-3 tracking-tighter drop-shadow-sm">碎片日记</h1>
            <p className="text-rose-300 tracking-[0.6em] text-xs font-bold uppercase">2026 . Lele's Journal</p>
          </header>

          <main className="relative z-10">
            <MemoryGallery />
            
            <div className="max-w-2xl mx-auto mt-32 p-12 bg-white/60 backdrop-blur-xl rounded-[4rem] text-center border-4 border-rose-50 shadow-2xl shadow-rose-100/50 relative group transition-all hover:shadow-rose-200/60">
              {/* Hero Section Icon Replacement: Cute Kitty Sticker */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-110">
                 <img 
                    src="https://pngimg.com/uploads/hello_kitty/hello_kitty_PNG32.png" 
                    alt="Kitty Decor" 
                    className="w-32 h-32 object-contain drop-shadow-lg filter hover:brightness-110"
                 />
              </div>

               {/* Extra Decor: Small Bows around text */}
               <KittyBow className="absolute top-10 left-10 w-8 h-8 text-rose-200 rotate-[-15deg] opacity-60" />
               <KittyBow className="absolute bottom-10 right-10 w-8 h-8 text-rose-200 rotate-[15deg] opacity-60" />
              
              <div className="mt-8">
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

          <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20">
            <button 
              onClick={() => setShowGallery(false)}
              className="px-10 py-4 bg-white/80 backdrop-blur-md rounded-full text-sm font-bold tracking-widest text-rose-400 shadow-xl border-2 border-rose-100 hover:bg-rose-50 transition-all flex items-center gap-4 group"
            >
              <KittyBow className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 回看日记
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
      `}</style>
    </div>
  );
}
