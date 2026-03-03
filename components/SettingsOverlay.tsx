
import React from 'react';
import { X, Palette, Sun, Moon, Zap, Circle, Check, Sparkles, RotateCcw } from 'lucide-react';
import { ThemeSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ThemeSettings;
  onUpdate: (settings: Partial<ThemeSettings>) => void;
}

const ACCENT_COLORS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Cyan', value: '#06b6d4' },
];

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 35, stiffness: 350 }}
        className="relative w-full h-full md:w-[520px] md:h-[calc(100%-4rem)] bg-bg-primary md:rounded-[3.5rem] border-l md:border-2 border-border-color shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden high-depth matte-surface"
      >
        {/* Header */}
        <div className="p-12 border-b-2 border-border-color flex items-center justify-between shrink-0 bg-bg-primary/80 backdrop-blur-xl z-10 shiny">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-accent rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Palette size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tighter text-text-primary uppercase">System Config</h3>
              <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mt-1">Interface Customization</p>
            </div>
          </div>
          <button onClick={onClose} className="w-14 h-14 flex items-center justify-center text-text-secondary hover:text-text-primary transition-all rounded-2xl bg-bg-secondary/50 border border-border-color hover:border-accent/50 active:scale-90">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-12 space-y-16">
          {/* Theme Mode */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-text-secondary">01. Visual Mode</span>
              <div className="h-px flex-1 bg-border-color/30 mx-6" />
              <Sparkles size={16} className="text-accent" />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <ThemeButton 
                active={settings.mode === 'light'} 
                onClick={() => onUpdate({ mode: 'light' })}
                icon={<Sun size={28} />}
                label="Light"
              />
              <ThemeButton 
                active={settings.mode === 'dark'} 
                onClick={() => onUpdate({ mode: 'dark' })}
                icon={<Moon size={28} />}
                label="Dark"
              />
              <ThemeButton 
                active={settings.mode === 'midnight'} 
                onClick={() => onUpdate({ mode: 'midnight' })}
                icon={<Circle size={28} />}
                label="Midnight"
              />
            </div>
          </section>

          {/* Accent Color */}
          <section className="space-y-8">
             <div className="flex items-center justify-between px-2">
              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-text-secondary">02. Core Accent</span>
              <div className="h-px flex-1 bg-border-color/30 mx-6" />
             </div>
             <div className="grid grid-cols-6 gap-5">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => onUpdate({ accent: color.value })}
                    className={`aspect-square rounded-2xl transition-all flex items-center justify-center border-4 relative group ${settings.accent === color.value ? 'border-accent/40 scale-110 shadow-2xl' : 'border-transparent hover:scale-105 opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: color.value }}
                  >
                    {settings.accent === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                        <Check size={24} className="text-white drop-shadow-lg" />
                      </div>
                    )}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-text-secondary">
                      {color.name}
                    </div>
                  </button>
                ))}
             </div>
          </section>

          {/* Border Radius */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-text-secondary">03. UI Geometry</span>
              <div className="h-px flex-1 bg-border-color/30 mx-6" />
            </div>
            <div className="flex bg-bg-secondary/30 p-2.5 rounded-[2rem] border-2 border-border-color backdrop-blur-md shadow-inner">
              {(['none', 'small', 'medium', 'large'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => onUpdate({ radius: r })}
                  className={`flex-1 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all relative overflow-hidden ${settings.radius === r ? 'bg-accent text-white shadow-2xl shadow-accent/40' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}
                >
                  {r}
                  {settings.radius === r && (
                    <motion.div layoutId="radius-glow" className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-12 bg-bg-secondary/50 border-t-2 border-border-color flex gap-4 backdrop-blur-xl">
          <button 
            onClick={() => onUpdate({ mode: 'dark', accent: '#6366f1', radius: 'medium' })}
            className="w-20 h-20 flex items-center justify-center bg-bg-secondary border-2 border-border-color rounded-[1.5rem] text-text-secondary hover:text-rose-500 hover:border-rose-500/30 transition-all active:scale-90 shadow-inner"
            title="Reset to Factory Defaults"
          >
            <RotateCcw size={24} />
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-accent text-white font-black py-8 rounded-[2rem] text-sm uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(var(--accent-rgb),0.3)] hover:brightness-110 hover:scale-[1.02] transition-all active:scale-95 relative overflow-hidden group"
          >
            <span className="relative z-10">Commit Changes</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ThemeButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-2 ${active ? 'bg-accent/10 border-accent text-accent shadow-inner' : 'bg-bg-secondary border-border-color text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}`}
  >
    <div className={`transition-transform duration-500 ${active ? 'scale-110' : ''}`}>{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);
