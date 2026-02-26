"use client";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({ title, value, change, trend = "neutral", icon: Icon, iconColor }: StatsCardProps) {
  const getIconTextColor = (bgColor?: string) => {
    if (!bgColor) return "text-blue-600";
    if (bgColor.includes("blue")) return "text-blue-600";
    if (bgColor.includes("green")) return "text-green-600";
    if (bgColor.includes("amber")) return "text-amber-600";
    if (bgColor.includes("purple")) return "text-purple-600";
    return "text-white";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 hover:shadow-lg hover:border-gray-300 transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold font-display text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {trend === "up" && <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />}
              {trend === "down" && <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0" />}
              <span
                className={cn(
                  "text-sm font-semibold",
                  trend === "up" && "text-green-600",
                  trend === "down" && "text-red-600",
                  trend === "neutral" && "text-gray-600"
                )}
              >
                {change}
              </span>
              <span className="text-xs text-gray-500 hidden sm:inline">vs last period</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0 shadow-md",
            iconColor || "bg-blue-100"
          )}
        >
          <Icon className={cn("w-6 h-6 sm:w-7 sm:h-7", getIconTextColor(iconColor))} />
        </div>
      </div>
    </div>
  );
}
