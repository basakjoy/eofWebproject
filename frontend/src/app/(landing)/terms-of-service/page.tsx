'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldAlert, FileText, Scale, UserCheck, AlertTriangle, Wallet, Ban, PowerOff, Shield, Mail } from 'lucide-react';

export default function TermsOfService() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030305] via-[#08080C] to-[#030305] text-slate-100 font-poppins selection:bg-fiery-orange selection:text-white">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#0C0C10] via-[#14141E] to-[#0C0C10] pt-40 py-16 px-4 border-b border-white/10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-xs font-bold text-[#FF6B00] mb-4">
            <Scale className="w-4 h-4" />
            <span>LEGAL AGREEMENT</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tight text-white">
            {t('termsOfService.title', 'Terms of Service')}
          </h1>
          <p className="text-sm font-semibold text-zinc-400">
            {t('termsOfService.lastUpdated', 'Last Updated: April 2026')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
        
        {/* Risk Warning Box */}
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-1" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-rose-300">
              {t('termsOfService.sec4Title', '4. Risk Disclaimer & No Financial Advice')}
            </p>
            <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
              {t('termsOfService.sec4Warning', 'Trading foreign exchange and financial contracts carries substantial risk of loss. Past performance does not guarantee future results.')}
            </p>
          </div>
        </div>

        {/* Section 1: Agreement to Terms */}
        <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#FF6B00]" />
            {t('termsOfService.sec1Title', '1. Agreement to Terms')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {t('termsOfService.sec1Desc', 'By accessing and using Empire of Forex, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.')}
          </p>
        </section>

        {/* Section 2: Eligibility */}
        <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-[#FF6B00]" />
            {t('termsOfService.sec2Title', '2. Eligibility')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {t('termsOfService.sec2Desc', 'You must be at least 18 years of age and legally permitted to trade financial instruments in your country of residence.')}
          </p>
        </section>

        {/* Section 3: User Accounts */}
        <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#FF6B00]" />
            {t('termsOfService.sec3Title', '3. User Accounts')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {t('termsOfService.sec3Desc', 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.')}
          </p>
        </section>

        {/* Section 4: Educational Nature */}
        <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {t('termsOfService.sec4Title', '4. Risk Disclaimer & No Financial Advice')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {t('termsOfService.sec4Desc', 'Signals, market analysis, and educational materials provided by Empire of Forex are for informational purposes and should not be construed as individualized investment advice.')}
          </p>
        </section>

        {/* Section 5 & 6: Deposits/Withdrawals & Prohibited Activities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              {t('termsOfService.sec5Title', '5. Deposits and Withdrawals')}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {t('termsOfService.sec5Desc', 'Deposits and withdrawal requests are processed according to our standard settlement timelines. Users must verify their identity before withdrawing funds.')}
            </p>
          </section>

          <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-400" />
              {t('termsOfService.sec6Title', '6. Prohibited Activities')}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {t('termsOfService.sec6Desc', 'Users may not engage in market manipulation, unauthorized automated scraping, system exploitation, or abusive conduct.')}
            </p>
          </section>
        </div>

        {/* Section 7 & 8: Termination & Liability */}
        <section className="bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <PowerOff className="w-5 h-5 text-amber-400" />
            {t('termsOfService.sec7Title', '7. Termination')}
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {t('termsOfService.sec7Desc', 'We reserve the right to suspend or terminate accounts that violate our security policies or legal requirements.')}
          </p>

          <div className="pt-4 border-t border-white/5 space-y-2">
            <h3 className="text-base font-bold text-white">
              {t('termsOfService.sec8Title', '8. Limitation of Liability')}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {t('termsOfService.sec8Desc', 'Empire of Forex shall not be liable for any indirect, incidental, or trading losses incurred while using our platform.')}
            </p>
          </div>
        </section>

        {/* Contact / Legal */}
        <section className="bg-gradient-to-br from-[#0C0C10] to-[#161622] border border-[#FF6B00]/30 rounded-3xl p-8 space-y-4 text-center">
          <Mail className="w-8 h-8 text-[#FF6B00] mx-auto" />
          <h2 className="text-xl font-black text-white">
            {t('termsOfService.sec10Title', '10. Contact Information')}
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            {t('termsOfService.sec10Desc', 'For legal inquiries, please contact legal@empireofforex.com.')}
          </p>
          <a
            href="mailto:legal@empireofforex.com"
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white font-bold text-xs shadow-lg"
          >
            legal@empireofforex.com
          </a>
        </section>

      </div>
    </div>
  );
}
