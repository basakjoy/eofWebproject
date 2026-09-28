'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
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
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="group flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-semibold text-slate-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B00]/60"
      >
        <Globe size={14} aria-hidden="true" className="shrink-0 text-[#FF6B00]" />
        <span className="text-slate-200 group-hover:text-white">{current.nativeLabel}</span>
        <ChevronDown
          size={12}
          aria-hidden="true"
          className={`text-slate-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={t('common.chooseLanguage', 'Choose language')}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          className="absolute right-0 z-50 mt-1.5 min-w-[9rem] overflow-hidden rounded-lg border border-white/10 bg-[#17171d] py-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        >
          {options.map((option, index) => {
            const selected = option.value === locale;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commit(option.value, index)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-1.5 text-xs font-medium outline-none transition-colors ${
                  index === activeIndex ? 'bg-white/[0.06]' : ''
                } ${selected ? 'text-[#FF6B00]' : 'text-slate-200'}`}
              >
                {option.nativeLabel}
                {selected && <Check size={13} aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}