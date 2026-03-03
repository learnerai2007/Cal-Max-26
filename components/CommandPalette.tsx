
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
      
      <div className="relative w-full max-w-xl bg-bg-primary rounded-[2.5rem] border border-border-color shadow-2xl overflow-hidden animate-fade-up card-shadow">
        <div className="p-6 border-b border-border-color flex items-center space-x-4">
          <Search size={24} className="text-text-secondary" />
          <input 
            autoFocus
            type="text" 
            placeholder="What should we calculate?"
            className="flex-1 bg-transparent border-none outline-none text-text-primary text-xl font-medium placeholder:text-text-secondary/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex items-center px-2.5 py-1 bg-bg-secondary text-text-secondary rounded-xl text-[10px] font-bold border border-border-color">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-3 space-y-1">
          {results.length > 0 ? (
            results.map((calc, idx) => (
              <button
                key={calc.id}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => onSelect(calc)}
                className={`
                  w-full flex items-center justify-between p-4 rounded-2xl transition-all group
                  ${selectedIndex === idx ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'hover:bg-bg-secondary'}
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${selectedIndex === idx ? 'bg-white/20' : 'bg-bg-secondary text-text-secondary'}
                  `}>
                    <Calculator size={22} />
                  </div>
                  <div className="text-left">
                    <h4 className={`text-base font-bold ${selectedIndex === idx ? 'text-white' : 'text-text-primary'}`}>{calc.name}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedIndex === idx ? 'text-white/70' : 'text-text-secondary'}`}>{calc.category}</p>
                  </div>
                </div>
                <div className={`
                  flex items-center space-x-2 transition-transform duration-300
                  ${selectedIndex === idx ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
                `}>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Launch</span>
                  <ArrowRight size={16} />
                </div>
              </button>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-text-secondary/30">
                <Search size={40} />
              </div>
              <p className="text-text-secondary font-medium">No tools found for "{query}"</p>
            </div>
          )}
        </div>

        <div className="p-5 bg-bg-secondary/50 border-t border-border-color flex items-center justify-between">
           <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                <kbd className="px-1.5 py-0.5 bg-bg-primary border border-border-color rounded-lg shadow-sm">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                <kbd className="px-1.5 py-0.5 bg-bg-primary border border-border-color rounded-lg shadow-sm">ENTER</kbd>
                <span>Select</span>
              </div>
           </div>
           <div className="flex items-center space-x-2 text-[10px] font-bold text-accent uppercase tracking-widest">
              <Sparkles size={12} />
              <span>Lumina Search</span>
           </div>
        </div>
      </div>
    </div>
  );
};
