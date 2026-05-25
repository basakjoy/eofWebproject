"use client";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Signal {
  id: string;
  pair: string;
  type: "buy" | "sell";
  entry: number;
  target: number;
  stopLoss: number;
  confidence: "high" | "medium" | "low";
  timeframe: string;
  isActive: boolean;
}

const mockSignals: Signal[] = [
  { id: "1", pair: "EUR/USD", type: "buy", entry: 1.0842, target: 1.0920, stopLoss: 1.0780, confidence: "high", timeframe: "4H", isActive: true },
  { id: "2", pair: "GBP/JPY", type: "sell", entry: 188.450, target: 186.800, stopLoss: 189.200, confidence: "medium", timeframe: "1D", isActive: true },
  { id: "3", pair: "USD/CHF", type: "buy", entry: 0.8825, target: 0.8920, stopLoss: 0.8760, confidence: "high", timeframe: "1H", isActive: true },
  { id: "4", pair: "AUD/USD", type: "sell", entry: 0.6542, target: 0.6480, stopLoss: 0.6590, confidence: "low", timeframe: "4H", isActive: false },
];

export function SignalsCard() {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title mb-0">Active Signals</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {mockSignals.slice(0, 4).map((signal) => (
          <div
            key={signal.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-transparent transition-all hover:border-primary/20",
              !signal.isActive && "opacity-50"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  signal.type === "buy" ? "bg-success/20" : "bg-destructive/20"
                )}
              >
                {signal.type === "buy" ? (
                  <ArrowUpRight className="w-5 h-5 text-success" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{signal.pair}</span>
                  <span className={cn("signal-badge", signal.type === "buy" ? "signal-buy" : "signal-sell")}>
                    {signal.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>Entry: {signal.entry}</span>
                  <span>TP: {signal.target}</span>
                  <span>SL: {signal.stopLoss}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded",
                  signal.confidence === "high" && "bg-success/20 text-success",
                  signal.confidence === "medium" && "bg-warning/20 text-warning",
                  signal.confidence === "low" && "bg-muted text-muted-foreground"
                )}
              >
                {signal.confidence.toUpperCase()}
              </span>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground justify-end">
                <Clock className="w-3 h-3" />
                {signal.timeframe}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
