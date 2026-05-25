'use client';

import { CreditCard, Wallet, Landmark, Bitcoin, Landmark as Skrill, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentMethodsSection() {
  const methods = [
    { name: 'Visa / Mastercard', icon: CreditCard, color: 'blue' },
    { name: 'Wire Transfer', icon: Landmark, color: 'indigo' },
    { name: 'Digital Wallet', icon: Wallet, color: 'blue' },
    { name: 'Crypto Assets', icon: Bitcoin, color: 'indigo' },
    { name: 'Apple / Google Pay', icon: Smartphone, color: 'blue' },
    { name: 'Skrill / Neteller', icon: Landmark, color: 'indigo' },
  ];

  return (
    <section className="py-24 bg-[#020817] relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] block mb-4">Financial Gateway</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-tighter uppercase">Universal <span className="text-gray-500">Capital Flow.</span></h2>
          <p className="text-gray-500 mt-6 max-w-xl mx-auto text-sm leading-relaxed">Deposit and withdraw with ultimate flexibility. We support institutional wire transfers, instant card processing, and frontier digital assets.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {methods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative p-8 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all text-center"
              >
                <div className="flex justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{method.name}</p>
                
                {/* Status Dot */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                   <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[8px] font-black text-gray-500 uppercase">Live</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 py-6 border-t border-white/5">
           <div className="text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Instant Processing</p>
              <p className="text-xs font-bold text-white uppercase">99.2% rate</p>
           </div>
           <div className="text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Fee Structure</p>
              <p className="text-xs font-bold text-white uppercase">0% Commission</p>
           </div>
           <div className="text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Withdrawal Speed</p>
              <p className="text-xs font-bold text-white uppercase">&lt; 2 Hours</p>
           </div>
        </div>

      </div>
    </section>
  );
}
