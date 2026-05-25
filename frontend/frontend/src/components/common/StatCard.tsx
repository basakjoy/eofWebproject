'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'indigo' | 'emerald' | 'rose' | 'amber';
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  color = 'blue',
  trend,
  subtitle,
}: StatCardProps) {
  const colorConfig = {
    blue: {
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      iconText: 'text-blue-600 dark:text-blue-400',
      accent: 'group-hover:shadow-blue-500/20',
      ring: 'ring-blue-500/5 dark:ring-blue-400/10',
      glow: 'from-blue-500/[0.08] to-transparent',
    },
    green: {
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      iconText: 'text-emerald-600 dark:text-emerald-400',
      accent: 'group-hover:shadow-emerald-500/20',
      ring: 'ring-emerald-500/5 dark:ring-emerald-400/10',
      glow: 'from-emerald-500/[0.08] to-transparent',
    },
    yellow: {
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      iconText: 'text-amber-600 dark:text-amber-400',
      accent: 'group-hover:shadow-amber-500/20',
      ring: 'ring-amber-500/5 dark:ring-amber-400/10',
      glow: 'from-amber-500/[0.08] to-transparent',
    },
    red: {
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
      iconText: 'text-rose-600 dark:text-rose-400',
      accent: 'group-hover:shadow-rose-500/20',
      ring: 'ring-rose-500/5 dark:ring-rose-400/10',
      glow: 'from-rose-500/[0.08] to-transparent',
    },
    indigo: {
      iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      iconText: 'text-indigo-600 dark:text-indigo-400',
      accent: 'group-hover:shadow-indigo-500/20',
      ring: 'ring-indigo-500/5 dark:ring-indigo-400/10',
      glow: 'from-indigo-500/[0.08] to-transparent',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      iconText: 'text-emerald-600 dark:text-emerald-400',
      accent: 'group-hover:shadow-emerald-500/20',
      ring: 'ring-emerald-500/5 dark:ring-emerald-400/10',
      glow: 'from-emerald-500/[0.08] to-transparent',
    },
    rose: {
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
      iconText: 'text-rose-600 dark:text-rose-400',
      accent: 'group-hover:shadow-rose-500/20',
      ring: 'ring-rose-500/5 dark:ring-rose-400/10',
      glow: 'from-rose-500/[0.08] to-transparent',
    },
    amber: {
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      iconText: 'text-amber-600 dark:text-amber-400',
      accent: 'group-hover:shadow-amber-500/20',
      ring: 'ring-amber-500/5 dark:ring-amber-400/10',
      glow: 'from-amber-500/[0.08] to-transparent',
    },
  };

  const config = colorConfig[color as keyof typeof colorConfig] || colorConfig.blue;

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-gray-200/50 dark:border-white/[0.06] bg-white dark:bg-[#070b14]/80 backdrop-blur-xl p-5 sm:p-6 shadow-sm hover:shadow-2xl hover:shadow-${color}-500/10 transition-all duration-500 ease-out hover:-translate-y-1.5`}
    >
      {/* Visual background accents */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${config.glow} blur-3xl rounded-full opacity-50 transition-opacity duration-500 group-hover:opacity-100`} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-[0.2em]">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1.5 leading-tight tabular-nums tracking-tight">
            {value}
          </p>

          {trend && (
            <div className="flex items-center gap-2 mt-3.5">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${trend.isPositive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3 stroke-[3]" />
                ) : (
                  <TrendingDown className="w-3 h-3 stroke-[3]" />
                )}
                {trend.value}%
              </span>
              {subtitle && (
                <span className="text-[10px] font-medium text-gray-400 dark:text-white/20">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Icon Container with Glass Effect */}
        <div
          className={`${config.iconBg} ${config.iconText} p-3.5 rounded-2xl flex-shrink-0 transition-all duration-500 group-hover:scale-110 shadow-inner`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
