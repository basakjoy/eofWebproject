'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { LogoIcon } from './LogoIcon';
import { getLocalizedPath, useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { locale, t } = useLanguage();

  const footerLinks = [
    {
      title: t('footer.navigation', 'Navigation'),
      links: [
        { name: t('nav.home', 'Home'), href: getLocalizedPath('/home', locale) },
        { name: t('nav.signals', 'Trading Signals'), href: getLocalizedPath('/trading-signals', locale) },
        { name: t('nav.about', 'About'), href: getLocalizedPath('/about', locale) },
        { name: t('nav.services', 'Services'), href: getLocalizedPath('/services', locale) },
        { name: t('nav.plans', 'Pricing'), href: getLocalizedPath('/investment-plans', locale) },
      ],
    },
    {
      title: t('footer.support', 'Support'),
      links: [
        { name: t('footer.contactUs', 'Contact Us'), href: '/contact' },
        { name: t('footer.about', 'About Empire'), href: getLocalizedPath('/about', locale) },
        { name: t('footer.faq', 'FAQ'), href: '/faq' },
        { name: t('footer.supportPortal', 'Support Portal'), href: '/support' },
      ],
    },
    {
      title: t('footer.legal', 'Legal'),
      links: [
        { name: t('footer.privacyPolicy', 'Privacy Policy'), href: getLocalizedPath('/privacy-policy', locale) },
        { name: t('footer.termsOfService', 'Terms of Service'), href: getLocalizedPath('/terms-of-service', locale) },
        { name: t('footer.riskDisclaimer', 'Risk Disclaimer'), href: '/disclaimer' },
      ],
    },
  ];

  return (
    <footer className="relative bg-[#050508] pt-16 sm:pt-20 pb-28 sm:pb-12 overflow-hidden border-t border-white/5">
      {/* Decorative Fiery Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF5500]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-site mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Footer Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <LogoIcon size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight uppercase">Empire of Forex</span>
            </div>
            <p className="text-xs text-[#8E8E93] max-w-sm leading-relaxed font-normal">
              {t(
                'footer.brandDesc',
                'Empowering traders worldwide with elite market intelligence, institutional-grade analytics, and secure business strategies.'
              )}
            </p>
            <div className="flex gap-4 text-[#8E8E93]">
              {[
                { Icon: Facebook, href: 'https://www.facebook.com/empireforex' },
                { Icon: Instagram, href: 'https://www.instagram.com/empireofforexworld/?next=%2F' },
                { Icon: Twitter, href: 'http://x.com/OfEmpire38124' },
                { Icon: Youtube, href: 'https://www.youtube.com/@EmpireofForex' },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 border border-white/5 hover:border-[#FF6B00]/40 hover:text-white transition-all"
                >
                  <social.Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h4 className="text-white font-semibold mb-4 tracking-wider text-xs uppercase">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-xs text-[#8E8E93] hover:text-white transition-colors block">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter / Contact Row */}
        <div className="grid md:grid-cols-3 gap-6 py-8 border-y border-white/5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#FF6B00]">
              <Mail size={16} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Email Support</p>
              <p className="text-xs font-bold text-white">support@empireofforex.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#FF6B00]">
              <Phone size={16} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Direct Line</p>
              <p className="text-xs font-bold text-white">+880-1804-351578</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#FF6B00]">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Global HQ</p>
              <p className="text-xs font-bold text-white">Wall Street, New York, NY</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#8E8E93]">
            © {currentYear} Empire of Forex International. {t('footer.rightsReserved', 'All rights reserved.')}
          </p>
          <div className="flex gap-6 text-xs text-[#8E8E93]">
            <Link href={getLocalizedPath('/disclaimer', locale)} className="hover:text-white transition-colors">
              {t('footer.riskDisclaimer', 'Risk Disclaimer')}
            </Link>
            <Link href={getLocalizedPath('/privacy-policy', locale)} className="hover:text-white transition-colors">
              {t('footer.privacyPolicy', 'Privacy Policy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
