import React from 'react';
import { Home, Search, Clock, Box, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';

interface BottomNavProps {
  onOpenSettings: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenSettings }) => {
  const tabs = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'tools', path: '/tools', icon: Box, label: 'Tools' },
    { id: 'search', path: '/search', icon: Search, label: 'Search' },
    { id: 'history', path: '/history', icon: Clock, label: 'History' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <div className="glass-heavy rounded-[2.5rem] p-2 flex items-center justify-between high-depth border border-border-color/50 shiny matte-surface shadow-2xl backdrop-blur-3xl bg-bg-secondary/80">
        <div className="flex items-center flex-1 justify-around px-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center py-3 px-4 rounded-[2rem] transition-all duration-300
                ${isActive ? 'text-accent-color scale-105' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-accent-color/10 rounded-[2rem] shadow-inner"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10 transition-all" />
                  <span className={`text-[9px] font-bold mt-1 uppercase tracking-wider transition-all relative z-10 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 h-0 overflow-hidden translate-y-2'}`}>
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
        
        <div className="w-px h-8 bg-border-color/30 mx-2" />
        
        <button
          onClick={onOpenSettings}
          className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-accent-color transition-all rounded-[1.5rem] hover:bg-accent-color/10 active:scale-90"
        >
          <Settings size={22} />
        </button>
      </div>
    </nav>
  );
};
