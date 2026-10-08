'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage, type Locale } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale, options, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === locale))
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const current = options.find((o) => o.value === locale) ?? options[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Focus the active option when the menu opens
  useEffect(() => {
    if (open) {
      const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
      el?.focus();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const commit = (value: Locale, index: number) => {
    setLocale(value);
    setActiveIndex(index);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      const next = (activeIndex + dir + options.length) % options.length;
      setActiveIndex(next);
      (listRef.current?.children[next] as HTMLElement | undefined)?.focus();
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(options[activeIndex].value, activeIndex);
    }
  };

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('common.chooseLanguage', 'Choose language')}: ${current.nativeLabel}`}
        whileTap={{ scale: 0.97 }}
        className="group flex h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.045] px-3 text-xs font-semibold text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[background,border-color,box-shadow,color] duration-200 hover:border-[#FF6B00]/35 hover:bg-white/[0.075] hover:text-white hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/50"
      >
        <motion.span
          animate={{ rotate: open ? 18 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="flex text-[#FF8A32]"
        >
          <Globe size={15} aria-hidden="true" />
        </motion.span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current.value}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="min-w-[2.5rem] text-left"
          >
            {current.nativeLabel}
          </motion.span>
        </AnimatePresence>
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={`text-white/40 transition-transform duration-200 ${open ? 'rotate-180 text-[#FF8A32]' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
        <motion.ul
          ref={listRef}
          role="listbox"
          aria-label={t('common.chooseLanguage', 'Choose language')}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.98 }}
          transition={{ duration: 0.17, ease: 'easeOut' }}
          style={{ transformOrigin: 'top right' }}
          className="absolute right-0 z-50 mt-2 min-w-[12rem] overflow-hidden rounded-xl border border-white/[0.11] bg-[#111116]/95 p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.48)] backdrop-blur-2xl"
        >
          {options.map((option, index) => {
            const selected = option.value === locale;
            return (
              <motion.li
                key={option.value}
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commit(option.value, index)}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.16, delay: index * 0.025 }}
                whileHover={{ x: 2 }}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-xs outline-none transition-[background,color] duration-150 ${
                  index === activeIndex ? 'bg-white/[0.075]' : 'hover:bg-white/[0.045]'
                } ${selected ? 'font-semibold text-[#FF8A32]' : 'font-medium text-white/75'}`}
              >
                <span className="flex min-w-0 flex-col items-start gap-0.5">
                  <span>{option.nativeLabel}</span>
                  <span className="text-[10px] font-normal text-white/35">{option.label}</span>
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.04] text-sm" aria-hidden="true">
                  {option.flag}
                </span>
                {selected && <Check size={14} aria-hidden="true" className="shrink-0 text-[#FF8A32]" />}
              </motion.li>
            );
          })}
        </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}