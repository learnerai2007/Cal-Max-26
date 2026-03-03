
import React, { useState, useEffect } from 'react';
import { CalculatorDef, CalculatorResult, ChartConfig } from '../types';
import { Charts } from './Charts';
import { Sparkles, Share2, Download, X, Info, AlertCircle, RefreshCw } from 'lucide-react';
import { getAIExplanation } from '../services/geminiService';

interface ResultsViewProps {
  calculator: CalculatorDef;
  inputs: Record<string, any>;
  results: CalculatorResult[];
  chartConfig: ChartConfig | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ calculator, inputs, results, chartConfig }) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Reset internal state when tool or inputs change
  useEffect(() => {
    setAiExplanation(null);
    // Basic validation check for obvious errors like Infinity or NaN
    const hasError = results.some(r => 
      String(r.value).toLowerCase() === 'nan' || 
      String(r.value).toLowerCase() === 'infinity' || 
      String(r.value).includes('Error')
    );
    
    if (hasError) {
      setCalculationError("Computation threshold exceeded or invalid mathematical input detected.");
    } else {
      setCalculationError(null);
    }
  }, [calculator.id, results]);

  const handleAIExplain = async () => {
    if (calculationError) return;
    setIsLoadingAI(true);
    try {
      const outputs = results.reduce((acc, r) => ({ ...acc, [r.label]: `${r.value} ${r.unit || ''}` }), {});
      const explanation = await getAIExplanation(calculator.name, inputs, outputs);
      setAiExplanation(explanation);
    } catch (err) {
      setAiExplanation("AI analysis temporarily unavailable. Please verify inputs.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const formatValue = (res: CalculatorResult) => {
    if (res.type === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(res.value));
    }
    if (res.type === 'percent') {
      return `${Number(res.value).toFixed(2)}%`;
    }
    return res.value;
  };

  if (calculationError) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center animate-fade-up bg-rose-50 rounded-2xl border border-rose-100">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-6">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-2">Computation Aborted</h3>
        <p className="text-sm text-text-secondary mb-8 max-w-[280px] leading-relaxed">
          {calculationError}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-white border border-border-color rounded-xl text-xs font-bold uppercase tracking-widest text-text-primary hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <RefreshCw size={14} /> Reset Engine
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 h-full">
      <div className="grid grid-cols-1 gap-4">
        {results.map((res, idx) => (
          <div 
            key={res.id} 
            className={`
              p-6 rounded-2xl transition-all duration-500 animate-fade-up shadow-sm
              ${res.highlight 
                ? 'bg-accent-color text-white shadow-lg shadow-accent-color/20' 
                : 'bg-white border border-border-color'}
            `}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${res.highlight ? 'text-white/80' : 'text-text-secondary'}`}>
              {res.label}
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold tracking-tight leading-none ${res.highlight ? 'text-white' : 'text-text-primary'}`}>
                {formatValue(res)}
              </span>
              {res.unit && res.type !== 'currency' && res.type !== 'percent' && (
                <span className={`text-sm font-medium ${res.highlight ? 'text-white/80' : 'text-text-tertiary'}`}>{res.unit}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {chartConfig && (
        <div className="bg-white border border-border-color p-6 rounded-2xl animate-fade-up shadow-sm" style={{ animationDelay: '0.3s' }}>
           <Charts config={chartConfig} />
        </div>
      )}

      <div className="mt-auto space-y-4">
        {!aiExplanation ? (
           <button 
            className={`w-full group relative flex items-center justify-center space-x-2 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all overflow-hidden
              ${isLoadingAI ? 'bg-accent-color/10 text-accent-color' : 'bg-white border-2 border-accent-color text-accent-color hover:bg-accent-color hover:text-white shadow-sm hover:shadow-lg hover:shadow-accent-color/20'}
            `} 
            onClick={handleAIExplain}
            disabled={isLoadingAI}
          >
            {isLoadingAI && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            )}
            <Sparkles size={16} className={isLoadingAI ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} />
            <span className="relative z-10">{isLoadingAI ? 'Synthesizing...' : 'Generate AI Insights'}</span>
          </button>
        ) : (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 relative animate-fade-up shadow-lg shadow-indigo-500/5 overflow-hidden">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-2 text-indigo-600">
                 <Sparkles size={16} />
                 <span className="text-xs font-bold uppercase tracking-wider">OmniAI Summary</span>
               </div>
               <button onClick={() => setAiExplanation(null)} className="text-text-tertiary hover:text-text-primary transition-colors">
                  <X size={16} />
               </button>
             </div>
             <div className="text-sm text-text-secondary leading-relaxed font-medium space-y-2">
                {aiExplanation.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
             </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 opacity-60">
           <button className="text-xs font-bold text-text-secondary hover:text-accent-color uppercase tracking-wider flex items-center transition-colors">
             <Share2 size={14} className="mr-2" /> Share
           </button>
           <button className="text-xs font-bold text-text-secondary hover:text-accent-color uppercase tracking-wider flex items-center transition-colors">
             <Download size={14} className="mr-2" /> Export
           </button>
        </div>
      </div>
    </div>
  );
};
