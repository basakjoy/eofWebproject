'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import enMessages from '../../messages/en.json';
import bnMessages from '../../messages/bn.json';
import hiMessages from '../../messages/hi.json';
import urMessages from '../../messages/ur.json';

export type Locale = 'en' | 'bn' | 'hi' | 'ur';

export interface LanguageOption {
  value: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧', dir: 'ltr' },
  { value: 'bn', label: 'Bangla', nativeLabel: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { value: 'ur', label: 'Urdu', nativeLabel: 'اردو', flag: '🇵🇰', dir: 'rtl' },
];

export const VALID_LOCALES: Locale[] = ['en', 'bn', 'hi', 'ur'];

export function getLocalizedPath(pathname: string, locale: Locale): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = normalizedPath.split('/');

  if (VALID_LOCALES.includes(segments[1] as Locale)) {
    segments[1] = locale;
    return segments.join('/') || `/${locale}`;
  }

  return `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`;
}

const ALL_MESSAGES: Record<Locale, Record<string, any>> = {
  en: enMessages,
  bn: bnMessages,
  hi: hiMessages,
  ur: urMessages,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: 'ltr' | 'rtl';
  options: LanguageOption[];
  t: (keyPath: string, fallback?: string, variables?: Record<string, string | number>) => string;
  messages: Record<string, any>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, any>, path: string): any {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  // 1. Check path prefix
  const pathname = window.location.pathname;
  const firstSegment = pathname.split('/')[1] as Locale;
  if (VALID_LOCALES.includes(firstSegment)) {
    return firstSegment;
  }

  // 2. Check cookie
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
  if (match && match[1] && VALID_LOCALES.includes(match[1] as Locale)) {
    return match[1] as Locale;
  }

  // 3. Check localStorage
  try {
    const saved = localStorage.getItem('app_locale') as Locale;
    if (saved && VALID_LOCALES.includes(saved)) {
      return saved;
    }
  } catch {
    // Ignore localStorage access restrictions
  }

  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Initialize locale on mount
  useEffect(() => {
    const initial = detectInitialLocale();
    setLocaleState(initial);
    setMounted(true);
  }, []);

  // Sync document attributes when locale changes
  useEffect(() => {
    const isRtl = locale === 'ur';
    const direction = isRtl ? 'rtl' : 'ltr';

    document.documentElement.lang = locale;
    document.documentElement.dir = direction;

    if (isRtl) {
      document.documentElement.classList.add('rtl-layout');
      document.body.classList.add('font-urdu');
    } else {
      document.documentElement.classList.remove('rtl-layout');
      document.body.classList.remove('font-urdu');
    }

    if (locale === 'bn') {
      document.body.classList.add('font-bengali');
      document.body.classList.remove('font-devanagari');
    } else if (locale === 'hi') {
      document.body.classList.add('font-devanagari');
      document.body.classList.remove('font-bengali');
    } else {
      document.body.classList.remove('font-bengali');
      document.body.classList.remove('font-devanagari');
    }
  }, [locale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (!VALID_LOCALES.includes(newLocale)) return;

      setLocaleState(newLocale);

      // Persist in cookie and localStorage
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; samesite=lax`;
      try {
        localStorage.setItem('app_locale', newLocale);
      } catch {
        // Ignore
      }

      // Keep public routes addressable under the selected locale.
      if (pathname) {
        router.replace(getLocalizedPath(pathname, newLocale));
      }
    },
    [pathname, router]
  );

  const t = useCallback(
    (keyPath: string, fallback?: string, variables?: Record<string, string | number>): string => {
      const activeDict = ALL_MESSAGES[locale] || ALL_MESSAGES.en;
      let val = getNestedValue(activeDict, keyPath);

      // Fallback to English if translation is missing in the chosen language
      if (val === undefined || val === null || val === '') {
        val = getNestedValue(ALL_MESSAGES.en, keyPath);
      }

      if (val === undefined || val === null || val === '') {
        val = fallback !== undefined ? fallback : keyPath;
      }

      let result = String(val);
      if (variables) {
        for (const [vKey, vVal] of Object.entries(variables)) {
          result = result.replace(new RegExp(`\\{${vKey}\\}`, 'g'), String(vVal));
        }
      }
      return result;
    },
    [locale]
  );

  const dir: 'ltr' | 'rtl' = locale === 'ur' ? 'rtl' : 'ltr';
  const messages = ALL_MESSAGES[locale] || ALL_MESSAGES.en;

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      dir,
      options: LANGUAGE_OPTIONS,
      t,
      messages,
    }),
    [locale, setLocale, dir, t, messages]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Provide a safe fallback if used outside provider
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      dir: 'ltr' as const,
      options: LANGUAGE_OPTIONS,
      t: (keyPath: string, fallback?: string) => fallback || keyPath,
      messages: ALL_MESSAGES.en,
    };
  }
  return context;
}

export function useTranslation() {
  return useLanguage();
}
