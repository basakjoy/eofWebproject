"use client"
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: "bullish" | "bearish" | "neutral";
  pairs: string[];
  timestamp: string;
}

const mockInsights: Insight[] = [
  {
    id: "1",
    title: "Fed Rate Decision Impact",
    description: "Federal Reserve maintains rates, signaling potential cuts in Q2 2026",
    impact: "bullish",
    pairs: ["EUR/USD", "GBP/USD"],
    timestamp: "2h ago",
  },
  {
    id: "2",
    title: "UK Inflation Data",
    description: "CPI comes in above expectations, strengthening GBP",
    impact: "bullish",
    pairs: ["GBP/JPY", "EUR/GBP"],
    timestamp: "4h ago",
  },
  {
    id: "3",
    title: "Japan Trade Balance",
    description: "Deficit widens, putting pressure on JPY",
    impact: "bearish",
    pairs: ["USD/JPY", "EUR/JPY"],
    timestamp: "6h ago",
  },
];

export function MarketInsightsCard() {
  return (
    <div className="glass-card rounded-xl p-6 bg-white/50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-primary/20 dark:hover:border-primary/30 transition-all">
      <div className="flex items-center justify-between mb-6 ">
        <h3 className="section-title mb-0">Market Insights</h3>
        <button className="text-sm text-primary hover:underline flex items-center gap-1"> 
          View All <ExternalLink className="w-3 h-3" />
        </button> 
      </div>

      <div className="space-y-4">
        {mockInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/40 dark:hover:border-primary/30 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  insight.impact === "bullish" && "bg-success/20 dark:bg-success/30",
                  insight.impact === "bearish" && "bg-destructive/20 dark:bg-destructive/30",
                  insight.impact === "neutral" && "bg-muted dark:bg-slate-700"
                )}
              >
                {insight.impact === "bullish" && <TrendingUp className="w-4 h-4 text-success" />}
                {insight.impact === "bearish" && <TrendingDown className="w-4 h-4 text-destructive" />}
                {insight.impact === "neutral" && <Minus className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm">{insight.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{insight.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  {insight.pairs.map((pair) => (
                    <span
                      key={pair}
                      className="text-xs px-2 py-0.5 rounded bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/90"
                    >
                      {pair}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground ml-auto">{insight.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
