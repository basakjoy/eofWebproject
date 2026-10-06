'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Lock, Eye, FileText, Globe, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030305] via-[#08080C] to-[#030305] text-slate-100 font-poppins selection:bg-fiery-orange selection:text-white">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#0C0C10] via-[#14141E] to-[#0C0C10] pt-40 py-16 px-4 border-b border-white/10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-xs font-bold text-[#FF6B00] mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>LEGAL &amp; PRIVACY</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tight text-white">
            {t('privacyPolicy.title', 'Privacy Policy')}
          </h1>
          <p className="text-sm font-semibold text-zinc-400">
            {t('privacyPolicy.lastUpdated', 'Last Updated: April 2026')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Section 1: Introduction */}
        <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#FF6B00]" />
            {t('privacyPolicy.sec1Title', '1. Introduction')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {t(
              'privacyPolicy.sec1Text1',
              'Welcome to Empire of Forex ("we," "us," "our," or the "Company"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and trading platform.'
            )}
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {t(
              'privacyPolicy.sec1Text2',
              'Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our service.'
            )}
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <Eye className="w-6 h-6 text-[#FF6B00]" />
            {t('privacyPolicy.sec2Title', '2. Information We Collect')}
          </h2>
          
          <div className="space-y-3">
            <h3 className="text-base font-bold text-amber-400">
              {t('privacyPolicy.sec2Sub1', '2.1 Personal Information You Provide')}
            </h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-2 shrink-0" />
                <span>{t('privacyPolicy.sec2Item1', 'Account Registration: Name, email address, phone number, and password.')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-2 shrink-0" />
                <span>{t('privacyPolicy.sec2Item2', 'Financial Information: Payment card information, investment amounts, and transaction history.')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-2 shrink-0" />
                <span>{t('privacyPolicy.sec2Item3', 'Identity Verification: Government-issued ID, proof of address, and verification documents.')}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5">
            <h3 className="text-base font-bold text-amber-400">
              {t('privacyPolicy.sec2Sub2', '2.2 Information Collected Automatically')}
            </h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-2 shrink-0" />
                <span>{t('privacyPolicy.sec2Item4', 'Device Information: Operating system, browser type, and IP address.')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-2 shrink-0" />
                <span>{t('privacyPolicy.sec2Item5', 'Usage Data: Pages visited, interaction patterns, and performance metrics.')}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: How We Use Your Information */}
        <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#FF6B00]" />
            {t('privacyPolicy.sec3Title', '3. How We Use Your Information')}
          </h2>
          <p className="text-sm text-zinc-400">
            {t('privacyPolicy.sec3Desc', 'We use the collected information for:')}
          </p>
          <ul className="space-y-2.5 text-sm text-zinc-300">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span>{t('privacyPolicy.sec3Item1', 'Providing and maintaining our trading platform and services.')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span>{t('privacyPolicy.sec3Item2', 'Processing deposits, payouts, and financial transactions.')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span>{t('privacyPolicy.sec3Item3', 'Sending real-time trading signals and security alerts.')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span>{t('privacyPolicy.sec3Item4', 'Complying with regulatory anti-money laundering (AML) and KYC requirements.')}</span>
            </li>
          </ul>
        </section>

        {/* Section 4 & 5: Sharing & Data Security */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {t('privacyPolicy.sec4Title', '4. Information Sharing')}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {t('privacyPolicy.sec4Desc', 'We do not sell your personal information. We only share data with regulated payment processors, cloud infrastructure partners, and legal authorities when required by law.')}
            </p>
          </section>

          <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              {t('privacyPolicy.sec5Title', '5. Data Security')}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {t('privacyPolicy.sec5Desc', 'We implement 256-bit SSL/TLS encryption, secure server architecture, and strict access controls to safeguard your personal data.')}
            </p>
          </section>
        </div>

        {/* Section 6 & 7: User Rights & Cookies */}
        <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-xl font-black text-white">
            {t('privacyPolicy.sec6Title', '6. Your Rights')}
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {t('privacyPolicy.sec6Desc', 'You have the right to access, rectify, or request deletion of your personal data at any time by contacting our support team at support@empireofforex.com.')}
          </p>

          <div className="pt-4 border-t border-white/5 space-y-2">
            <h3 className="text-base font-bold text-white">
              {t('privacyPolicy.sec7Title', '7. Cookies Policy')}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {t('privacyPolicy.sec7Desc', 'We use essential cookies to maintain your authenticated session and remember your language and display preferences.')}
            </p>
          </div>
        </section>

        {/* Section 8: Contact */}
        <section className="bg-gradient-to-br from-[#0C0C10] to-[#161622] border border-[#FF6B00]/30 rounded-3xl p-8 space-y-4 text-center">
          <Mail className="w-8 h-8 text-[#FF6B00] mx-auto" />
          <h2 className="text-xl font-black text-white">
            {t('privacyPolicy.sec8Title', '8. Contact Us')}
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            {t('privacyPolicy.sec8Desc', 'For questions regarding this policy, contact our Data Protection Officer at support@empireofforex.com.')}
          </p>
          <a
            href="mailto:support@empireofforex.com"
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white font-bold text-xs shadow-lg"
          >
            support@empireofforex.com
          </a>
        </section>
      </div>
    </div>
  );
}
