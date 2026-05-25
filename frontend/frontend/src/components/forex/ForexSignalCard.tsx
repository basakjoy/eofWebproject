'use client';

import React, { useMemo, useState } from 'react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { 
  TrendingUp, TrendingDown, Heart, Copy, 
  ChevronDown, ChevronUp, ArrowUpRight, 
  ArrowDownLeft, Clock, ShieldCheck, 
  AlertCircle, Share2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, YAxis } from 'recharts';

interface ForexSignalCardProps {
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  target: number;
  stopLoss: number;
  analysis: string;
  timeframe: string;
  createdAt: string;
  confidence?: number; // New Detail: 0-100
  riskLevel?: 'Low' | 'Medium' | 'High'; // New Detail
}

export default function ForexSignalCard({
  pair,
  type,
  entry,
  target,
  stopLoss,
  analysis,
  timeframe,
  createdAt,
  confidence = 85,
  riskLevel = 'Medium'
}: ForexSignalCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = type === 'BUY';

  // Calculations
  const pips = Math.abs(target - entry);
  const riskReward = (Math.abs(target - entry) / Math.abs(entry - stopLoss)).toFixed(2);
  
  // Dynamic color palette
  const themeColor = isLong ? 'emerald' : 'rose';
  const chartColor = isLong ? '#10b981' : '#f43f5e';

  return (
    <Card className="group relative bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-2xl hover:shadow-emerald-500/10">
      
      {/* 1. Header: Pair & Status */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center font-bold text-xs shadow-sm">
               {pair.slice(0, 3)}
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center font-bold text-xs shadow-sm">
               {pair.slice(3, 6)}
             </div>
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {pair.slice(0, 3)} / {pair.slice(3, 6)}
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <Clock className="w-3 h-3" /> {timeframe} • {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button onClick={() => setIsSaved(!isSaved)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
           </button>
           <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Share2 className="w-5 h-5 text-slate-400" />
           </button>
        </div>
      </div>

      {/* 2. Main Signal & Visual Path */}
      <div className={`relative p-4 rounded-2xl mb-6 bg-gradient-to-br ${isLong ? 'from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/5' : 'from-rose-50 to-orange-50 dark:from-rose-500/10 dark:to-orange-500/5'}`}>
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${isLong ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
              Signal {type}
            </span>
            <div className="text-3xl font-black mt-1 text-slate-900 dark:text-white">
              {entry.toFixed(4)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Profit</p>
            <p className={`text-xl font-bold ${isLong ? 'text-emerald-600' : 'text-rose-600'}`}>
              +{pips.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Visual Progress Line */}
        <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mb-8">
           <div 
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-md ${isLong ? 'bg-emerald-500 left-[20%]' : 'bg-rose-500 right-[20%]'}`} 
           />
           <div className={`absolute top-full mt-2 text-[10px] font-bold text-slate-400 uppercase ${isLong ? 'left-0' : 'right-0'}`}>Stop Loss</div>
           <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase text-center">Entry</div>
           <div className={`absolute top-full mt-2 text-[10px] font-bold text-slate-400 uppercase ${isLong ? 'right-0' : 'left-0'}`}>Target</div>
        </div>
      </div>

      {/* 3. Detailed Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2 mb-1">
             <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
             <span className="text-[10px] font-bold text-slate-500 uppercase">Risk Reward</span>
           </div>
           <div className="text-sm font-bold text-slate-900 dark:text-white">1 : {riskReward}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2 mb-1">
             <AlertCircle className={`w-3.5 h-3.5 ${riskLevel === 'High' ? 'text-orange-500' : 'text-emerald-500'}`} />
             <span className="text-[10px] font-bold text-slate-500 uppercase">Risk Level</span>
           </div>
           <div className="text-sm font-bold text-slate-900 dark:text-white">{riskLevel}</div>
        </div>
      </div>

      {/* 4. Mini Chart / Analysis Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
            Analysis & Insights
          </h4>
          <div className="flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-bold text-emerald-600 uppercase">{confidence}% Confidence</span>
          </div>
        </div>
        
        <p className={`text-sm leading-relaxed text-slate-600 dark:text-slate-400 ${!isExpanded && 'line-clamp-2'}`}>
          {analysis}
        </p>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors border-t border-slate-100 dark:border-slate-800"
        >
          {isExpanded ? (
            <><ChevronUp className="w-4 h-4" /> Collapse Analysis</>
          ) : (
            <><ChevronDown className="w-4 h-4" /> Read Full Breakdown</>
          )}
        </button>
      </div>

      {/* 5. Action Footer */}
      <div className="mt-4 flex gap-2">
        <button className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${
          isLong 
          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
          : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
        }`}>
          Copy Parameters <Copy className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}