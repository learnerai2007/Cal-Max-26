import React from 'react';
import { Home, Search, Clock, Box, Settings, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabSelect: (tab: 'home' | 'tools' | 'search' | 'history') => void;
  onOpenSettings: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabSelect, onOpenSettings }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'tools', icon: Box, label: 'Tools' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'history', icon: Clock, label: 'History' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-50">
      <div className="glass rounded-[2rem] p-2 flex items-center justify-between shadow-2xl card-shadow">
        <div className="flex items-center flex-1 justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabSelect(tab.id as any)}
                className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 ${
                  isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-accent/10 rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="w-px h-8 bg-border-color mx-2" />
        
        <button
          onClick={onOpenSettings}
          className="p-3 text-text-secondary hover:text-text-primary transition-colors rounded-2xl hover:bg-border-color"
        >
          <Settings size={22} />
        </button>
      </div>
    </nav>
  );
};
