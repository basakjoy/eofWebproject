'use client';

import React, { useState, useEffect } from 'react';
import { X, Calculator, ShieldCheck, DollarSign, Percent, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { SignalRecord } from '@/lib/signalsApi';

interface RiskCalculatorModalProps {
  signal: SignalRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RiskCalculatorModal({
  signal,
  isOpen,
  onClose
}: RiskCalculatorModalProps) {
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [entryPrice, setEntryPrice] = useState<number>(1.0850);
  const [stopLoss, setStopLoss] = useState<number>(1.0810);
  const [takeProfit, setTakeProfit] = useState<number>(1.0970);
  const [pair, setPair] = useState<string>('EUR/USD');

  useEffect(() => {
    if (signal) {
      if (signal.pair) setPair(signal.pair);
      if (signal.entryPrice) setEntryPrice(Number(signal.entryPrice));
      if (signal.stopLoss || signal.stoploss) setStopLoss(Number(signal.stopLoss || signal.stoploss));
      if (signal.takeProfit1 || signal.takeProfit) setTakeProfit(Number(signal.takeProfit1 || signal.takeProfit));
    }
  }, [signal]);

  if (!isOpen) return null;

  // Calculations
  const riskAmount = (accountBalance * riskPercent) / 100;
  const pipsDifference = Math.abs(entryPrice - stopLoss);
  
  // Standard Lot multiplier (Approximate pip value)
  let pipValuePerLot = 10; // Forex pairs standard
  if (pair.includes('XAU') || pair.includes('GOLD')) {
    pipValuePerLot = 100;
  } else if (pair.includes('BTC')) {
    pipValuePerLot = 1;
  } else if (pair.includes('JPY')) {
    pipValuePerLot = 7.5;
  }

  // Position Lot calculation
  const pipDistance = pipsDifference * (pair.includes('JPY') ? 100 : pair.includes('XAU') || pair.includes('BTC') ? 1 : 10000);
  const calculatedLots = (pipDistance > 0 && pipValuePerLot > 0)
    ? Math.max(0.01, Number((riskAmount / (pipDistance * (pipValuePerLot / 10))).toFixed(2)))
    : 0.10;

  const rewardPips = Math.abs(takeProfit - entryPrice);
  const rrRatio = pipsDifference > 0 ? (rewardPips / pipsDifference).toFixed(2) : '3.0';
  const potentialProfit = riskAmount * Number(rrRatio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeInUp">
      <div 
        className="relative w-full max-w-xl bg-[#09090D] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-fiery-orange/15 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-fiery-orange/10 border border-fiery-orange/30 text-fiery-orange">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Lot Size & Risk Calculator</h2>
              <p className="text-xs text-zinc-400">Calculate exact position size & monetary risk for <strong className="text-white">{pair}</strong></p>
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
          
          {/* Output Results Grid */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-gradient-to-br from-panel-dark to-card-dark border border-white/10 shadow-glass-card">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-fiery-orange" />
                Recommended Position
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {calculatedLots} <span className="text-sm font-semibold text-fiery-amber">Lots</span>
              </p>
              <span className="text-[11px] text-zinc-500 block">Based on {riskPercent}% account risk</span>
            </div>

            <div className="space-y-1 border-l border-white/10 pl-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-rose-400" />
                Max Risk Amount
              </span>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
                ${riskAmount.toFixed(2)}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold block">Est. Profit: +${potentialProfit.toFixed(2)}</span>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            
            {/* Account Balance & Risk % */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Account Balance ($)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-8 pr-4 text-sm font-bold text-white focus:outline-none focus:border-fiery-orange/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Risk Per Trade (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-8 text-sm font-bold text-white focus:outline-none focus:border-fiery-orange/60"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">%</span>
                </div>
              </div>
            </div>

            {/* Price Levels Inputs */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Entry Price</label>
                <input
                  type="number"
                  step="0.0001"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-fiery-orange/60"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-rose-400 block mb-1">Stop Loss</label>
                <input
                  type="number"
                  step="0.0001"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-3 text-xs font-mono font-bold text-rose-400 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-emerald-400 block mb-1">Take Profit 1</label>
                <input
                  type="number"
                  step="0.0001"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                  className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2 px-3 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

          </div>

          {/* Quick Info */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-fiery-amber shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Using a strict 1.0% to 2.0% risk rule preserves capital during drawdowns and ensures long-term compounding growth.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-fiery-orange to-fiery-amber text-black font-extrabold text-xs shadow-fiery hover:scale-105 transition-transform"
          >
            Apply to Position
          </button>
        </div>

      </div>
    </div>
  );
}
