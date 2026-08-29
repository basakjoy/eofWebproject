'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { LogoIcon } from './LogoIcon';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { name: 'Home', href: '/home' },
        { name: 'Pages', href: '/trading-signals' },
        { name: 'About', href: '/about' },
        { name: 'Features', href: '/services' },
        { name: 'Pricing', href: '/investment-plans' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'About Empire', href: '/about' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Support Portal', href: '/support' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms of Service', href: '/terms-of-service' },
        { name: 'Risk Disclaimer', href: '/disclaimer' },
      ]
    }
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
              Empowering traders worldwide with elite market intelligence, institutional-grade analytics, and secure business strategies.
            </p>
            <div className="flex gap-4 text-[#8E8E93]">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/empireforex"},
                { Icon: Instagram, href: "https://www.instagram.com/empireofforexworld/?next=%2F"},
                { Icon: Twitter, href: "http://x.com/OfEmpire38124"},
                { Icon: Youtube, href: "https://www.youtube.com/@EmpireofForex"}
              ].map((social, index) => (
                <Link key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 border border-white/5 hover:border-[#FF6B00]/40 hover:text-white transition-all">
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
             <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#FF6B00]"><Mail size={16} /></div>
             <div><p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Email Support</p><p className="text-xs font-bold text-white">support@empireofforex.com</p></div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#FF6B00]"><Phone size={16} /></div>
             <div><p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Direct Line</p><p className="text-xs font-bold text-white">+880-1804-351578</p></div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#FF6B00]"><MapPin size={16} /></div>
             <div><p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Global HQ</p><p className="text-xs font-bold text-white">Wall Street, New York, NY</p></div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#8E8E93]">
            © {currentYear} Empire of Forex International. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-[#8E8E93]">
            <span className="cursor-pointer hover:text-white transition-colors">Risk Warning</span>
            <span className="cursor-pointer hover:text-white transition-colors">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

