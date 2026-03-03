
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { TopNav } from './components/TopNav';
import { CommandPalette } from './components/CommandPalette';
import { ThemeSettings, HistoryItem, CalculatorDef } from './types';
import { Home } from './pages/Home';
import { Tools } from './pages/Tools';
import { Search } from './pages/Search';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { CalculatorPage } from './pages/CalculatorPage';

const DEFAULT_THEME: ThemeSettings = {
  mode: 'light',
  accent: '#6366f1',
  radius: 'medium',
  glassIntensity: 'medium',
};

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
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

  // Sync Persistence
  useEffect(() => { localStorage.setItem('omni-favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('omni-history', JSON.stringify(history)); }, [history]);

  // Keyboard Navigation Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync Theme
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('omni-theme', JSON.stringify(theme));
    
    root.classList.remove('dark', 'light', 'midnight');
    root.classList.add(theme.mode);
    
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--accent-color-dark', `${theme.accent}dd`);
    root.style.setProperty('--accent-glow', `${theme.accent}26`);
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

  const handleCalculatorSelect = (calc: CalculatorDef | null) => {
    if (calc) {
      navigate(`/tools/${calc.id}`);
    }
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-bg-primary text-text-primary transition-colors duration-500">
      {/* Background Mesh */}
      <div className="bg-mesh animate-mesh fixed inset-0 z-[-1]" />
      
      <TopNav />

      <main className="flex-1 w-full max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:id" element={
            <CalculatorPage 
              favorites={favorites} 
              onToggleFavorite={toggleFavorite} 
              onAddToHistory={addToHistory} 
            />
          } />
          <Route path="/search" element={<Search />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={
            <Settings 
              theme={theme} 
              onUpdateTheme={(s) => setTheme(p => ({ ...p, ...s }))} 
            />
          } />
        </Routes>
      </main>

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelect={handleCalculatorSelect}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
