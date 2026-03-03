
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calculator, ArrowRight, Zap, Star, Sparkles } from 'lucide-react';
import { CALCULATORS } from '../services/calculatorEngine';
import { CalculatorDef } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (calc: CalculatorDef) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return CALCULATORS.slice(0, 6);
    return CALCULATORS.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.category.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        if (results[selectedIndex]) onSelect(results[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-bg-primary/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-bg-primary rounded-[3.5rem] border-2 border-border-color shadow-[0_0_100px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-up high-depth matte-surface">
        <div className="p-10 border-b-2 border-border-color flex items-center space-x-6 bg-bg-primary/80 backdrop-blur-xl z-10 shiny">
          <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center text-accent shadow-inner">
            <Search size={32} />
          </div>
          <input 
            autoFocus
            type="text" 
            placeholder="Search Intelligence Toolkits..."
            className="flex-1 bg-transparent border-none outline-none text-text-primary text-3xl font-black tracking-tighter placeholder:text-text-secondary/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="hidden sm:flex items-center space-x-3">
            <kbd className="px-4 py-2 bg-bg-secondary text-text-secondary rounded-2xl text-[10px] font-black border border-border-color shadow-sm">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto no-scrollbar p-6 space-y-3">
          {results.length > 0 ? (
            results.map((calc, idx) => (
              <button
                key={calc.id}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => onSelect(calc)}
                className={`
                  w-full flex items-center justify-between p-6 rounded-[2.5rem] transition-all group relative overflow-hidden
                  ${selectedIndex === idx ? 'bg-accent text-white shadow-[0_20px_50px_rgba(var(--accent-rgb),0.3)] scale-[1.02] z-10' : 'hover:bg-bg-secondary/50'}
                `}
              >
                <div className="flex items-center space-x-6">
                  <div className={`
                    w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-inner
                    ${selectedIndex === idx ? 'bg-white/20 rotate-12' : 'bg-bg-secondary text-accent group-hover:text-white group-hover:bg-accent'}
                  `}>
                    <Calculator size={32} />
                  </div>
                  <div className="text-left">
                    <h4 className={`text-xl font-black tracking-tight ${selectedIndex === idx ? 'text-white' : 'text-text-primary'}`}>{calc.name}</h4>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-1.5 ${selectedIndex === idx ? 'text-white/70' : 'text-text-secondary'}`}>{calc.category}</p>
                  </div>
                </div>
                <div className={`
                  flex items-center space-x-4 transition-all duration-500
                  ${selectedIndex === idx ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}
                `}>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Execute</span>
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                    <ArrowRight size={22} />
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-24 text-center">
              <div className="w-32 h-32 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-10 text-text-secondary/10 shadow-inner">
                <Search size={64} />
              </div>
              <p className="text-text-primary font-black text-2xl tracking-tight">No toolkits found</p>
              <p className="text-text-secondary text-[10px] uppercase tracking-[0.4em] mt-3">Try refining your search parameters</p>
            </div>
          )}
        </div>

        <div className="p-10 bg-bg-secondary/50 border-t-2 border-border-color flex items-center justify-between backdrop-blur-xl">
           <div className="flex items-center space-x-10">
              <div className="flex items-center space-x-4 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">
                <div className="flex gap-2">
                  <kbd className="px-3 py-1.5 bg-bg-primary border border-border-color rounded-xl shadow-sm">↑</kbd>
                  <kbd className="px-3 py-1.5 bg-bg-primary border border-border-color rounded-xl shadow-sm">↓</kbd>
                </div>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-4 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">
                <kbd className="px-4 py-1.5 bg-bg-primary border border-border-color rounded-xl shadow-sm">ENTER</kbd>
                <span>Select</span>
              </div>
           </div>
           <div className="flex items-center space-x-3 text-[10px] font-black text-accent uppercase tracking-[0.4em]">
              <Sparkles size={16} className="animate-pulse-subtle" />
              <span>Lumina Intelligence</span>
           </div>
        </div>
      </div>
    </div>
  );
};
