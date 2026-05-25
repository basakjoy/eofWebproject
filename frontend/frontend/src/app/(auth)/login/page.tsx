'use client';

import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { LogoIcon } from '@/components/common/LogoIcon';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Column: Form Section */}
      <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col p-8 sm:p-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-10">
            <LogoIcon size={32} />
            <span className="text-xl font-black text-[#0c243c] tracking-tight uppercase">Empire of Forex</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Sign In</h1>
          <p className="text-sm text-gray-500 font-medium">
            Need an Empire of Forex account? <Link href="/register" className="text-gray-900 border-b-2 border-gray-900 font-bold ml-1">Create an Account</Link>
          </p>
        </div>

        <div className="flex-1">
          <LoginForm />
        </div>

        <div className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
          Copyright © 2025 Empire of Forex <br />
          International. All rights reserved.
        </div>
      </div>

      {/* Right Column: Hero Section with Floating Widgets */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        {/* Main Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/auth-hero.png")' }}
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 p-20 h-full flex flex-col justify-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md text-white drop-shadow-2xl"
          >
            <h2 className="text-4xl font-extrabold leading-tight mb-6">
              The Global Account that <br />
              connects you to the markets.
            </h2>
            <p className="text-xl font-medium opacity-90 mb-8 leading-normal">
              Manage your Forex trades with Empire <br />
              in a simple, fast, and secure way.
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center gap-3 text-xl font-bold border-b-4 border-white pb-1 hover:gap-6 transition-all"
            >
              Get Started Now <span>&gt;</span>
            </Link>
          </motion.div>

          {/* Floating Widgets */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Small Transfer Card */}
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-1/4 right-[40%] bg-white p-4 rounded-xl shadow-2xl pointer-events-auto"
            >
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-lg">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </motion.div>

            {/* Currency Selector Mockup Card */}
            <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
               className="absolute bottom-1/3 right-[10%] bg-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-72 pointer-events-auto"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Starting Currency</label>
                  <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-2">
                       <span className="text-lg">🇬🇧</span>
                       <span className="text-xs font-bold text-gray-700">GBP (United Kingdom)</span>
                    </div>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Destination Country</label>
                  <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-2">
                       <span className="text-lg">🇺🇸</span>
                       <span className="text-xs font-bold text-gray-700">USA (US Dollar)</span>
                    </div>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
