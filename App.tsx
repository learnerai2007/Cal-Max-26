
import React, { useState, useEffect, useCallback } from 'react';
import { MobileView } from './components/mobile/MobileView';
import { DesktopView } from './components/desktop/DesktopView';
import { CalculatorDef, CalculatorCategory, ThemeSettings, HistoryItem } from './types';
import { SettingsOverlay } from './components/SettingsOverlay';
import { CommandPalette } from './components/CommandPalette';
import { getCalculator } from './services/calculatorEngine';

const DEFAULT_THEME: ThemeSettings = {
  mode: 'dark',
  accent: '#6366f1',
  radius: 'medium',
  glassIntensity: 'medium',
};

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeCategory, setActiveCategory] = useState<CalculatorCategory | 'All'>('All');
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorDef | null>(null);
  const [mobileTab, setMobileTab] = useState<'home' | 'tools' | 'search' | 'history'>('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Persistence States
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('omni-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('omni-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('omni-theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync Persistence
  useEffect(() => { localStorage.setItem('omni-favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('omni-history', JSON.stringify(history)); }, [history]);

  // Deep Linking logic
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash) {
        const calc = getCalculator(hash);
        if (calc) {
          setSelectedCalculator(calc);
          return;
        }
      }
      setSelectedCalculator(null);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard Navigation Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync Theme
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('omni-theme', JSON.stringify(theme));
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--accent-color-dark', `${theme.accent}dd`);
    root.style.setProperty('--accent-glow', `${theme.accent}26`);
    root.classList.remove('dark', 'light');
    if (theme.mode === 'light') root.classList.add('light');
    else root.classList.add('dark');
    
    // Apply specialized theme colors
    if (theme.mode === 'midnight') {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#0a0a0a');
    } else if (theme.mode === 'glass') {
      root.style.setProperty('--bg-primary', '#020617');
      root.style.setProperty('--bg-secondary', 'rgba(15, 23, 42, 0.4)');
    }
  }, [theme]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  const clearHistory = () => setHistory([]);

  const handleCalculatorSelect = (calc: CalculatorDef | null) => {
    if (calc) {
      window.location.hash = `#/${calc.id}`;
    } else {
      window.location.hash = '';
    }
    setSelectedCalculator(calc);
    setIsCommandPaletteOpen(false);
  };

  const handleCategorySelect = (cat: CalculatorCategory | 'All') => {
    setActiveCategory(cat);
    handleCalculatorSelect(null);
  };

  return (
    <>
      {isMobile ? (
        <MobileView 
          activeTab={mobileTab} 
          onTabSelect={setMobileTab}
          selectedCalculator={selectedCalculator}
          onSelectCalculator={handleCalculatorSelect}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          onOpenSettings={() => setIsSettingsOpen(true)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          history={history}
          onAddToHistory={addToHistory}
          onClearHistory={clearHistory}
        />
      ) : (
        <DesktopView 
          selectedCalculator={selectedCalculator}
          onSelectCalculator={handleCalculatorSelect}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          onOpenSettings={() => setIsSettingsOpen(true)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          history={history}
          onAddToHistory={addToHistory}
        />
      )}

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelect={handleCalculatorSelect}
      />

      <SettingsOverlay 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={theme}
        onUpdate={(s) => setTheme(p => ({ ...p, ...s }))}
      />
    </>
  );
}

export default App;
