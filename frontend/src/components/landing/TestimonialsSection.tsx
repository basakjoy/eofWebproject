'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Portfolio Manager',
      company: 'Institutional Assets',
      content: t('testimonials.item1', 'Empire of Forex transformed our trading strategy. The signal accuracy is unmatched, and the platform structural integrity is exceptional.'),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Investment Director',
      company: 'Capital Growth Fund',
      content: t('testimonials.item2', 'The analytics dashboard saved us countless hours. Real-time insights and accurate signals helped us increase ROI by 40% in two quarters.'),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    {
      id: 3,
      name: 'Emma Thompson',
      role: 'Independent Wealth',
      company: 'Family Office',
      content: t('testimonials.item3', 'Finally, a platform built for serious traders. The UX is intuitive, and the features are exactly what I needed to scale my global operations.'),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
    },
  ];

  return (
    <section className="py-24 bg-[#020817] relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-xs font-black text-[#FF6B00] uppercase tracking-[0.4em] block mb-4">
            {t('testimonials.heroBadge', 'Elite Community')}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4 uppercase tracking-tighter">
            {t('testimonials.heroTitle', 'Voice of Excellence.')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-10 rounded-[40px] bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all group overflow-hidden"
            >
              <Quote className="absolute top-10 right-10 text-white/5 group-hover:text-[#FF6B00]/20 transition-colors" size={60} />
              
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" className="text-[#FF6B00]" />)}
              </div>

              <p className="text-lg text-gray-300 leading-relaxed mb-8 relative z-10">"{item.content}"</p>

              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full border border-white/10" />
                <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-widest">{item.name}</h4>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.role} — {item.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
