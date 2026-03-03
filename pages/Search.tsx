import React, { useState } from 'react';
import { Search as SearchIcon, ArrowRight, Zap, Calculator } from 'lucide-react';
import { CALCULATORS } from '../services/calculatorEngine';
import { Link } from 'react-router-dom';

export const Search = () => {
  const [query, setQuery] = useState('');

  const results = query ? CALCULATORS.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.description.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <div className="p-6 pb-20 min-h-[80vh] max-w-3xl mx-auto animate-fade-in flex flex-col items-center justify-center">
      
      {!query && (
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-accent-color/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent-color transform rotate-3">
            <SearchIcon size={32} />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">What are you looking for?</h1>
          <p className="text-text-secondary">Search across {CALCULATORS.length}+ professional tools.</p>
        </div>
      )}

      <div className="w-full relative group mb-8">
        <div className="absolute inset-0 bg-accent-color/20 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-50 transition-opacity duration-500" />
        <div className="relative bg-white border-2 border-border-color rounded-2xl flex items-center px-6 py-4 shadow-lg shadow-black/5 focus-within:border-accent-color focus-within:ring-4 focus-within:ring-accent-color/10 transition-all">
          <SearchIcon className="text-text-tertiary mr-4 group-focus-within:text-accent-color transition-colors" size={24} />
          <input 
            autoFocus
            type="text" 
            placeholder="Type to search..." 
            className="flex-1 bg-transparent text-lg font-medium text-text-primary placeholder:text-text-tertiary focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        {results.map(calc => (
          <Link 
            key={calc.id} 
            to={`/tools/${calc.id}`}
            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border-color shadow-sm hover:shadow-md hover:border-accent-color/50 hover:-translate-y-0.5 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-text-secondary group-hover:bg-accent-color/10 group-hover:text-accent-color transition-colors">
              <Calculator size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-text-primary group-hover:text-accent-color transition-colors">{calc.name}</h4>
              <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{calc.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-text-secondary">{calc.category}</span>
              <ArrowRight className="text-text-tertiary group-hover:text-accent-color transition-colors" size={18} />
            </div>
          </Link>
        ))}
        
        {query && results.length === 0 && (
          <div className="text-center py-12 text-text-tertiary">
            <p className="text-lg font-medium mb-1">No results found</p>
            <p className="text-sm">Try searching for "finance", "health", or "math"</p>
          </div>
        )}
      </div>
    </div>
  );
};
