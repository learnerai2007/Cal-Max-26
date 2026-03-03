
import React from 'react';
import { X, Palette, Sun, Moon, Zap, Circle, Check, Sparkles } from 'lucide-react';
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
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full h-full md:w-[400px] md:h-auto md:max-h-[90vh] bg-bg-primary md:rounded-[2.5rem] border-l md:border border-border-color shadow-2xl flex flex-col overflow-hidden card-shadow"
      >
        {/* Header */}
        <div className="p-8 border-b border-border-color flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-accent/20">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-text-primary">Appearance</h3>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Personalize Lumina</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-xl hover:bg-bg-secondary">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
          {/* Theme Mode */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Base Theme</span>
              <Sparkles size={14} className="text-accent" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <ThemeButton 
                active={settings.mode === 'light'} 
                onClick={() => onUpdate({ mode: 'light' })}
                icon={<Sun size={20} />}
                label="Light"
              />
              <ThemeButton 
                active={settings.mode === 'dark'} 
                onClick={() => onUpdate({ mode: 'dark' })}
                icon={<Moon size={20} />}
                label="Dark"
              />
              <ThemeButton 
                active={settings.mode === 'midnight'} 
                onClick={() => onUpdate({ mode: 'midnight' })}
                icon={<Circle size={20} />}
                label="Midnight"
              />
            </div>
          </section>

          {/* Accent Color */}
          <section className="space-y-4">
             <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Accent Signature</span>
             <div className="grid grid-cols-6 gap-3">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => onUpdate({ accent: color.value })}
                    className={`aspect-square rounded-2xl transition-all flex items-center justify-center border-4 ${settings.accent === color.value ? 'border-accent/20 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color.value }}
                  >
                    {settings.accent === color.value && <Check size={18} className="text-white" />}
                  </button>
                ))}
             </div>
          </section>

          {/* Border Radius */}
          <section className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">UI Softness</span>
            <div className="flex bg-bg-secondary p-1.5 rounded-2xl border border-border-color">
              {(['none', 'small', 'medium', 'large'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => onUpdate({ radius: r })}
                  className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${settings.radius === r ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 bg-bg-secondary/50 border-t border-border-color flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 bg-accent text-white font-bold py-5 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:brightness-110 transition-all active:scale-95"
          >
            Save Appearance
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ThemeButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${active ? 'bg-accent/10 border-accent text-accent' : 'bg-bg-secondary border-border-color text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);
