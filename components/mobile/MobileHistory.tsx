
import React from 'react';
import { Clock, Trash2, ArrowRight, Calculator } from 'lucide-react';
import { HistoryItem, CalculatorDef } from '../../types';
import { CALCULATORS } from '../../services/calculatorEngine';

interface MobileHistoryProps {
  history: HistoryItem[];
  onSelectCalculator: (c: CalculatorDef) => void;
  onClearHistory: () => void;
}

export const MobileHistory: React.FC<MobileHistoryProps> = ({ 
  history, 
  onSelectCalculator,
  onClearHistory 
}) => {
  if (history.length === 0) {
    return (
      <div className="p-10 h-full flex flex-col items-center justify-center py-32 space-y-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center text-text-secondary/20 shadow-inner">
          <Clock size={40} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary tracking-tight">Recent Calculations</h3>
          <p className="text-xs text-text-secondary max-w-[240px] mx-auto mt-3 leading-relaxed font-medium">Your calculation history is stored locally and will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 pb-32 animate-fade-in">
      <div className="flex items-center justify-between px-2">
         <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Computation Log</h2>
         <button onClick={onClearHistory} className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary/50 text-text-secondary hover:text-rose-500 transition-all active:scale-90">
            <Trash2 size={18} />
         </button>
      </div>

      <div className="space-y-6">
        {history.map(item => {
          const tool = CALCULATORS.find(c => c.id === item.calculatorId);
          if (!tool) return null;
          
          return (
            <div key={item.id} className="bg-bg-secondary/30 border border-border-color rounded-[2.5rem] p-6 shadow-sm space-y-5 high-depth matte-surface">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center shadow-inner">
                        <Calculator size={22} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-text-primary tracking-tight">{item.calculatorName}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mt-0.5">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => onSelectCalculator(tool)}
                    className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition-all active:scale-90"
                  >
                    <ArrowRight size={20} />
                  </button>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border-color">
                  {item.results.slice(0, 2).map(res => (
                    <div key={res.id} className="space-y-1">
                       <p className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em]">{res.label}</p>
                       <p className="text-sm font-bold text-text-primary tracking-tight">{res.value} <span className="text-[10px] font-normal text-text-secondary">{res.unit}</span></p>
                    </div>
                  ))}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
