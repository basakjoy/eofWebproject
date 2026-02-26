'use client';

import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

type Pair = {
  pair: string;
  rate: string;
  change: string;
  isPositive: boolean;
  volume: string;
};

const currencyFlags: Record<string, string> = {
  EUR: "🇪🇺",
  USD: "🇺🇸",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  AUD: "🇦🇺",
  CHF: "🇨🇭",
};

const pairs: Pair[] = [
  { pair: "EUR/USD", rate: "1.0892", change: "+0.45%", isPositive: true, volume: "2.4M" },
  { pair: "GBP/USD", rate: "1.2654", change: "-0.23%", isPositive: false, volume: "1.8M" },
  { pair: "USD/JPY", rate: "149.82", change: "+0.67%", isPositive: true, volume: "3.1M" },
  { pair: "AUD/USD", rate: "0.6543", change: "+0.12%", isPositive: true, volume: "890K" },
  { pair: "USD/CHF", rate: "0.8876", change: "-0.34%", isPositive: false, volume: "720K" },
];

export default function CurrencyPairs() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <Activity className="w-5 h-5" style={{ color: "#0D73ED" }} />
        </div>
        <div>
          <h3 className="font-display font-semibold" style={{ color: "#1e293b" }}>
            Currency Pairs
          </h3>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Live market rates
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {pairs.map((item, index) => {
          const [base, quote] = item.pair.split("/");

          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer"
              style={{ backgroundColor: "#f1f5f9" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  <span className="text-2xl" aria-label={base}>
                    {currencyFlags[base]}
                  </span>
                  <span className="text-2xl" aria-label={quote}>
                    {currencyFlags[quote]}
                  </span>
                </div>

                <div>
                  <p className="font-medium" style={{ color: "#1e293b" }}>
                    {item.pair}
                  </p>
                  <p className="text-xs" style={{ color: "#64748b" }}>
                    Vol: {item.volume}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-mono font-semibold" style={{ color: "#1e293b" }}>
                  {item.rate}
                </p>

                <div
                  className={`flex items-center justify-end gap-1 text-sm`}
                  style={{ color: item.isPositive ? "#10b981" : "#ef4444" }}
                >
                  {item.isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
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
