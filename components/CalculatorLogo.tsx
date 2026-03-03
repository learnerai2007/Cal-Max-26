
import React from 'react';

export const CalculatorLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative ${className} group cursor-pointer`}>
      {/* 3D "Shadow" Layer */}
      <div className="absolute inset-0 bg-indigo-800 rounded-[2.5rem] translate-y-4 group-hover:translate-y-2 transition-transform duration-300"></div>
      
      {/* Main Body */}
      <div className="relative bg-indigo-500 rounded-[2.5rem] p-6 border-4 border-indigo-900 shadow-2xl transform group-hover:-translate-y-2 transition-all duration-300 overflow-hidden">
        {/* Screen */}
        <div className="bg-emerald-400 border-4 border-indigo-950 h-16 rounded-xl mb-6 flex items-center justify-end px-4 shadow-inner">
          <span className="mono text-2xl font-black text-indigo-950 tracking-tighter">1337.00</span>
        </div>
        
        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, '+', 4, 5, 6, '-', 7, 8, 9, '=', 'C', 0, '.', '÷'].map((btn, i) => (
            <div 
              key={i} 
              className={`h-8 rounded-lg border-2 border-indigo-950 flex items-center justify-center font-black text-xs shadow-[0px_2px_0px_0px_rgba(0,0,0,0.3)] 
                ${typeof btn === 'number' ? 'bg-indigo-300' : 
                  btn === '=' ? 'bg-rose-400 col-span-1' : 
                  btn === 'C' ? 'bg-amber-400' : 'bg-indigo-400'}`}
            >
              {btn}
            </div>
          ))}
        </div>

        {/* Shine Overlay */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 -skew-y-12 pointer-events-none"></div>
      </div>

      {/* Floating Elements Around */}
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-rose-500 rounded-full border-4 border-indigo-950 flex items-center justify-center text-white font-black animate-float">
        %
      </div>
      <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-amber-400 rounded-lg border-4 border-indigo-950 flex items-center justify-center text-indigo-950 font-black animate-float [animation-delay:1s]">
        π
      </div>
    </div>
  );
};
