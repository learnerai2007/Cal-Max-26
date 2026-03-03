import React from 'react';
import { Moon, Sun, Monitor, Shield, Bell, HelpCircle, ChevronRight, Palette } from 'lucide-react';
import { ThemeSettings } from '../types';

interface SettingsProps {
  theme?: ThemeSettings;
  onUpdateTheme?: (settings: Partial<ThemeSettings>) => void;
}

export function Settings({ theme, onUpdateTheme }: SettingsProps) {
  const currentTheme = theme?.mode || 'light';

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, color: 'bg-white border-gray-200' },
    { id: 'dark', label: 'Dark', icon: Moon, color: 'bg-slate-900 border-slate-700' },
    { id: 'midnight', label: 'Midnight', icon: Monitor, color: 'bg-black border-gray-800' },
  ];

  const sections = [
    {
      title: 'General',
      items: [
        { icon: Bell, label: 'Notifications', value: 'On' },
        { icon: Shield, label: 'Privacy & Security' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support' },
        { icon: Monitor, label: 'About Lumina' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bg-secondary pb-20 pt-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary mb-8">Manage your preferences and app settings.</p>

        {/* Theme Selection */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Palette size={20} className="text-accent-color" />
            Appearance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdateTheme?.({ mode: t.id as any })}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 group
                  ${currentTheme === t.id 
                    ? 'border-accent-color bg-accent-color/5 shadow-md' 
                    : 'border-border-color bg-bg-primary hover:border-accent-color/50'
                  }`}
              >
                <div className={`w-full h-24 rounded-xl ${t.color} shadow-inner mb-1 flex items-center justify-center`}>
                  <t.icon size={24} className={currentTheme === t.id ? 'text-accent-color' : 'text-text-tertiary'} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className={`font-medium ${currentTheme === t.id ? 'text-accent-color' : 'text-text-primary'}`}>
                    {t.label}
                  </span>
                  {currentTheme === t.id && (
                    <div className="w-2 h-2 rounded-full bg-accent-color shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Other Sections */}
        {sections.map((section, idx) => (
          <section key={idx} className="mb-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4">{section.title}</h2>
            <div className="bg-bg-primary rounded-2xl border border-border-color overflow-hidden shadow-sm">
              {section.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className={`w-full flex items-center justify-between p-4 hover:bg-bg-secondary transition-colors cursor-pointer
                    ${itemIdx !== section.items.length - 1 ? 'border-b border-border-color' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-bg-tertiary text-text-secondary">
                      <item.icon size={18} />
                    </div>
                    <span className="text-text-primary font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-tertiary">
                    {item.value && <span className="text-sm">{item.value}</span>}
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="text-center text-text-tertiary text-sm mt-12 pb-8">
          <p>Lumina Calc v1.0.0</p>
          <p className="mt-1">Designed with precision.</p>
        </div>
      </div>
    </div>
  );
}
