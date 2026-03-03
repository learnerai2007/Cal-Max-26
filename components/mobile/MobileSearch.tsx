import React, { useState, useMemo } from 'react';
import { Search, Calculator, Star, X } from 'lucide-react';
import { CALCULATORS } from '../../services/calculatorEngine';
import { CalculatorDef } from '../../types';

export const MobileSearch: React.FC<{ onSelectCalculator: (c: CalculatorDef) => void }> = ({ onSelectCalculator }) => {
  const [query, setQuery] = useState('');
  
  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return CALCULATORS.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [query]);

  const tags = ['Mortgage', 'BMI', 'Loan', 'Percentage', 'SIP', 'Tax'];

  return (
    <div className="p-8 space-y-10 animate-fade-in">
      <div className="relative group">
        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" />
        <input 
          autoFocus
          type="text"
          placeholder="What do you want to calculate?"
          className="w-full bg-bg-secondary/50 border border-border-color rounded-2xl py-5 pl-14 pr-4 text-sm font-bold text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all shadow-inner"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
             <X size={20} />
          </button>
        )}
      </div>

      {!query ? (
        <div className="space-y-10">
          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary px-2">Common Searches</h3>
             <div className="flex flex-wrap gap-3">
                {tags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-5 py-3 bg-bg-secondary/50 text-text-primary text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-accent/10 hover:text-accent transition-all border border-border-color active:scale-95"
                  >
                    {tag}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="p-10 text-center bg-accent/5 rounded-[2.5rem] border border-accent/10 high-depth matte-surface">
             <Calculator size={40} className="mx-auto text-accent mb-6 opacity-40 animate-pulse-subtle" />
             <p className="text-xs text-text-secondary leading-relaxed font-medium">Search through our database of 200+ specialized computation engines.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-2">{results.length} Tools Found</p>
           <div className="space-y-4">
             {results.map(calc => (
               <button
                key={calc.id}
                onClick={() => onSelectCalculator(calc)}
                className="w-full p-5 bg-bg-secondary/30 border border-border-color rounded-3xl flex items-center space-x-5 text-left active:scale-[0.98] transition-all high-depth matte-surface"
               >
                 <div className="w-12 h-12 bg-bg-secondary text-accent rounded-2xl flex items-center justify-center shadow-inner">
                    <Calculator size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-text-primary">{calc.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mt-1">{calc.category}</p>
                 </div>
               </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};
