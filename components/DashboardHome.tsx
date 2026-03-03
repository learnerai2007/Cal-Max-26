
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
    <div className="max-w-6xl mx-auto p-8 md:p-16 space-y-16 animate-fade-up pb-48">
      {/* Welcome Section */}
      <section className="space-y-6 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start space-x-3 text-accent font-black uppercase tracking-[0.3em] text-[10px]">
          <Sparkles size={16} className="animate-pulse-subtle" />
          <span>Lumina Intelligence</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text-primary leading-[0.9] md:leading-[0.85]">
          Precision <br />
          <span className="text-accent">Computation.</span>
        </h1>
        
        {/* Prominent Search Trigger */}
        <div className="pt-10 max-w-2xl mx-auto md:mx-0">
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="w-full glass rounded-[2.5rem] p-6 md:p-8 flex items-center space-x-6 text-text-secondary hover:text-text-primary transition-all group high-depth matte-surface"
          >
            <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
              <Search size={32} />
            </div>
            <div className="text-left">
              <span className="text-xl md:text-2xl font-bold tracking-tight block">Search Toolkits</span>
              <span className="text-xs font-medium opacity-50">Find any formula or specialized engine</span>
            </div>
            <div className="hidden md:flex ml-auto items-center space-x-3 px-4 py-2 bg-bg-secondary rounded-2xl text-[10px] font-black border border-border-color shadow-sm">
              <span>⌘</span>
              <span>K</span>
            </div>
          </button>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Favorites & Recents */}
        <div className="md:col-span-2 space-y-12">
          <div className="space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-secondary px-2 flex items-center gap-3">
              <Star size={14} className="text-amber-500" fill="currentColor" />
              Pinned Toolkits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favoriteTools.length > 0 ? favoriteTools.slice(0, 4).map(c => (
                <ToolCard key={c.id} tool={c} onClick={() => onSelectCalculator(c)} />
              )) : (
                <div className="col-span-full p-12 glass rounded-[2.5rem] border-dashed border-2 border-border-color/30 text-center text-text-secondary matte-surface">
                  <p className="text-sm font-medium">No favorites yet.</p>
                  <p className="text-[10px] uppercase tracking-widest mt-2 opacity-50">Star a tool to see it here</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-secondary px-2 flex items-center gap-3">
              <Clock size={14} className="text-accent" />
              Recent Activity
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentCalculators.length > 0 ? recentCalculators.map(c => c && (
                <ToolCard key={c.id} tool={c} onClick={() => onSelectCalculator(c)} />
              )) : (
                <div className="col-span-full p-12 glass rounded-[2.5rem] border-dashed border-2 border-border-color/30 text-center text-text-secondary matte-surface">
                  <p className="text-sm font-medium">No recent calculations.</p>
                  <p className="text-[10px] uppercase tracking-widest mt-2 opacity-50">Your history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-10">
          <div className="glass rounded-[2.5rem] p-8 space-y-6 flex flex-col h-[350px] matte-surface high-depth">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary flex items-center gap-3">
              <FileText size={14} />
              Quick Notes
            </h3>
            <textarea 
              className="flex-1 bg-transparent border-none resize-none text-base font-medium text-text-primary placeholder:text-text-secondary/30 focus:ring-0 no-scrollbar leading-relaxed"
              placeholder="Jot down some thoughts..."
              value={notepad}
              onChange={(e) => setNotepad(e.target.value)}
            />
          </div>

          <div className="glass rounded-[2.5rem] p-8 space-y-6 matte-surface high-depth">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary flex items-center gap-3">
                <CheckSquare size={14} />
                Task List
              </h3>
              <button 
                onClick={() => {
                  const text = prompt('New task:');
                  if (text) setTodos([{ id: Date.now(), text, done: false }, ...todos]);
                }}
                className="w-10 h-10 bg-accent/10 text-accent rounded-2xl flex items-center justify-center hover:bg-accent hover:text-white transition-all active:scale-90"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-[250px] overflow-y-auto no-scrollbar">
              {todos.map(todo => (
                <div key={todo.id} className="flex items-center justify-between group">
                  <div 
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    <div className={`w-6 h-6 rounded-xl border-2 transition-all flex items-center justify-center ${todo.done ? 'bg-accent border-accent' : 'border-border-color group-hover:border-accent/50'}`}>
                      {todo.done && <Plus size={16} className="text-white rotate-45" />}
                    </div>
                    <span className={`text-sm font-bold transition-all tracking-tight ${todo.done ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button 
                    onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                    className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
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
  <div className="glass rounded-[2rem] p-6 flex flex-col items-center justify-center space-y-2 matte-surface high-depth border border-border-color/30">
    <div className="p-3 bg-bg-secondary rounded-2xl mb-2 shadow-inner text-accent">{icon}</div>
    <div className="text-2xl font-black text-text-primary tracking-tighter">{value}</div>
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">{label}</span>
  </div>
);

const ToolCard: React.FC<{ tool: CalculatorDef, onClick: () => void }> = ({ tool, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center p-6 glass rounded-[2rem] hover:border-accent/50 transition-all group matte-surface high-depth text-left border border-border-color/30 active:scale-[0.98]"
  >
    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all mr-5 shadow-inner">
      <Zap size={24} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-base font-bold text-text-primary truncate tracking-tight">{tool.name}</div>
      <div className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mt-0.5">{tool.category}</div>
    </div>
    <div className="w-8 h-8 flex items-center justify-center text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all">
      <ChevronRight size={20} />
    </div>
  </button>
);
