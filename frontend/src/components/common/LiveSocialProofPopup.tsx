'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, TrendingUp, X, Sparkles, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface SocialProofItem {
  id: number;
  name: string;
  location: string;
  investedAmount: string;
  payoutAmount: string;
  plan: string;
  timeAgo: string;
  avatar: string;
  flagCode: string;
}

const TESTIMONIAL_POPUPS: SocialProofItem[] = [
  {
    id: 1,
    name: 'Duke',
    location: 'London, United Kingdom',
    investedAmount: '$10,000',
    payoutAmount: '$300.00',
    plan: '50% Profit Share Investment',
    timeAgo: 'Just now',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    flagCode: 'gb',
  },
  {
    id: 2,
    name: 'Tanvir',
    location: 'Dhaka, Bangladesh',
    investedAmount: '$5,000',
    payoutAmount: '$250.00',
    plan: 'Empire of Forex Fund Management',
    timeAgo: '2 mins ago',
    avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
    flagCode: 'bd',
  },
  {
    id: 3,
    name: 'Hamza',
    location: 'Lahore, Pakistan',
    investedAmount: '$12,000',
    payoutAmount: '$480.00',
    plan: '50% Profit Share Model',
    timeAgo: '4 mins ago',
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    flagCode: 'pk',
  },
  {
    id: 4,
    name: 'Aarav',
    location: 'Mumbai, India',
    investedAmount: '$20,000',
    payoutAmount: '$950.00',
    plan: 'Managed Account Portfolio',
    timeAgo: '6 mins ago',
    avatar: 'https://randomuser.me/api/portraits/men/79.jpg',
    flagCode: 'in',
  },
  {
    id: 5,
    name: 'Pradeep',
    location: 'Kathmandu, Nepal',
    investedAmount: '$8,000',
    payoutAmount: '$380.00',
    plan: '50% Profit Share System',
    timeAgo: '9 mins ago',
    avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    flagCode: 'np',
  },
  {
    id: 6,
    name: 'Amina',
    location: 'Dubai, UAE',
    investedAmount: '$50,000',
    payoutAmount: '$2,450.00',
    plan: 'Empire of Forex Fund Management',
    timeAgo: '12 mins ago',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    flagCode: 'ae',
  },
  {
    id: 7,
    name: 'Mateo',
    location: 'Madrid, Spain',
    investedAmount: '$25,000',
    payoutAmount: '$1,250.00',
    plan: '50% Profit Share Model',
    timeAgo: '15 mins ago',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    flagCode: 'es',
  },
];

export default function LiveSocialProofPopup() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissedByUser, setIsDismissedByUser] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isDismissedByUser) return;

    // Initial delay: 3 seconds after mounting
    const initialDelay = setTimeout(() => {
      setIsVisible(true);
    }, 3200);

    return () => clearTimeout(initialDelay);
  }, [isDismissedByUser]);

  useEffect(() => {
    if (isDismissedByUser || isPaused) return;

    if (isVisible) {
      // Keep popup open for 5.5 seconds
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 5500);
    } else {
      // Pause 4.5 seconds before showing next popup
      timerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIAL_POPUPS.length);
        setIsVisible(true);
      }, 4500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, isPaused, isDismissedByUser]);

  if (isDismissedByUser) return null;

  const currentItem = TESTIMONIAL_POPUPS[currentIndex];

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50 pointer-events-none select-none">
      <AnimatePresence mode="wait">
        {isVisible && currentItem && (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 35, scale: 0.92, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.94, filter: 'blur(2px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="pointer-events-auto max-w-[340px] sm:max-w-[380px] w-full rounded-2xl sm:rounded-3xl bg-[#090910]/95 backdrop-blur-2xl border border-white/[0.12] hover:border-[#FF6B00]/40 p-4 sm:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(255,107,0,0.12)] transition-all duration-300 relative overflow-hidden group"
          >
            {/* Top glass reflection line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Subtle background glow */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FF6B00]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header Row: Avatar, Flag, User Info & Close button */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                {/* Avatar with Live Indicator */}
                <div className="relative shrink-0">
                  <img
                    src={currentItem.avatar}
                    alt={currentItem.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/10 group-hover:border-[#FF6B00] transition-colors shadow-md"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#090910]"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      {currentItem.name}
                    </h4>
                    <img
                      src={`https://flagcdn.com/w20/${currentItem.flagCode}.png`}
                      alt={currentItem.location}
                      className="w-4 h-2.5 rounded-[2px] object-cover"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium truncate max-w-[170px] sm:max-w-[200px]">
                    {currentItem.location}
                  </p>
                </div>
              </div>

              {/* Verified Pill & Dismiss Button */}
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400">
                  <ShieldCheck size={10} className="text-emerald-400" />
                  Verified
                </span>

                <button
                  onClick={() => setIsDismissedByUser(true)}
                  aria-label="Dismiss notifications"
                  className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Main Testimonial Body */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1 mb-2.5">
              <p className="text-xs text-zinc-300 leading-snug">
                Invested <span className="font-mono font-bold text-white bg-white/[0.06] px-1 py-0.5 rounded">{currentItem.investedAmount}</span> and received{' '}
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded inline-flex items-center gap-0.5">
                  <TrendingUp size={11} /> +{currentItem.payoutAmount}
                </span>{' '}
                from profit share!
              </p>
            </div>

            {/* Bottom Meta Row */}
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#FF8C00] font-semibold flex items-center gap-1 truncate max-w-[190px] sm:max-w-[220px]">
                <Sparkles size={11} className="shrink-0" />
                <span className="truncate">{currentItem.plan}</span>
              </span>

              <span className="text-zinc-500 flex items-center gap-1 shrink-0">
                <Clock size={10} />
                {currentItem.timeAgo}
              </span>
            </div>

            {/* Quick Link Overlay */}
            <Link
              href="/register"
              className="absolute inset-0 z-0 opacity-0"
              aria-label="Join profit share program"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

