
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Calendar, Cloud, FileText, Bell, CheckSquare, 
  Zap, Battery, Plus, Trash2, ChevronRight, Star, Search, Sparkles
} from 'lucide-react';
import { CalculatorDef, HistoryItem } from '../types';
import { CALCULATORS } from '../services/calculatorEngine';
import { motion } from 'motion/react';

interface DashboardHomeProps {
  onSelectCalculator: (calc: CalculatorDef) => void;
  favorites?: string[];
  history?: HistoryItem[];
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ 
  onSelectCalculator,
  favorites = [],
  history = []
}) => {
  const [time, setTime] = useState(new Date());
  const [notepad, setNotepad] = useState(localStorage.getItem('omni-note') || '');
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>(
    JSON.parse(localStorage.getItem('omni-todos') || '[]')
  );

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => { localStorage.setItem('omni-note', notepad); }, [notepad]);
  useEffect(() => { localStorage.setItem('omni-todos', JSON.stringify(todos)); }, [todos]);

  const favoriteTools = useMemo(() => CALCULATORS.filter(c => favorites.includes(c.id)), [favorites]);
  const recentCalculators = useMemo(() => {
    return history
      .map(h => CALCULATORS.find(c => c.id === h.calculatorId))
      .filter((c, i, self) => c && self.findIndex(t => t?.id === c.id) === i)
      .slice(0, 4);
  }, [history]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-12 animate-fade-up pb-40">
      {/* Welcome Section */}
      <section className="space-y-4 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start space-x-2 text-accent font-bold tracking-tight">
          <Sparkles size={18} />
          <span>Welcome back</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary leading-tight">
          What would you like to <br />
          <span className="text-accent">calculate</span> today?
        </h1>
        
        {/* Prominent Search Trigger */}
        <div className="pt-6 max-w-2xl mx-auto md:mx-0">
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="w-full glass rounded-3xl p-4 md:p-6 flex items-center space-x-4 text-text-secondary hover:text-text-primary transition-all group card-shadow"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
              <Search size={24} />
            </div>
            <span className="text-lg md:text-xl font-medium">Search for any tool or formula...</span>
            <div className="hidden md:flex ml-auto items-center space-x-2 px-3 py-1.5 bg-border-color rounded-xl text-xs font-bold">
              <span>⌘</span>
              <span>K</span>
            </div>
          </button>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Clock className="text-accent" />} 
          value={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
          label="Current Time" 
        />
        <StatCard 
          icon={<Calendar className="text-rose-500" />} 
          value={time.toLocaleDateString([], { month: 'short', day: 'numeric' })} 
          label="Today" 
        />
        <StatCard 
          icon={<Cloud className="text-sky-500" />} 
          value="24°C" 
          label="Local Weather" 
        />
        <StatCard 
          icon={<Battery className="text-emerald-500" />} 
          value="82%" 
          label="System Status" 
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Favorites & Recents */}
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Star size={20} className="text-amber-500" fill="currentColor" />
              Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteTools.length > 0 ? favoriteTools.slice(0, 4).map(c => (
                <ToolCard key={c.id} tool={c} onClick={() => onSelectCalculator(c)} />
              )) : (
                <div className="col-span-full p-8 glass rounded-3xl border-dashed border-2 border-border-color text-center text-text-secondary">
                  No favorites yet. Star a tool to see it here.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-accent" />
              Recently Used
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentCalculators.length > 0 ? recentCalculators.map(c => c && (
                <ToolCard key={c.id} tool={c} onClick={() => onSelectCalculator(c)} />
              )) : (
                <div className="col-span-full p-8 glass rounded-3xl border-dashed border-2 border-border-color text-center text-text-secondary">
                  Your recent calculations will appear here.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <div className="glass rounded-3xl p-6 space-y-4 flex flex-col h-[300px] card-shadow">
            <h3 className="font-bold flex items-center gap-2 text-text-secondary">
              <FileText size={18} />
              Quick Notes
            </h3>
            <textarea 
              className="flex-1 bg-transparent border-none resize-none text-sm font-medium text-text-primary placeholder:text-text-secondary/50 focus:ring-0 no-scrollbar leading-relaxed"
              placeholder="Jot down some thoughts..."
              value={notepad}
              onChange={(e) => setNotepad(e.target.value)}
            />
          </div>

          <div className="glass rounded-3xl p-6 space-y-4 card-shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2 text-text-secondary">
                <CheckSquare size={18} />
                Tasks
              </h3>
              <button 
                onClick={() => {
                  const text = prompt('New task:');
                  if (text) setTodos([{ id: Date.now(), text, done: false }, ...todos]);
                }}
                className="w-8 h-8 bg-accent/10 text-accent rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-3 max-h-[200px] overflow-y-auto no-scrollbar">
              {todos.map(todo => (
                <div key={todo.id} className="flex items-center justify-between group">
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    <div className={`w-5 h-5 rounded-lg border-2 transition-all ${todo.done ? 'bg-accent border-accent' : 'border-border-color group-hover:border-accent/50'}`}>
                      {todo.done && <Plus size={14} className="text-white rotate-45" />}
                    </div>
                    <span className={`text-sm font-medium transition-all ${todo.done ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button 
                    onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                    className="text-text-secondary hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label }: any) => (
  <div className="glass rounded-3xl p-4 flex flex-col items-center justify-center space-y-1 card-shadow">
    <div className="p-2 bg-border-color rounded-xl mb-1">{icon}</div>
    <div className="text-xl font-bold text-text-primary">{value}</div>
    <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">{label}</span>
  </div>
);

const ToolCard: React.FC<{ tool: CalculatorDef, onClick: () => void }> = ({ tool, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center p-4 glass rounded-2xl hover:border-accent/50 transition-all group card-shadow text-left"
  >
    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all mr-4">
      <Zap size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-bold text-text-primary truncate">{tool.name}</div>
      <div className="text-[10px] text-text-secondary uppercase tracking-wider">{tool.category}</div>
    </div>
    <ChevronRight size={16} className="text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
  </button>
);
