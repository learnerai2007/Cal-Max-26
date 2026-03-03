
import React from 'react';
import { CalculatorDef, CalculatorInput } from '../types';
import { TextField, SliderField } from './ui/Input';

interface CalculatorFormProps {
  calculator: CalculatorDef;
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ calculator, values, onChange }) => {
  const renderInput = (input: CalculatorInput, index: number) => {
    const commonProps = {
      label: input.label,
      className: "animate-fade-up",
      style: { animationDelay: `${index * 0.05}s` }
    };

    switch (input.type) {
      case 'slider':
        return (
          <SliderField
            key={input.id}
            {...commonProps}
            min={input.min || 0}
            max={input.max || 100}
            step={input.step || 1}
            unit={input.unit}
            value={values[input.id] ?? input.defaultValue}
            onChange={(e) => onChange(input.id, Number(e.target.value))}
          />
        );
      case 'select':
        return (
          <div key={input.id} className={`space-y-1.5 ${commonProps.className}`} style={commonProps.style}>
            <label className="block text-sm font-medium text-text-secondary ml-1">
              {input.label}
            </label>
            <div className="relative">
              <select
                value={values[input.id] ?? input.defaultValue}
                onChange={(e) => onChange(input.id, e.target.value)}
                className="block w-full rounded-xl border border-border-color bg-white px-4 py-3 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-color/20 focus:border-accent-color transition-all shadow-sm appearance-none"
              >
                {input.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        );
      case 'date':
        return (
          <TextField
            key={input.id}
            {...commonProps}
            type="date"
            value={values[input.id] ?? input.defaultValue}
            onChange={(e) => onChange(input.id, e.target.value)}
          />
        );
      default:
        const isNumeric = input.type === 'number' || input.type === 'currency';
        return (
          <TextField
            key={input.id}
            {...commonProps}
            type={isNumeric ? 'number' : 'text'}
            unit={input.unit}
            value={values[input.id] ?? input.defaultValue}
            onChange={(e) => {
              const val = e.target.value;
              onChange(input.id, isNumeric ? (val === '' ? '' : Number(val)) : val);
            }}
            placeholder={input.description}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {calculator.inputs.map((input, idx) => renderInput(input, idx))}
      </div>
    </div>
  );
};
