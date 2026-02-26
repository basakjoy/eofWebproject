'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  hover = false,
  animate = false,
  padding = 'md',
}: CardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (animate && ref.current) {
      gsap.from(ref.current, {
        opacity: 0,
        y: 15,
        scale: 0.98,
        duration: 0.6,
        ease: 'expo.out',
      });
    }
  }, [animate]);

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-10',
  };

  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-[#070b14]/70 backdrop-blur-2xl rounded-[1.75rem] border border-gray-200/50 dark:border-white/[0.06] ${paddingClasses[padding]} shadow-sm shadow-black/5 dark:shadow-2xl transition-all duration-500 ease-out ${hover
          ? 'hover:border-gray-300 dark:hover:border-white/[0.12] hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 cursor-pointer'
          : ''
        } ${className}`}
    >
      {children}
    </div>
  );
}
