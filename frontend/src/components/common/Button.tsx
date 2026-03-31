'use client';

import React, { useRef } from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gradient' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  onMouseMove,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    btn.style.setProperty('--mx', `${x}%`);
    btn.style.setProperty('--my', `${y}%`);
    onMouseMove?.(e);
  };

  const base = [
    'relative inline-flex items-center justify-center gap-2 font-semibold',
    'rounded-2xl overflow-hidden cursor-pointer select-none',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
    'disabled:opacity-40 disabled:pointer-events-none',
    // shimmer spot follows cursor
    'before:absolute before:inset-0 before:rounded-[inherit]',
    'before:bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.18)_0%,transparent_65%)]',
    'before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
  ].join(' ');

  const variants: Record<string, string> = {
    primary: [
      'bg-[#0A5CB8] text-white',
      'shadow-[0_2px_0_#084a96,0_4px_12px_rgba(13,115,237,0.35),inset_0_1px_0_rgba(255,255,255,0.18)]',
      'hover:bg-[#0D6FE0]',
      'hover:shadow-[0_2px_0_#084a96,0_8px_24px_rgba(13,115,237,0.5),inset_0_1px_0_rgba(255,255,255,0.22)]',
      'active:translate-y-px active:shadow-[0_1px_0_#084a96,0_2px_8px_rgba(13,115,237,0.3)]',
      // top-edge gloss
      'after:absolute after:inset-x-0 after:top-0 after:h-[1px] after:rounded-t-2xl',
      'after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent',
    ].join(' '),

    secondary: [
      'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100',
      'border border-gray-200 dark:border-gray-700',
      'shadow-[0_1px_0_#d1d5db,0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]',
      'dark:shadow-[0_1px_0_#374151,0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]',
      'hover:shadow-[0_1px_0_#d1d5db,0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]',
      'active:translate-y-px',
    ].join(' '),

    danger: [
      'bg-red-600 text-white',
      'shadow-[0_2px_0_#b91c1c,0_4px_12px_rgba(220,38,38,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]',
      'hover:bg-red-500',
      'hover:shadow-[0_2px_0_#b91c1c,0_8px_24px_rgba(220,38,38,0.45),inset_0_1px_0_rgba(255,255,255,0.2)]',
      'active:translate-y-px active:shadow-[0_1px_0_#b91c1c,0_2px_8px_rgba(220,38,38,0.3)]',
      'after:absolute after:inset-x-0 after:top-0 after:h-[1px] after:rounded-t-2xl',
      'after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent',
    ].join(' '),

    outline: [
      'bg-transparent text-[#0D73ED] dark:text-[#60A5FA]',
      'border-2 border-[#0D73ED] dark:border-[#60A5FA]',
      'shadow-[0_0_0_0_rgba(13,115,237,0)] hover:shadow-[0_0_0_4px_rgba(13,115,237,0.12)]',
      'hover:bg-[#0D73ED]/5 dark:hover:bg-[#60A5FA]/8',
      'active:translate-y-px',
    ].join(' '),

    gradient: [
      'text-white',
      'bg-[linear-gradient(135deg,#0D73ED_0%,#2E8CE8_40%,#6AC3FF_100%)]',
      'shadow-[0_2px_0_rgba(0,0,0,0.18),0_4px_16px_rgba(13,115,237,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]',
      'hover:shadow-[0_2px_0_rgba(0,0,0,0.18),0_8px_28px_rgba(13,115,237,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]',
      'hover:brightness-110',
      'active:translate-y-px active:brightness-95',
      'after:absolute after:inset-x-0 after:top-0 after:h-[1px] after:rounded-t-2xl',
      'after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent',
    ].join(' '),

    ghost: [
      'bg-transparent text-gray-700 dark:text-gray-300',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      'active:bg-gray-200 dark:active:bg-gray-700',
      'active:translate-y-px',
    ].join(' '),

    gold: [
      'text-[#5c3a00]',
      'bg-[linear-gradient(135deg,#F5C842_0%,#FBDC6A_35%,#E8A800_70%,#F5C842_100%)]',
      'shadow-[0_2px_0_#c48800,0_4px_16px_rgba(232,168,0,0.4),inset_0_1px_0_rgba(255,255,255,0.5)]',
      'hover:shadow-[0_2px_0_#c48800,0_8px_28px_rgba(232,168,0,0.55),inset_0_1px_0_rgba(255,255,255,0.55)]',
      'hover:brightness-105',
      'active:translate-y-px active:brightness-95',
      'after:absolute after:inset-x-0 after:top-0 after:h-[1px] after:rounded-t-2xl',
      'after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent',
    ].join(' '),
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm tracking-wide h-9',
    md: 'px-6 py-3 text-base tracking-wide h-11',
    lg: 'px-8 py-4 text-lg tracking-wide h-14',
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </button>
  );
}