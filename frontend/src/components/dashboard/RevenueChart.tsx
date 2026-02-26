"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const monthlyData = [
  { name: "Jul", revenue: 4200 },
  { name: "Aug", revenue: 5800 },
  { name: "Sep", revenue: 4500 },
  { name: "Oct", revenue: 6200 },
  { name: "Nov", revenue: 5100 },
  { name: "Dec", revenue: 4800 },
  { name: "Jan", revenue: 5600 },
  { name: "Feb", revenue: 4900 },
  { name: "Mar", revenue: 5300 },
  { name: "Apr", revenue: 4700 },
  { name: "May", revenue: 5100 },
  { name: "Jun", revenue: 5400 },
];

const barColor = "#3b82f6"; // blue

type TimeRange = "weekly" | "monthly" | "yearly";

export function RevenueChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("yearly");

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Revenue</h3>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold font-display text-gray-900">
              $28,165
            </span>
            <span className="text-sm font-semibold text-white bg-green-500 px-3 py-1 rounded-full whitespace-nowrap">
              +8.3%
            </span>
            <span className="text-sm text-gray-600 whitespace-nowrap">
              vs $24,280 last period
            </span>
          </div>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 self-start gap-1">
          {(["weekly", "monthly", "yearly"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-2 text-xs sm:text-sm rounded-md transition-all capitalize whitespace-nowrap font-medium",
                timeRange === range
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-80 overflow-x-auto -mx-6 sm:mx-0">
        <div className="px-6 sm:px-0">
          <ResponsiveContainer width="100%" height={320} minWidth={400}>
            <BarChart data={monthlyData} barSize={45}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6b7280",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6b7280",
                  fontSize: 12,
                }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "#111827", fontWeight: "bold" }}
                itemStyle={{ color: "#3b82f6" }}
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Bar dataKey="revenue" radius={[10, 10, 0, 0]} fill={barColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
