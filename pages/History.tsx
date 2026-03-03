import React from 'react';
import { Clock, Trash2, Calendar, ArrowRight } from 'lucide-react';
import { HistoryItem } from '../types';
import { Link } from 'react-router-dom';

export const History = () => {
  const [history, setHistory] = React.useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni-history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('omni-history');
  };

  return (
    <div className="p-6 pb-20 space-y-8 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">History</h1>
            <p className="text-sm text-text-secondary">Your recent calculations</p>
          </div>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100 transition-colors"
          >
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <Clock size={40} />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No history yet</h3>
          <p className="text-text-secondary max-w-xs mx-auto mb-8">
            Calculations you perform will appear here for easy access.
          </p>
          <Link to="/tools" className="inline-flex items-center gap-2 bg-accent-color text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-accent-color/20 hover:bg-accent-color-dark transition-all">
            Start Calculating <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="p-6 rounded-2xl bg-white border border-border-color shadow-card hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-bold text-text-primary group-hover:text-accent-color transition-colors">{item.calculatorName}</h4>
                <div className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary bg-gray-50 px-2.5 py-1 rounded-lg">
                  <Calendar size={12} />
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
              
              <div className="space-y-3">
                {item.results.map((res, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-text-secondary font-medium">{res.label}</span>
                    <span className="font-mono font-bold text-text-primary bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {res.value} <span className="text-text-tertiary">{res.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
