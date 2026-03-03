import React from 'react';
import { Sparkles, Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GlobalHeader = ({ onOpenSettings }: { onOpenSettings: () => void }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-bg-primary/80 backdrop-blur-xl border-b border-border-color transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-color to-accent-color-dark flex items-center justify-center shadow-lg shadow-accent-color/20">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-text-primary leading-tight tracking-tight">Lumina Calc</h1>
          <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">Pro Suite v2.5</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors">
          <Bell size={20} />
        </button>
        <button 
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
};
