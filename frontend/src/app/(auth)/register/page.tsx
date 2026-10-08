'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import RegisterForm from '@/components/auth/RegisterForm';
import { LogoIcon } from '@/components/common/LogoIcon';
import { useLanguage, getLocalizedPath } from '@/context/LanguageContext';

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_092641_de52eb87-daf2-41db-92cb-7a56eae012a5.mp4';

const stagger = (delay: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: delay } },
});

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const iconProps = {
  className: 'h-5 w-5',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
};

export default function RegisterPage() {
  const { t, locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : 'hidden';

  const benefits = [
    {
      title: t('auth.benefitSignalsTitle', 'Trading signals'),
      text: t('auth.benefitSignalsText', 'Clear, timely setups you can act on.'),
      icon: (
        <svg {...iconProps}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M15 7h6v6" />
        </svg>
      ),
    },
    {
      title: t('auth.benefitAnalysisTitle', 'Real-time market analysis'),
      text: t('auth.benefitAnalysisText', 'Follow the market as it moves, in one place.'),
      icon: (
        <svg {...iconProps}>
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
      ),
    },
    {
      title: t('auth.benefitPortfolioTitle', 'Portfolio management'),
      text: t('auth.benefitPortfolioText', 'Track your investments with a clear overview.'),
      icon: (
        <svg {...iconProps}>
          <path d="M3 8h18v11H3z" />
          <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left column: form */}
      <div className="relative flex w-full flex-shrink-0 flex-col justify-between p-8 sm:p-12 lg:w-[500px] xl:w-[540px]">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl"
        />

        <div className="relative">
          <Link
            href={getLocalizedPath('/home', locale)}
            className="mb-12 inline-flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
          >
            <LogoIcon size={32} />
            <span className="text-xl font-black uppercase tracking-tight text-[#0c243c]">Empire of Forex</span>
          </Link>

          <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900">
            {t('auth.createAccount', 'Create Account')}
          </h1>
          <p className="text-sm font-medium text-gray-500">
            {t('auth.alreadyHaveAccount', 'Already have an Empire of Forex account?')}{' '}
            <Link
              href={getLocalizedPath('/login', locale)}
              className="ml-1 border-b-2 border-orange-500 font-bold text-gray-900 transition-colors hover:text-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
            >
              {t('auth.signIn', 'Sign In')}
            </Link>
          </p>
        </div>

        <div className="relative my-8">
          <RegisterForm />
          <p className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <svg
              className="h-4 w-4 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
            {t('auth.secureSignup', 'Your details are sent over an encrypted connection.')}
          </p>
        </div>

        <p className="relative text-center text-xs leading-relaxed text-gray-400">
          Copyright © 2026 Empire of Forex International. {t('footer.rightsReserved', 'All rights reserved.')}
        </p>
      </div>

      {/* Right column: hero */}
      <div className="relative hidden flex-1 overflow-hidden bg-[#0a1624] lg:block">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO_URL}
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        {/* Even tint plus top/bottom fade so the text stays readable over any frame of the video */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#0a1624]/80 via-transparent to-[#0a1624]/90"
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-14 xl:p-20">
          <motion.div
            variants={stagger(0.15)}
            initial={initial}
            animate="show"
            className="max-w-xl"
          >
            <motion.h2
              variants={rise}
              className="text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-5xl"
            >
              {t('auth.registerHeroTitle', 'Start managing your finances today')}
            </motion.h2>
            <motion.p variants={rise} className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
              {t(
                'auth.registerHeroSubtitle',
                'Join Empire of Forex and access the best trading and investment tools in the global market.'
              )}
            </motion.p>
          </motion.div>

          <motion.ul
            variants={stagger(0.6)}
            initial={initial}
            animate="show"
            className="max-w-xl divide-y divide-white/10 border-t border-white/10"
          >
            {benefits.map((b) => (
              <motion.li key={b.title} variants={rise} className="flex items-center gap-4 py-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400 ring-1 ring-orange-400/30">
                  {b.icon}
                </span>
                <span>
                  <span className="block font-semibold text-white">{b.title}</span>
                  <span className="block text-sm text-white/60">{b.text}</span>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}