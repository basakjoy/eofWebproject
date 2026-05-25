'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { LogoIcon } from './LogoIcon';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { name: 'Home', href: '/home' },
        { name: 'Trading Signals', href: '/trading-signals' },
        { name: 'Investment Plans', href: '/investment-plans' },
        { name: 'Market Analysis', href: '/dashboard/market-analysis' },
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
    <footer className="relative bg-[#020817] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Decorative Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Main Footer Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <LogoIcon size={40} />
              <span className="text-2xl font-black text-white tracking-tighter uppercase">Empire of Forex</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Empowering traders worldwide with elite market intelligence, institutional-grade signals, and secure investment strategies.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="https://www.facebook.com/empireofforex, https://www.instagram.com/empireofforex, https://www.youtube.com/empireofforex, https://www.twitter.com/empireofforex" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{column.title}</h4>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-500 hover:text-blue-400 text-sm transition-colors block">
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
        <div className="grid md:grid-cols-3 gap-8 py-10 border-y border-white/5 mb-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-500"><Mail size={20} /></div>
             <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email Us</p><p className="text-sm font-bold text-white">support@empireofforex.com</p></div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-500"><Phone size={20} /></div>
             <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Call Center</p><p className="text-sm font-bold text-white">+880-1804-351578</p></div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-500"><MapPin size={20} /></div>
             <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global HQ</p><p className="text-sm font-bold text-white">Wall Street, New York, NY</p></div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em]">
            © {currentYear} Empire of Forex International. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
            <span className="cursor-pointer hover:text-white transition-colors">Risk Warning</span>
            <span className="cursor-pointer hover:text-white transition-colors">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
