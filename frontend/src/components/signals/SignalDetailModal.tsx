'use client';

import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  Target, 
  ShieldAlert, 
  Copy, 
  Check, 
  Clock, 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Calculator,
  BarChart2,
  Info
} from 'lucide-react';
import { SignalRecord } from '@/lib/signalsApi';

interface SignalDetailModalProps {
  signal: SignalRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCalculator?: (signal: SignalRecord) => void;
}

export default function SignalDetailModal({
  signal,
  isOpen,
  onClose,
  onOpenCalculator
}: SignalDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<'bullish' | 'bearish' | null>(null);
  const [bullishVotes, setBullishVotes] = useState(86);
  const [bearishVotes, setBearishVotes] = useState(14);

  if (!isOpen || !signal) return null;

  const isBuy = signal.type?.toUpperCase() === 'BUY';
  const entry = Number(signal.entryPrice || 0);
  const sl = Number(signal.stopLoss || signal.stoploss || 0);
  const tp1 = Number(signal.takeProfit1 || signal.takeProfit || 0);
  const tp2 = Number(signal.takeProfit2 || (tp1 ? tp1 * (isBuy ? 1.01 : 0.99) : 0));
  const tp3 = Number(signal.takeProfit3 || (tp1 ? tp1 * (isBuy ? 1.02 : 0.98) : 0));

  // Risk Reward Ratio calculation
  const riskPips = Math.abs(entry - sl);
  const rewardPips = Math.abs(tp1 - entry);
  const rrRatio = riskPips > 0 ? (rewardPips / riskPips).toFixed(2) : '1:3.0';

  const handleCopyAll = () => {
    const text = `🎯 TRADING SIGNAL: ${signal.pair} (${signal.type?.toUpperCase()})\n` +
      `📌 Timeframe: ${signal.timeframe || '4H'}\n` +
      `🟢 Entry: ${entry}\n` +
      `🔴 Stop Loss: ${sl}\n` +
      `🎯 TP1: ${tp1}\n` +
      (tp2 ? `🎯 TP2: ${tp2.toFixed(4)}\n` : '') +
      (tp3 ? `🎯 TP3: ${tp3.toFixed(4)}\n` : '') +
      `⚡ Reliability: ${signal.accuracy || 88}%\n` +
      `Powered by EOF Forex Signals`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyField = (val: string | number, name: string) => {
    navigator.clipboard.writeText(String(val));
    setCopiedField(name);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleVote = (type: 'bullish' | 'bearish') => {
    if (userVote === type) return;
    if (type === 'bullish') {
      setBullishVotes((v) => v + 1);
      if (userVote === 'bearish') setBearishVotes((v) => Math.max(0, v - 1));
    } else {
      setBearishVotes((v) => v + 1);
      if (userVote === 'bullish') setBullishVotes((v) => Math.max(0, v - 1));
    }
    setUserVote(type);
  };

  const totalVotes = bullishVotes + bearishVotes;
  const bullPercent = Math.round((bullishVotes / totalVotes) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeInUp">
      <div 
        className="relative w-full max-w-2xl bg-[#09090D] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background behind header */}
        <div 
          className={`absolute top-0 left-0 right-0 h-44 opacity-20 pointer-events-none blur-3xl ${
            isBuy ? 'bg-emerald-500' : 'bg-rose-500'
          }`} 
        />

        {/* Modal Top Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isBuy 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {isBuy ? <ArrowUpRight className="w-6 h-6 stroke-[2.5]" /> : <ArrowDownRight className="w-6 h-6 stroke-[2.5]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight">{signal.pair}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  isBuy ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'
                }`}>
                  {signal.type?.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-fiery-orange" />
                <span>Timeframe: <strong className="text-white">{signal.timeframe || '4H'}</strong></span>
                <span>•</span>
                <span>Accuracy: <strong className="text-emerald-400">{signal.accuracy || 88}%</strong></span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Status</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-fiery-orange/15 text-fiery-amber text-xs font-bold border border-fiery-orange/30">
                <span className="w-1.5 h-1.5 rounded-full bg-fiery-orange animate-pulse" />
                {signal.status || 'Active'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Risk : Reward</span>
              <span className="text-sm font-black text-fiery-amber">1 : {rrRatio}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Reliability</span>
              <span className="text-sm font-black text-emerald-400">{signal.accuracy || 88}%</span>
            </div>
          </div>

          {/* Interactive Price Ladder Visualizer */}
          <div className="space-y-3 bg-card-dark/80 p-5 rounded-2xl border border-white/10">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-fiery-orange" />
              Target Price Execution Ladder
            </h3>

            <div className="space-y-2.5 pt-2">
              
              {/* Take Profit 3 */}
              {tp3 > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-extrabold text-emerald-400">Take Profit 3 (Final Target)</span>
                      <span className="text-[10px] text-emerald-500/80 block font-mono">Max Expansion Goal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-emerald-400">{tp3.toFixed(4)}</span>
                    <button 
                      onClick={() => handleCopyField(tp3.toFixed(4), 'TP3')} 
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                      title="Copy TP3"
                    >
                      {copiedField === 'TP3' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Take Profit 2 */}
              {tp2 > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-extrabold text-emerald-400">Take Profit 2</span>
                      <span className="text-[10px] text-emerald-500/80 block font-mono">Secondary Objective</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-emerald-400">{tp2.toFixed(4)}</span>
                    <button 
                      onClick={() => handleCopyField(tp2.toFixed(4), 'TP2')} 
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                      title="Copy TP2"
                    >
                      {copiedField === 'TP2' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Take Profit 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 group hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-extrabold text-emerald-400">Take Profit 1</span>
                    <span className="text-[10px] text-emerald-500/80 block font-mono">Primary Target (1:1.5)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-emerald-400">{tp1 || '—'}</span>
                  <button 
                    onClick={() => handleCopyField(tp1, 'TP1')} 
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                    title="Copy TP1"
                  >
                    {copiedField === 'TP1' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Entry Zone */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-fiery-orange/15 border border-fiery-orange/30 group hover:border-fiery-orange/50 transition-colors shadow-fiery/10">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-fiery-orange" />
                  <div>
                    <span className="text-xs font-extrabold text-white">Entry Price</span>
                    <span className="text-[10px] text-fiery-amber block font-mono">Execution Trigger Level</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-base text-fiery-amber">{entry || '—'}</span>
                  <button 
                    onClick={() => handleCopyField(entry, 'Entry')} 
                    className="p-1.5 rounded-lg bg-fiery-orange/20 hover:bg-fiery-orange/30 text-fiery-amber transition-colors"
                    title="Copy Entry Price"
                  >
                    {copiedField === 'Entry' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Stop Loss */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 group hover:border-rose-500/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <div>
                    <span className="text-xs font-extrabold text-rose-400">Stop Loss</span>
                    <span className="text-[10px] text-rose-400/80 block font-mono">Invalidation Level</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-rose-400">{sl || '—'}</span>
                  <button 
                    onClick={() => handleCopyField(sl, 'SL')} 
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Copy Stop Loss"
                  >
                    {copiedField === 'SL' ? <Check className="w-3.5 h-3.5 text-rose-300" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Technical Rationale / Smart Money Analysis */}
          <div className="bg-panel-dark p-5 rounded-2xl border border-white/5 space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fiery-amber" />
              Institutional Setup Analysis
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              High-probability setup based on multi-timeframe order block rejection and liquidity sweep. Market structure shifted bullish on the 1H timeframe following key support test.
            </p>
          </div>

          {/* Social Sentiment Gauge */}
          <div className="bg-card-dark/60 p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-fiery-orange" />
                Community Sentiment ({totalVotes} votes)
              </span>
              <span className="text-emerald-400">{bullPercent}% Bullish</span>
            </div>

            <div className="w-full bg-rose-500/30 rounded-full h-2.5 overflow-hidden flex">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${bullPercent}%` }} />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button 
                onClick={() => handleVote('bullish')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border transition-all ${
                  userVote === 'bullish' 
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Bullish ({bullishVotes})
              </button>

              <button 
                onClick={() => handleVote('bearish')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border transition-all ${
                  userVote === 'bearish' 
                    ? 'bg-rose-500 text-white border-rose-400 shadow-md' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                Bearish ({bearishVotes})
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center gap-3">
          {onOpenCalculator && (
            <button
              onClick={() => {
                onClose();
                onOpenCalculator(signal);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Calculator className="w-4 h-4 text-fiery-amber" />
              Calculate Lot Size
            </button>
          )}

          <button
            onClick={handleCopyAll}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-fiery-orange via-fiery-red to-fiery-amber text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-fiery hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-black" />
                Signal Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-black" />
                Copy MT4 / MT5 Signal
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
