"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Clock, Loader2, Zap, ExternalLink } from "lucide-react";
import { signalsApi } from "@/lib/signalsApi";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TradingSignal {
  id: string;
  pair: string;
  type: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number | null;
  takeProfits: number[];
  accuracy: number;
  timeframe: string;
  status: string;
  createdAt: string;
}

export function SignalsCard() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await signalsApi.getAllSignals({ status: 'active', limit: 4 });
        const data = Array.isArray(res.data) ? res.data : [];
        setSignals(data.slice(0, 4));
      } catch {
        setSignals([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title mb-0 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" /> Active Signals
        </h3>
        <Link href="/signals" className="text-sm text-primary hover:underline flex items-center gap-1">
          View All <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : signals.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No active signals at this time
        </div>
      ) : (
        <div className="space-y-4">
          {signals.map(signal => {
            const isBuy = signal.type?.toUpperCase() === 'BUY';
            const tp = signal.takeProfits?.[0] ?? signal.takeProfit;
            return (
              <div
                key={signal.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-transparent transition-all hover:border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isBuy ? "bg-success/20" : "bg-destructive/20"
                  )}>
                    {isBuy
                      ? <ArrowUpRight className="w-5 h-5 text-success" />
                      : <ArrowDownRight className="w-5 h-5 text-destructive" />
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{signal.pair}</span>
                      <span className={cn(
                        "text-[10px] font-black px-1.5 py-0.5 rounded",
                        isBuy ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      )}>
                        {signal.type?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Entry: {signal.entryPrice}</span>
                      {tp && <span>TP: {tp}</span>}
                      <span>SL: {signal.stopLoss}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-success/20 text-success">
                    {signal.accuracy?.toFixed(0) ?? 85}%
                  </span>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground justify-end">
                    <Clock className="w-3 h-3" />
                    {signal.timeframe}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
