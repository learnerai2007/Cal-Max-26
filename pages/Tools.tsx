import React, { useState } from 'react';
import { Search, ChevronRight, Calculator, Cpu, TrendingUp, Activity, Settings, Filter } from 'lucide-react';
import { CALCULATORS } from '../services/calculatorEngine';
import { Link } from 'react-router-dom';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Finance': <TrendingUp size={20} className="text-emerald-500" />,
  'Health': <Activity size={20} className="text-rose-500" />,
  'Math': <Calculator size={20} className="text-indigo-500" />,
  'Engineering': <Cpu size={20} className="text-amber-500" />,
  'Utility': <Settings size={20} className="text-slate-500" />,
};

export const Tools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCalculators = CALCULATORS.filter(calc => {
    const matchesSearch = calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? calc.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const allCategories = Array.from(new Set(CALCULATORS.map(c => c.category))).sort();
  const displayedCategories = Array.from(new Set(filteredCalculators.map(c => c.category))).sort();

  return (
    <div className="p-6 pb-20 space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Tools & Calculators</h1>
        
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-text-tertiary group-focus-within:text-accent-color transition-colors" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="What do you want to calculate?" 
            className="w-full bg-white border border-border-color rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-tertiary shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-color/20 focus:border-accent-color transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${!selectedCategory 
                ? 'bg-text-primary text-white shadow-md' 
                : 'bg-white border border-border-color text-text-secondary hover:bg-gray-50'}`}
          >
            All Tools
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2
                ${selectedCategory === cat 
                  ? 'bg-accent-color text-white shadow-md' 
                  : 'bg-white border border-border-color text-text-secondary hover:bg-gray-50'}`}
            >
              {CATEGORY_ICONS[cat]}
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {displayedCategories.map(category => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              {CATEGORY_ICONS[category]}
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCalculators.filter(c => c.category === category).map(calc => (
                <Link 
                  key={calc.id}
                  to={`/tools/${calc.id}`}
                  className="flex flex-col p-5 rounded-2xl bg-white border border-border-color shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-text-secondary group-hover:bg-accent-color/10 group-hover:text-accent-color transition-colors">
                      <Calculator size={24} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-gray-300 group-hover:text-accent-color transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-text-primary text-lg mb-1 group-hover:text-accent-color transition-colors">{calc.name}</h4>
                  <p className="text-sm text-text-secondary line-clamp-2">{calc.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredCalculators.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">No tools found</h3>
          <p className="text-text-secondary">Try searching for something else or browse categories.</p>
        </div>
      )}
    </div>
  );
};
