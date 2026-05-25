'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/dashboard/ui/button";
import React from 'react';


type ChartData = {
  month: string;
  revenue: number;
  investment: number;
};

const data: ChartData[] = [
  { month: "Jan", revenue: 4500, investment: 3000 },
  { month: "Feb", revenue: 5200, investment: 3500 },
  { month: "Mar", revenue: 4800, investment: 3200 },
  { month: "Apr", revenue: 6100, investment: 4000 },
  { month: "May", revenue: 7200, investment: 4500 },
  { month: "Jun", revenue: 6800, investment: 4200 },
  { month: "Jul", revenue: 8500, investment: 5000 },
  { month: "Aug", revenue: 9200, investment: 5500 },
  { month: "Sep", revenue: 8800, investment: 5200 },
  { month: "Oct", revenue: 10500, investment: 6000 },
  { month: "Nov", revenue: 11200, investment: 6500 },
  { month: "Dec", revenue: 12800, investment: 7000 },
];

type TooltipProps = {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <p className="text-sm font-medium mb-2" style={{ color: "#1e293b" }}>
          {label}
        </p>

        <div className="space-y-1">
          <p className="text-sm" style={{ color: "#0D73ED" }}>
            Revenue:{" "}
            <span className="font-semibold">
              ${payload[0]?.value?.toLocaleString()}
            </span>
          </p>

          <p className="text-sm" style={{ color: "#06b6d4" }}>
            Investment:{" "}
            <span className="font-semibold">
              ${payload[1]?.value?.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default function RevenueChart() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" style={{ color: "#0D73ED" }} />
          </div>

          <div>
            <h3 className="font-display font-semibold" style={{ color: "#1e293b" }}>
              Revenue Overview
            </h3>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Monthly performance tracking
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="gap-2"
          style={{ borderColor: "#e2e8f0", color: "#64748b" }}
        >
          <Calendar className="w-4 h-4" />
          This Year
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#0D73ED" }} />
          <span className="text-sm" style={{ color: "#64748b" }}>Revenue</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#06b6d4" }} />
          <span className="text-sm" style={{ color: "#64748b" }}>Investment</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(222, 30%, 18%)"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(43, 96%, 56%)"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />

              <Area
                type="monotone"
                dataKey="investment"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth={2}
                fill="url(#colorInvestment)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}
