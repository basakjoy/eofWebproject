'use client';

import { ArrowUpRight, ArrowDownRight, Activity, RefreshCw } from "lucide-react";
import { useState, useEffect } from 'react';
import { useForex } from '@/hooks/use-forex';

type Pair = {
  pair: string;
  rate: string;
  change: string;
  isPositive: boolean;
};

const currencyFlags: Record<string, string> = {
  EUR: "🇪🇺",
  USD: "🇺🇸",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  AUD: "🇦🇺",
  CHF: "🇨🇭",
};

const PAIRS_CONFIG = [
  { pair: "EUR/USD", volume: "2.4M" },
  { pair: "GBP/USD", volume: "1.8M" },
  { pair: "USD/JPY", volume: "3.1M" },
  { pair: "AUD/USD", volume: "890K" },
  { pair: "USD/CHF", volume: "720K" },
];

export default function CurrencyPairs() {
  const { data: forexData, loading, refresh } = useForex(PAIRS_CONFIG.map(p => p.pair));
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!loading) setLastUpdated(new Date());
  }, [forexData, loading]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Activity className="w-5 h-5" style={{ color: "#0D73ED" }} />
          </div>
          <div>
            <h3 className="font-display font-semibold" style={{ color: "#1e293b" }}>
              Currency Pairs
            </h3>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Live market rates {lastUpdated && `• ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          </div>
        </div>

        <button
          onClick={refresh}
          className={`p-2 rounded-lg hover:bg-slate-100 transition-all ${loading ? 'animate-spin' : ''}`}
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="space-y-3">
        {PAIRS_CONFIG.map((config, index) => {
          const item = forexData[config.pair];
          if (!item) return null;

          const [base, quote] = item.pair.split("/");

          return (
            <div
              key={`${index}-${item.rate}`}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200 group animate-price-flash ${loading ? 'opacity-50' : 'opacity-100'}`}
              style={{ backgroundColor: "#f8fafc" }}
            >


              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  <span className="text-2xl drop-shadow-sm" aria-label={base}>
                    {currencyFlags[base]}
                  </span>
                  <span className="text-2xl drop-shadow-sm" aria-label={quote}>
                    {currencyFlags[quote]}
                  </span>
                </div>

                <div>
                  <p className="font-bold tracking-tight" style={{ color: "#1e293b" }}>
                    {item.pair}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                    Vol: {config.volume}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-mono text-lg font-bold tracking-tighter" style={{ color: "#1e293b" }}>
                  {item.rate}
                </p>

                <div
                  className={`flex items-center justify-end gap-1 text-xs font-black uppercase tracking-wider`}
                  style={{ color: item.isPositive ? "#10b981" : "#ef4444" }}
                >
                  {item.isPositive ? (
                    <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 stroke-[3]" />
                  )}
                  {item.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
