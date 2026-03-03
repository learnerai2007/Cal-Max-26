
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Share2, Sparkles, LayoutGrid, Info, X, Star, MoreVertical, RotateCcw, Copy, Download, Heart } from 'lucide-react';
import { CalculatorDef, HistoryItem } from '../../types';
import { CalculatorForm } from '../CalculatorForm';
import { ResultsView } from '../ResultsView';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface MobileWorkspaceProps {
  calculator: CalculatorDef;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const DynamicIcon = ({ name, size = 20 }: { name: string, size?: number }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Calculator;
  return <Icon size={size} />;
};

const MenuButton = ({ icon, label, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all border ${active ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-bg-secondary/30 border-border-color text-text-secondary hover:text-text-primary hover:bg-bg-secondary'}`}
  >
    <div className="mb-2">{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export const MobileWorkspace: React.FC<MobileWorkspaceProps> = ({ 
  calculator, 
  onBack,
  isFavorite,
  onToggleFavorite,
  onAddToHistory
}) => {
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    calculator.inputs.forEach(i => defaults[i.id] = i.defaultValue);
    return defaults;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleInputChange = (id: string, val: any) => {
    setInputs(prev => ({ ...prev, [id]: val }));
  };

  const resetInputs = () => {
    const defaults: Record<string, any> = {};
    calculator.inputs.forEach(i => defaults[i.id] = i.defaultValue);
    setInputs(defaults);
    setIsMenuOpen(false);
  };

  const results = useMemo(() => {
    try {
      const raw = calculator.calculate(inputs);
      const outputs = calculator.formatResults(raw);
      const chart = calculator.getChartData ? calculator.getChartData(raw) : null;
      return { outputs, raw, chart };
    } catch (e) {
      return { outputs: [], raw: {}, chart: null };
    }
  }, [calculator, inputs]);

  // Track history when calculation changes significantly
  useEffect(() => {
    const timer = setTimeout(() => {
      onAddToHistory({
        calculatorId: calculator.id,
        calculatorName: calculator.name,
        inputs,
        results: results.outputs
      });
    }, 2000); // 2s debounce for history tracking
    return () => clearTimeout(timer);
  }, [results.outputs, calculator.id]);

  return (
    <div className="fixed inset-0 bg-bg-primary z-40 flex flex-col animate-slide-up no-scrollbar overflow-hidden">
      <header className="h-20 flex items-center px-6 border-b-2 border-border-color shrink-0 bg-bg-primary/80 backdrop-blur-xl z-50 shiny high-depth matte-surface">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-bg-secondary/50 border border-border-color text-text-secondary active:scale-90 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div className="ml-5 flex-1 min-w-0">
          <h2 className="text-base font-black text-text-primary truncate tracking-tight">{calculator.name}</h2>
          <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mt-0.5">{calculator.category}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all border ${isMenuOpen ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'bg-bg-secondary/50 border-border-color text-text-secondary'}`}
          >
             <MoreVertical size={24} />
          </button>
        </div>

        {/* Pop-up Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                className="absolute top-24 right-6 w-64 bg-bg-primary border-2 border-border-color rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden high-depth matte-surface p-3"
              >
                <div className="grid grid-cols-2 gap-2">
                   <MenuButton 
                    icon={<RotateCcw size={20} />} 
                    label="Reset" 
                    onClick={resetInputs} 
                   />
                   <MenuButton 
                    icon={<Heart size={20} fill={isFavorite ? "currentColor" : "none"} />} 
                    label={isFavorite ? "Saved" : "Save"} 
                    onClick={() => { onToggleFavorite(); setIsMenuOpen(false); }}
                    active={isFavorite}
                   />
                   <MenuButton 
                    icon={<Share2 size={20} />} 
                    label="Share" 
                    onClick={() => setIsMenuOpen(false)} 
                   />
                   <MenuButton 
                    icon={<Copy size={20} />} 
                    label="Copy" 
                    onClick={() => setIsMenuOpen(false)} 
                   />
                   <MenuButton 
                    icon={<Download size={20} />} 
                    label="Export" 
                    onClick={() => setIsMenuOpen(false)} 
                   />
                   <MenuButton 
                    icon={<Info size={20} />} 
                    label="Info" 
                    onClick={() => setIsMenuOpen(false)} 
                   />
                </div>
                <div className="mt-3 p-4 bg-bg-secondary/50 rounded-2xl border border-border-color text-center">
                   <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">Toolkit Version 2.5.0</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-10 pb-40 no-scrollbar">
        <section>
          <div className="flex items-center space-x-2 mb-6 opacity-60">
             <div className="w-1 h-1 bg-accent rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-primary">Input Data</span>
          </div>
          <CalculatorForm calculator={calculator} values={inputs} onChange={handleInputChange} />
        </section>

        <section className="pt-6 border-t border-border-color">
          <div className="flex items-center space-x-2 mb-6 opacity-60">
             <div className="w-1 h-1 bg-accent rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-primary">Calculated Results</span>
          </div>
          <ResultsView 
            calculator={calculator} 
            inputs={inputs} 
            results={results.outputs} 
            chartConfig={results.chart} 
          />
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent pointer-events-none z-10" />
    </div>
  );
};
