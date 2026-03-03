
import React from 'react';
import { Home, Box, Search, Clock, Zap, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MobileDashboard } from './MobileDashboard';
import { MobileTools } from './MobileTools';
import { MobileSearch } from './MobileSearch';
import { MobileHistory } from './MobileHistory';
import { MobileWorkspace } from './MobileWorkspace';
import { CalculatorDef, CalculatorCategory, HistoryItem } from '../../types';

interface MobileViewProps {
  activeTab: 'home' | 'tools' | 'search' | 'history';
  onTabSelect: (tab: any) => void;
  selectedCalculator: CalculatorDef | null;
  onSelectCalculator: (calc: CalculatorDef | null) => void;
  activeCategory: CalculatorCategory | 'All';
  onSelectCategory: (cat: any) => void;
  onOpenSettings: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  history: HistoryItem[];
  onAddToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  onClearHistory: () => void;
}

export const MobileView: React.FC<MobileViewProps> = ({
  activeTab,
  onTabSelect,
  selectedCalculator,
  onSelectCalculator,
  activeCategory,
  onSelectCategory,
  onOpenSettings,
  favorites,
  onToggleFavorite,
  history,
  onAddToHistory,
  onClearHistory
}) => {
  if (selectedCalculator) {
    return (
      <MobileWorkspace 
        calculator={selectedCalculator} 
        onBack={() => onSelectCalculator(null)} 
        isFavorite={favorites.includes(selectedCalculator.id)}
        onToggleFavorite={() => onToggleFavorite(selectedCalculator.id)}
        onAddToHistory={onAddToHistory}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-primary">
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'home' && (
              <MobileDashboard 
                onSelect={onSelectCalculator} 
                favorites={favorites}
                history={history}
              />
            )}
            {activeTab === 'tools' && (
              <MobileTools 
                onSelectCalculator={onSelectCalculator} 
                favorites={favorites}
              />
            )}
            {activeTab === 'search' && <MobileSearch onSelectCalculator={onSelectCalculator} />}
            {activeTab === 'history' && (
              <MobileHistory 
                history={history} 
                onSelectCalculator={onSelectCalculator} 
                onClearHistory={onClearHistory}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const TabButton = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center py-2.5 rounded-[2rem] transition-all relative ${active ? 'text-accent bg-white/5' : 'text-slate-500'}`}
  >
    {icon}
    <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">{label}</span>
    {active && (
      <div className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full" />
    )}
  </button>
);
