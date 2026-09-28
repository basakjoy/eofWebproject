'use client';

import { Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function BrokerTrustSection() {
  const { t } = useLanguage();

  const items = [
    {
      num: '01',
      title: t('whyChooseUs.feature1Title', 'Quick and Reliable Payouts'),
      desc: t(
        'whyChooseUs.feature1Desc',
        'No waiting games. Our system is optimized for speed — ensuring your payouts land fast, without unnecessary delays or manual processing.'
      ),
      icon: Zap,
    },
    {
      num: '02',
      title: t('whyChooseUs.feature2Title', 'Up to 90% Profit Split'),
      desc: t(
        'whyChooseUs.feature2Desc',
        'Retain the vast majority of your hard-earned trading gains with our industry-leading profit sharing tier structure.'
      ),
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-24 bg-[#050508] relative z-10">
      <div className="max-w-site mx-auto px-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight">
            {t('whyChooseUs.title', 'Why Choose Us?')}
          </h2>
          <p className="text-sm text-[#8E8E93] max-w-md font-normal">
            {t('whyChooseUs.subtitle', 'Backed by a suite of powerful tools at your fingertips.')}
          </p>
        </div>

        {/* Feature List Items */}
        <div className="space-y-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-[#111116]/60 border border-white/10 hover:border-[#FF6B00]/40 transition-all group relative overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Number & Title */}
                <div className="md:col-span-6 flex items-center gap-6">
                  <span className="text-xs font-semibold text-[#8E8E93] tracking-widest font-mono">
                    {item.num}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-medium text-white group-hover:text-[#FF6B00] transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Content & Icon Badge */}
                <div className="md:col-span-6 flex items-start justify-between gap-4">
                  <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed max-w-md font-normal">
                    {item.desc}
                  </p>

                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#FF3D00] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-[#FF6B00]/20">
                    <item.icon size={18} />
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

