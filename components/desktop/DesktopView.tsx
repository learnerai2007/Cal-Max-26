
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../Sidebar';
import { CalculatorForm } from '../CalculatorForm';
import { ResultsView } from '../ResultsView';
import { DashboardHome } from '../DashboardHome';
import { CALCULATORS } from '../../services/calculatorEngine';
import { CalculatorDef, CalculatorCategory, HistoryItem } from '../../types';
import { Search, Settings, LayoutGrid, Sparkles, ChevronRight, ArrowRight, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, size = 20 }: { name: string, size?: number }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Calculator;
  return <Icon size={size} />;
};

interface DesktopViewProps {
  selectedCalculator: CalculatorDef | null;
  onSelectCalculator: (c: CalculatorDef | null) => void;
  activeCategory: CalculatorCategory | 'All';
  onSelectCategory: (c: any) => void;
  onOpenSettings: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  history: HistoryItem[];
  onAddToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

export const DesktopView: React.FC<DesktopViewProps> = ({
  selectedCalculator,
  onSelectCalculator,
  activeCategory,
  onSelectCategory,
  onOpenSettings,
  favorites,
  onToggleFavorite,
  history,
  onAddToHistory
}) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedCalculator) {
      const defaults: Record<string, any> = {};
      selectedCalculator.inputs.forEach(i => defaults[i.id] = i.defaultValue);
      setInputs(defaults);
    }
  }, [selectedCalculator]);

  const results = useMemo(() => {
    if (!selectedCalculator) return null;
    try {
      const raw = selectedCalculator.calculate(inputs);
      const outputs = selectedCalculator.formatResults(raw);
      const chart = selectedCalculator.getChartData ? selectedCalculator.getChartData(raw) : null;
      return { outputs, raw, chart };
    } catch (e) {
      return null;
    }
  }, [selectedCalculator, inputs]);

  const handleInputChange = (id: string, val: any) => {
    setInputs(prev => ({ ...prev, [id]: val }));
  };

  const filteredTools = useMemo(() => {
    const q = searchTerm.toLowerCase();
    let base = activeCategory === 'All' ? CALCULATORS : CALCULATORS.filter(c => c.category === activeCategory);
    if (!q) return base;
    return base.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [activeCategory, searchTerm]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-bg-primary/80 backdrop-blur-md border-b border-border-color px-10 flex items-center justify-between z-30">
          <div className="flex items-center space-x-3">
             <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] flex items-center">
              {activeCategory}
              {selectedCalculator && (
                <>
                  <ChevronRight size={12} className="mx-2 opacity-50" />
                  <span className="text-text-primary normal-case tracking-normal text-xs font-extrabold">{selectedCalculator.name}</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-6">
             <div className="relative group w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Press ⌘K to Search..." 
                  className="w-full bg-bg-secondary border border-border-color rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary focus:ring-2 focus:ring-accent/20 outline-none transition-all cursor-pointer"
                  onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                  readOnly
                />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar p-0">
          {selectedCalculator ? (
             <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 animate-fade-up p-10">
                <div className="col-span-12 lg:col-span-7 space-y-6">
                   <div className="glass rounded-3xl p-10 relative overflow-hidden card-shadow">
                      <div className="flex items-center space-x-4 mb-10">
                        <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-accent/20">
                          <DynamicIcon name={selectedCalculator.icon} size={28} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                             <h2 className="text-2xl font-bold text-text-primary tracking-tight">{selectedCalculator.name}</h2>
                             <button 
                                onClick={() => onToggleFavorite(selectedCalculator.id)}
                                className={`transition-colors ${favorites.includes(selectedCalculator.id) ? 'text-amber-500' : 'text-text-secondary hover:text-text-primary'}`}
                             >
                                <Star size={20} fill={favorites.includes(selectedCalculator.id) ? "currentColor" : "none"} />
                             </button>
                          </div>
                          <p className="text-xs text-text-secondary mt-1">{selectedCalculator.description}</p>
                        </div>
                        <button 
                          onClick={() => onSelectCalculator(null)}
                          className="ml-auto w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary text-text-secondary hover:text-accent transition-all"
                        >
                          <LayoutGrid size={20} />
                        </button>
                      </div>
                      <CalculatorForm calculator={selectedCalculator} values={inputs} onChange={handleInputChange} />
                   </div>
                </div>

                <div className="col-span-12 lg:col-span-5">
                   <div className="bg-bg-secondary border border-border-color rounded-3xl p-10 h-full card-shadow">
                      <div className="flex items-center space-x-2 mb-8 opacity-60">
                         <Sparkles size={14} className="text-accent" />
                         <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-primary">Results Engine</span>
                      </div>
                      {results && (
                        <ResultsView 
                          calculator={selectedCalculator} 
                          inputs={inputs} 
                          results={results.outputs} 
                          chartConfig={results.chart} 
                        />
                      )}
                   </div>
                </div>
             </div>
          ) : activeCategory === 'All' && !searchTerm ? (
            <DashboardHome onSelectCalculator={onSelectCalculator} favorites={favorites} history={history} />
          ) : (
            <div className="max-w-6xl mx-auto animate-fade-up p-10">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map((calc, idx) => (
                    <button 
                      key={calc.id}
                      onClick={() => onSelectCalculator(calc)}
                      className="group glass rounded-3xl p-8 text-left hover:border-accent/50 transition-all card-shadow"
                    >
                      <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-text-secondary group-hover:text-white group-hover:bg-accent transition-all mb-6">
                        <DynamicIcon name={calc.icon} size={24} />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                         <h3 className="text-base font-bold text-text-primary">{calc.name}</h3>
                         {favorites.includes(calc.id) && <Star size={14} className="text-amber-500" fill="currentColor" />}
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed mb-6 line-clamp-2">{calc.description}</p>
                      <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-accent group-hover:gap-2 transition-all">
                        Launch Engine <ArrowRight size={12} className="ml-1" />
                      </div>
                    </button>
                  ))}
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
