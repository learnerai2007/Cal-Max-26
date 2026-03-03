
import React, { useState, useMemo } from 'react';
import { CalculatorDef, CalculatorCategory } from '../../types';
import { CALCULATORS } from '../../services/calculatorEngine';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  TrendingUp, 
  Activity, 
  Calculator as CalcIcon, 
  Cpu, 
  Settings, 
  X,
  Plus,
  Minus
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, size = 18 }: { name: string, size?: number }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Calculator;
  return <Icon size={size} />;
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Finance': <TrendingUp size={18} className="text-emerald-400" />,
  'Health': <Activity size={18} className="text-rose-400" />,
  'Math': <CalcIcon size={18} className="text-indigo-400" />,
  'Engineering': <Cpu size={18} className="text-amber-400" />,
  'Utility': <Settings size={18} className="text-slate-400" />,
};

interface MobileToolsProps {
  onSelectCalculator: (calc: CalculatorDef) => void;
}

export const MobileTools: React.FC<MobileToolsProps> = ({ onSelectCalculator }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(['Finance', 'Math']));

  const groupedCalculators = useMemo(() => {
    const groups: Record<string, CalculatorDef[]> = {};
    const query = searchQuery.toLowerCase();

    CALCULATORS.forEach(calc => {
      if (
        query && 
        !calc.name.toLowerCase().includes(query) && 
        !calc.description.toLowerCase().includes(query)
      ) return;

      if (!groups[calc.category]) groups[calc.category] = [];
      groups[calc.category].push(calc);
    });
    return groups;
  }, [searchQuery]);

  const toggleCategory = (cat: string) => {
    const next = new Set(expandedCats);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setExpandedCats(next);
  };

  const categories = Object.keys(groupedCalculators).sort();

  return (
    <div className="animate-fade-in flex flex-col h-full bg-bg-primary">
      {/* Search Header */}
      <div className="sticky top-0 bg-bg-primary/80 backdrop-blur-xl z-30 px-6 py-6 border-b border-border-color shiny">
        <div className="relative group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" />
          <input 
            type="text"
            placeholder="Search toolkits..."
            className="w-full bg-bg-secondary/50 border border-border-color rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-10 space-y-6 pb-32">
        {categories.length > 0 ? (
          categories.map(cat => {
            const isOpen = expandedCats.has(cat) || searchQuery !== '';
            const calcs = groupedCalculators[cat];

            return (
              <div key={cat} className="space-y-3">
                {/* Category Node */}
                <button
                  onClick={() => toggleCategory(cat)}
                  className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all high-depth matte-surface ${isOpen ? 'bg-bg-secondary/80 border-accent/20' : 'bg-bg-secondary/30 border-border-color'}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl transition-all ${isOpen ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'bg-bg-secondary text-text-secondary'}`}>
                      {CATEGORY_ICONS[cat] || <CalcIcon size={20} />}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-text-primary">{cat}</span>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-tight mt-0.5">{calcs.length} Specialized Tools</p>
                    </div>
                  </div>
                  <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus size={18} className="text-accent" /> : <Plus size={18} className="text-text-secondary" />}
                  </div>
                </button>

                {/* Leaves (Calculators) */}
                {isOpen && (
                  <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-border-color ml-8 py-2">
                    {calcs.map((calc, idx) => (
                      <button
                        key={calc.id}
                        onClick={() => onSelectCalculator(calc)}
                        className="flex items-center space-x-5 p-5 bg-bg-secondary/20 border border-border-color rounded-2xl active:bg-accent/10 active:border-accent/20 transition-all text-left animate-fade-up high-depth matte-surface"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <div className="w-10 h-10 bg-bg-secondary text-accent rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                          <DynamicIcon name={calc.icon} size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-text-primary truncate">{calc.name}</h4>
                          <p className="text-[10px] text-text-secondary truncate mt-1 leading-tight">{calc.description}</p>
                        </div>
                        <div className="text-text-secondary/30">
                          <ChevronRight size={16} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-bg-secondary rounded-[2rem] flex items-center justify-center mx-auto text-text-secondary/20">
               <Search size={40} />
            </div>
            <p className="text-sm font-bold text-text-secondary">No matching toolkits found</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-accent px-6 py-3 bg-accent/10 rounded-xl hover:bg-accent/20 transition-all"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
