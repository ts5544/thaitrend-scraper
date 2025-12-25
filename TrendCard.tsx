import React from 'react';
import { TrendingItem } from '../types';

interface TrendCardProps {
  item: TrendingItem;
  delay: number;
}

const TrendCard: React.FC<TrendCardProps> = ({ item, delay }) => {
  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return "bg-red-600 text-white shadow-red-200";
      case 2: return "bg-orange-500 text-white shadow-orange-200";
      case 3: return "bg-amber-500 text-white shadow-amber-200";
      default: return "bg-slate-500 text-white";
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in flex flex-col h-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-lg ${getRankColor(item.rank)}`}>
            #{item.rank} Trending
          </span>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            {item.source}
          </span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3 break-words leading-tight">
          {item.keyword}
        </h3>
        
        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
          {item.context}
        </p>
      </div>
      
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-500">Analysis by AI</span>
        <button 
            className="text-indigo-600 text-xs font-semibold hover:text-indigo-800"
            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(item.keyword)}`, '_blank')}
        >
          Search Google &rarr;
        </button>
      </div>
    </div>
  );
};

export default TrendCard;