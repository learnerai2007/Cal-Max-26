import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  unit?: string;
}

export const TextField: React.FC<InputProps> = ({ label, error, unit, className = '', ...props }) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="block text-sm font-medium text-text-secondary ml-1">
      {label}
    </label>
    <div className="relative group">
      <input
        className="w-full bg-white border border-border-color rounded-xl px-4 py-3 text-base text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-color/20 focus:border-accent-color transition-all shadow-sm"
        {...props}
      />
      {unit && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-text-secondary">
          {unit}
        </div>
      )}
    </div>
    {error && <p className="text-xs font-medium text-rose-500 ml-1">{error}</p>}
  </div>
);

interface SliderProps extends InputProps {
  min: number;
  max: number;
  step?: number;
}

export const SliderField: React.FC<SliderProps> = ({ label, unit, min, max, value, onChange, ...props }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
        <div className="flex items-baseline gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-border-color">
          <span className="font-mono font-bold text-accent-color">{value}</span>
          <span className="text-xs text-text-tertiary">{unit}</span>
        </div>
      </div>
      <div className="relative h-6 flex items-center group">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-accent-color hover:accent-accent-color-dark focus:outline-none focus:ring-4 focus:ring-accent-color/10 transition-all"
          {...props}
        />
      </div>
      <div className="flex justify-between px-1">
        <span className="text-xs text-text-tertiary font-mono">{min}</span>
        <span className="text-xs text-text-tertiary font-mono">{max}</span>
      </div>
    </div>
  );
};
