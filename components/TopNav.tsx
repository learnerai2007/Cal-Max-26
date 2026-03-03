import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Search, History, Settings, Zap } from 'lucide-react';

export function TopNav() {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'tools', icon: Grid, label: 'Tools', path: '/tools' },
    { id: 'search', icon: Search, label: 'Search', path: '/search' },
    { id: 'history', icon: History, label: 'History', path: '/history' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-bg-primary/80 backdrop-blur-md border-b border-border-color transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-color to-accent-color-dark flex items-center justify-center text-white shadow-lg shadow-accent-color/30 group-hover:scale-105 transition-transform duration-200">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-text-primary group-hover:text-accent-color transition-colors">
              Lumina
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                   ${isActive 
                     ? 'bg-accent-color/10 text-accent-color shadow-sm' 
                     : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                   }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button - Hidden for now, using horizontal scroll below */}
          <div className="md:hidden"></div>
        </div>
      </div>
      
      {/* Mobile Navigation (Horizontal Scroll) */}
      <div className="md:hidden border-t border-border-color overflow-x-auto no-scrollbar bg-bg-secondary/50">
        <div className="flex items-center justify-around px-2 py-2 min-w-max w-full">
           {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 min-w-[70px]
                   ${isActive 
                     ? 'text-accent-color bg-white shadow-sm' 
                     : 'text-text-secondary hover:bg-white/50'
                   }`
                }
              >
                <item.icon size={20} className="mb-0.5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
        </div>
      </div>
    </header>
  );
}
