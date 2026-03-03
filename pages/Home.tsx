import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, TrendingUp, Activity, Clock, Star } from 'lucide-react';

export const Home = () => {
  return (
    <div className="p-6 pb-20 space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Hello there!</h1>
          <p className="text-white/90 mb-8 max-w-md text-lg leading-relaxed">
            Ready to solve some problems? Access your professional toolkit and recent calculations.
          </p>
          <div className="flex gap-3">
            <Link to="/tools" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg shadow-black/5 hover:bg-gray-50 hover:scale-105 transition-all duration-200">
              Explore Tools <ArrowRight size={18} />
            </Link>
            <Link to="/search" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200">
              Search
            </Link>
          </div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-border-color shadow-card hover:shadow-lg transition-shadow duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <div className="text-3xl font-bold text-text-primary mb-1">12</div>
          <div className="text-sm text-text-secondary font-medium">Total Calculations</div>
        </div>
        
        <div className="p-6 rounded-2xl bg-white border border-border-color shadow-card hover:shadow-lg transition-shadow duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Star size={24} />
          </div>
          <div className="text-3xl font-bold text-text-primary mb-1">5</div>
          <div className="text-sm text-text-secondary font-medium">Saved Favorites</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-border-color shadow-card hover:shadow-lg transition-shadow duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
          <div className="text-3xl font-bold text-text-primary mb-1">2m</div>
          <div className="text-sm text-text-secondary font-medium">Time Saved</div>
        </div>
      </div>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Activity size={20} className="text-accent-color" />
            Recent Activity
          </h3>
          <Link to="/history" className="text-sm font-semibold text-accent-color hover:text-accent-color-dark transition-colors">
            View History
          </Link>
        </div>
        
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-border-color shadow-sm hover:shadow-md hover:border-accent-color/30 transition-all cursor-pointer group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <Zap size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-text-primary group-hover:text-accent-color transition-colors">ROI Calculator</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-text-secondary">Finance</span>
                  <span className="text-xs text-text-tertiary">• Just now</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-accent-color/10 group-hover:text-accent-color transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
