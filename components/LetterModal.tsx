import React from 'react';
import { X } from 'lucide-react';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelloKittySticker = ({ src, className }: { src: string, className: string }) => (
  <img src={src} className={`absolute drop-shadow-md select-none pointer-events-none ${className}`} alt="decoration" />
);

export const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative w-full max-w-2xl mx-4 perspective-1000">
        
        {/* 信纸容器 */}
        <div className="bg-[#fff0f5] relative rounded-lg shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-500 border-[8px] border-white ring-4 ring-rose-200">
          
          {/* 纹理背景 */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(#ff69b4 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          {/* 装饰贴纸 - 增加更多款式 */}
          <HelloKittySticker 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Hello_kitty_character_portrait.png/220px-Hello_kitty_character_portrait.png" 
            className="-top-4 -right-4 w-24 opacity-90 rotate-12"
          />
          <HelloKittySticker 
            src="https://pngimg.com/uploads/hello_kitty/hello_kitty_PNG32.png" 
            className="bottom-0 left-0 w-24 opacity-80 -rotate-12 transform scale-x-[-1]" 
          />
          {/* 增加一个中间的水印贴纸 */}
           <HelloKittySticker 
            src="https://pngimg.com/uploads/hello_kitty/hello_kitty_PNG20.png" 
            className="top-1/2 left-4 w-16 opacity-20 -rotate-6" 
          />
          
          {/* 内容区域 */}
          <div className="relative z-10 p-8 md:p-12 text-rose-900 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-rose-300 hover:text-rose-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="font-romantic text-2xl md:text-3xl leading-relaxed space-y-6 text-center">
              <p className="font-bold text-rose-500 text-3xl mb-8 text-left pl-4">亲爱的乐丽欣：</p>
              
              <div className="space-y-8 text-left text-lg md:text-xl font-medium text-slate-700 font-serif leading-loose">
                <p>
                  新年快乐。2026 年已经来了，我想给你写点什么。
                </p>
                <p>
                  你知道的，我其实不太会表达。我的生活看起来也很普通，吃喝玩乐，包括路过的风景也没什么特别的，其实我以前很少会去记录这些东西。总觉得没什么好说的，所以也不咋喜欢分享。
                </p>
                <p className="font-bold text-rose-600">
                   直到遇见老公。
                </p>
                <p>
                  你会认真问我今天吃了什么、做了什么、有没有看到有意思的事。一开始我其实不太习惯，只愿意把那些看起来“还不错”的照片发给你。后来我才突然顿悟，你是真的想了解我，老公你对我太好了我哭死。
                </p>
                <p>
                  你之前写给我的信我真的哭出来了你知道吗我去。还有国庆你来找我的那段时间，我真的特别幸福。和你抱在一起的时候，我心里很安心。爱你爱你爱你。
                </p>
                <p>
                  我真的很喜欢你身上的真诚和炙热。我想和你聊生命、童年、恐惧，还有未来的路。和你说话的时候，我会觉得生活是有深度、有重量的，而不是在空转。
                </p>
                <p>
                  我不完美，生活也常常无聊，但因为你，我愿意把一切都告诉你。开心的、疲惫的、平凡的，甚至不太好看的部分。我都想和你分享，也想听你的一切。
                </p>
                <p className="p-4 bg-white/50 rounded-2xl border border-rose-100 shadow-sm text-center font-romantic text-2xl text-rose-600 mt-8">
                  “新的一年，希望咱们还能这样聊天、这样拥抱、这样慢慢走下去。希望宝宝健康、快乐，希望宝宝的愿望都能实现。”
                </p>
                <p className="text-center">
                   我也会努力学会表达。爱爱你啊宝宝。还有宝宝给的情绪价值真的很高，我爱死你了，我要追随女神一辈子。
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
               <button 
                 onClick={onClose}
                 className="bg-rose-400 hover:bg-rose-500 text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-rose-200 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
               >
                 永远爱你 ❤
               </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #f43f5e;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #ffe4e6;
        }
      `}</style>
    </div>
  );
};
