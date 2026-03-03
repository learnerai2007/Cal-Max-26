
import React from 'react';
import { X, Palette, Sun, Moon, Zap, Layers, Circle, Check } from 'lucide-react';
import { ThemeSettings } from '../types';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ThemeSettings;
  onUpdate: (settings: Partial<ThemeSettings>) => void;
}

const ACCENT_COLORS = [
  { name: 'Indigo', value: '#6366f1', dark: '#4f46e5' },
  { name: 'Rose', value: '#f43f5e', dark: '#e11d48' },
  { name: 'Emerald', value: '#10b981', dark: '#059669' },
  { name: 'Amber', value: '#f59e0b', dark: '#d97706' },
  { name: 'Violet', value: '#8b5cf6', dark: '#7c3aed' },
  { name: 'Cyan', value: '#06b6d4', dark: '#0891b2' },
];

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end md:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full h-full md:w-[420px] md:h-auto md:max-h-[90vh] bg-slate-950 md:rounded-[2.5rem] border-l md:border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <Palette size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Appearance</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Personalize your Workspace</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
          {/* Theme Mode */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Base Theme</span>
              <Zap size={14} className="text-accent" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ThemeButton 
                active={settings.mode === 'light'} 
                onClick={() => onUpdate({ mode: 'light' })}
                icon={<Sun size={18} />}
                label="Daylight"
              />
              <ThemeButton 
                active={settings.mode === 'dark'} 
                onClick={() => onUpdate({ mode: 'dark' })}
                icon={<Moon size={18} />}
                label="Deep Night"
              />
              <ThemeButton 
                active={settings.mode === 'midnight'} 
                onClick={() => onUpdate({ mode: 'midnight' })}
                icon={<Circle size={18} />}
                label="Midnight"
              />
              <ThemeButton 
                active={settings.mode === 'glass'} 
                onClick={() => onUpdate({ mode: 'glass' })}
                icon={<Layers size={18} />}
                label="Aero Glass"
              />
            </div>
          </section>

          {/* Accent Color */}
          <section className="space-y-4">
             <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Accent Signature</span>
             <div className="grid grid-cols-6 gap-3">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => onUpdate({ accent: color.value })}
                    className={`aspect-square rounded-full transition-all flex items-center justify-center border-4 ${settings.accent === color.value ? 'border-white/20 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color.value }}
                  >
                    {settings.accent === color.value && <Check size={14} className="text-white" />}
                  </button>
                ))}
             </div>
          </section>

          {/* Border Radius */}
          <section className="space-y-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">UI Softness</span>
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              {(['none', 'small', 'medium', 'large'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => onUpdate({ radius: r })}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${settings.radius === r ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </section>

          {/* Glass Intensity */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Transparency</span>
              <span className="text-[10px] font-bold text-accent uppercase">{settings.glassIntensity}</span>
            </div>
            <input 
              type="range"
              min="0"
              max="3"
              step="1"
              value={['none', 'low', 'medium', 'high'].indexOf(settings.glassIntensity)}
              onChange={(e) => onUpdate({ glassIntensity: ['none', 'low', 'medium', 'high'][parseInt(e.target.value)] as any })}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-accent"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-accent text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:brightness-110 transition-all active:scale-95"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ThemeButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${active ? 'bg-accent/10 border-accent text-accent' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'}`}
  >
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);
