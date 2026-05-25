"use client";

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Clock,
  ChevronRight,
} from 'lucide-react';

const PAIR_FLAGS = {
  'EURUSD': '🇪🇺🇺🇸',
  'GBPUSD': '🇬🇧🇺🇸',
  'USDJPY': '🇺🇸🇯🇵',
  'AUDUSD': '🇦🇺🇺🇸',
  'USDCAD': '🇺🇸🇨🇦',
  'NZDUSD': '🇳🇿🇺🇸',
  'USDCHF': '🇺🇸🇨🇭',
};

/**
 * --- TYPES ---
 */
interface BadgeProps {
  label: string;
  variant: 'bullish' | 'bearish' | 'neutral';
  icon: React.ReactNode;
}

interface MarketAnalysisCardProps {
  title: string;
  content: string;
  pair: 'EURUSD' | 'GBPUSD' | 'USDJPY' | 'AUDUSD' | 'USDCAD' | 'NZDUSD' | 'USDCHF';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  technicalLevel: number;
  createdAt: string;
}

/**
 * --- SUB-COMPONENTS ---
 */

const Badge = ({ label, variant, icon }: BadgeProps) => {
  const variants = {
    'bullish': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
    'bearish': 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
    'neutral': 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border uppercase transition-all ${variants[variant]}`}>
      {icon}
      {label}
    </span>
  );
};

const MarketAnalysisCard = ({ title, content, pair, sentiment, technicalLevel, createdAt }: MarketAnalysisCardProps) => {
  const sentimentConfig = {
    bullish: { icon: <TrendingUp className="w-3 h-3" />, color: 'emerald' },
    bearish: { icon: <TrendingDown className="w-3 h-3" />, color: 'rose' },
    neutral: { icon: <Target className="w-3 h-3" />, color: 'slate' },
  };

  const config = sentimentConfig[sentiment];
  const flag = PAIR_FLAGS[pair] || '💱';

  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
      {/* Dynamic Glow Background */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-${config.color}-500`} />
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl text-3xl shadow-inner border border-slate-100 dark:border-slate-700">
              {flag}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center bg-${config.color}-500 text-white`}>
              {config.icon}
            </div>
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight leading-none mb-1">{pair}</h3>
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
        <Badge label={sentiment} variant={sentiment} icon={config.icon} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3 mb-6">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h4>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
          {content}
        </p>
      </div>

      {/* Technical Strength Section */}
      <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 backdrop-blur-sm border border-slate-100 dark:border-slate-700/50">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal Strength</span>
          <span className={`text-xs font-black px-2 py-0.5 rounded-md bg-${config.color}-500 text-white`}>
            {technicalLevel}%
          </span>
        </div>
        <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-${config.color}-400 to-${config.color}-600`}
            style={{ width: `${technicalLevel}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <button className="group/btn w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all">
        View Full Analysis
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default MarketAnalysisCard;