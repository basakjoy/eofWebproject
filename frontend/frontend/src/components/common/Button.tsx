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
    'rounded-xl overflow-hidden cursor-pointer select-none',
    'transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
    // shimmer spot follows cursor
    'before:absolute before:inset-0 before:rounded-[inherit]',
    'before:bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.25)_0%,transparent_60%)]',
    'before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400',
    // hover scale animation
    'hover:scale-105 active:scale-95',
  ].join(' ');

  const variants: Record<string, string> = {
    primary: [
      'bg-[linear-gradient(135deg,#0A5CB8_0%,#1B7FDF_100%)] text-white',
      'shadow-[0_8px_32px_-8px_rgba(13,115,237,0.4),0_0_0_1px_rgba(255,255,255,0.1)_inset]',
      'hover:shadow-[0_20px_48px_-12px_rgba(13,115,237,0.6),0_0_0_1px_rgba(255,255,255,0.15)_inset]',
      'hover:brightness-110',
      'active:brightness-95 active:shadow-[0_4px_16px_-8px_rgba(13,115,237,0.4)]',
      // top-edge gloss
      'after:absolute after:inset-x-0 after:top-0 after:h-[2px] after:rounded-t-xl',
      'after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent',
    ].join(' '),

    secondary: [
      'bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(30,30,30,0.8)] text-gray-900 dark:text-gray-100',
      'backdrop-blur-sm',
      'border border-gray-200/60 dark:border-gray-700/60',
      'shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]',
      'dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)_inset]',
      'hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.6)_inset]',
      'dark:hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)_inset]',
      'hover:bg-white dark:hover:bg-[rgba(45,45,45,0.9)]',
    ].join(' '),

    danger: [
      'bg-[linear-gradient(135deg,#DC2626_0%,#F87171_100%)] text-white',
      'shadow-[0_8px_32px_-8px_rgba(220,38,38,0.4),0_0_0_1px_rgba(255,255,255,0.1)_inset]',
      'hover:shadow-[0_20px_48px_-12px_rgba(220,38,38,0.6),0_0_0_1px_rgba(255,255,255,0.15)_inset]',
      'hover:brightness-110',
      'active:brightness-95 active:shadow-[0_4px_16px_-8px_rgba(220,38,38,0.4)]',
      'after:absolute after:inset-x-0 after:top-0 after:h-[2px] after:rounded-t-xl',
      'after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent',
    ].join(' '),

    outline: [
      'bg-transparent text-[#0D73ED] dark:text-[#60A5FA]',
      'border-2 border-current',
      'shadow-[0_0_0_0_rgba(13,115,237,0)]',
      'hover:shadow-[0_0_0_8px_rgba(13,115,237,0.12)]',
      'hover:bg-[#0D73ED]/5 dark:hover:bg-[#60A5FA]/8',
      'active:bg-[#0D73ED]/10 dark:active:bg-[#60A5FA]/12',
    ].join(' '),

    gradient: [
      'text-white',
      'bg-[linear-gradient(135deg,#0D73ED_0%,#2E8CE8_40%,#00D4FF_100%)]',
      'shadow-[0_8px_32px_-8px_rgba(13,115,237,0.5),0_0_0_1px_rgba(255,255,255,0.15)_inset]',
      'hover:shadow-[0_20px_48px_-12px_rgba(0,212,255,0.6),0_0_0_1px_rgba(255,255,255,0.2)_inset]',
      'hover:brightness-115',
      'active:brightness-90 active:shadow-[0_4px_16px_-8px_rgba(13,115,237,0.4)]',
      'after:absolute after:inset-x-0 after:top-0 after:h-[2px] after:rounded-t-xl',
      'after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent',
    ].join(' '),

    ghost: [
      'bg-transparent text-gray-700 dark:text-gray-300',
      'hover:bg-gray-100/70 dark:hover:bg-gray-800/70',
      'hover:backdrop-blur-sm',
      'active:bg-gray-200/70 dark:active:bg-gray-700/70',
    ].join(' '),

    gold: [
      'text-[#5c3a00]',
      'bg-[linear-gradient(135deg,#FDB913_0%,#F5C842_40%,#E8A800_70%,#F5C842_100%)]',
      'shadow-[0_8px_32px_-8px_rgba(232,168,0,0.5),0_0_0_1px_rgba(255,255,255,0.4)_inset]',
      'hover:shadow-[0_20px_48px_-12px_rgba(232,168,0,0.7),0_0_0_1px_rgba(255,255,255,0.5)_inset]',
      'hover:brightness-110',
      'active:brightness-90 active:shadow-[0_4px_16px_-8px_rgba(232,168,0,0.4)]',
      'after:absolute after:inset-x-0 after:top-0 after:h-[2px] after:rounded-t-xl',
      'after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent',
    ].join(' '),
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm tracking-wide h-8 sm:h-9',
    md: 'px-5 py-2.5 text-sm sm:text-base tracking-wide h-10 sm:h-11',
    lg: 'px-7 py-3.5 text-base sm:text-lg tracking-wide h-12 sm:h-14',
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