import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gradient-buy' | 'gradient-sell';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export default function Badge({ label, variant = 'primary', size = 'md', icon }: BadgeProps) {
  const variants = {
    primary: 'bg-[#E3F2FD] text-[#0D73ED]',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-[#C8E6C9] text-[#1A5631]',
    'gradient-buy': 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-200',
    'gradient-sell': 'bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-lg shadow-rose-200',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`${variants[variant]} ${sizes[size]} rounded-full font-semibold inline-flex items-center gap-1.5`}>
      {icon}
      {label}
    </span>
  );
}
