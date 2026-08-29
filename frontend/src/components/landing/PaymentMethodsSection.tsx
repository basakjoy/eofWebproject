'use client';

import { motion } from 'framer-motion';

export default function PaymentMethodsSection() {
  const languages = [
    { country: 'Sweden', code: 'se' },
    { country: 'United Kingdom', code: 'gb' },
    { country: 'Germany', code: 'de' },
    { country: 'Italian', code: 'it' },
    { country: 'American', code: 'us' },
    { country: 'Indonesian', code: 'id' },
    { country: 'Japanese', code: 'jp' },
    { country: 'Czech', code: 'cz' },
    { country: 'Russian', code: 'ru' },
    { country: 'Europe', code: 'eu' },
    { country: 'Korean', code: 'kr' },
  ];

  return (
    <section className="py-24 bg-[#050508] relative z-10">
      <div className="max-w-site mx-auto px-6 text-center space-y-12">
        
        {/* Top Header */}
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            <span>Languages</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-tight">
            Customer Support in 18 Languages
          </h2>
        </div>

        {/* Flag Pill Chips Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto pt-4">
          {languages.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#111116] border border-white/10 text-xs text-white hover:border-[#FF6B00]/50 hover:bg-[#16161c] transition-all cursor-pointer shadow-sm group"
            >
              <img 
                src={`https://flagcdn.com/w40/${item.code}.png`} 
                alt={`${item.country} flag`}
                className="w-5 h-3.5 object-cover rounded-sm shadow-xs group-hover:scale-110 transition-transform" 
              />
              <span className="font-medium">{item.country}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}


