'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Portfolio Manager',
      company: 'Institutional Assets',
      content: 'Empire of Forex transformed our trading strategy. The signal accuracy is unmatched, and the platform structural integrity is exceptional.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Investment Director',
      company: 'Capital Growth Fund',
      content: 'The analytics dashboard saved us countless hours. Real-time insights and accurate signals helped us increase ROI by 40% in two quarters.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    {
      id: 3,
      name: 'Emma Thompson',
      role: 'Independent Wealth',
      company: 'Family Office',
      content: 'Finally, a platform built for serious traders. The UX is intuitive, and the features are exactly what I needed to scale my global operations.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
    },
  ];

  return (
    <section className="py-24 bg-[#020817] relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] block mb-4">Elite Community</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4 uppercase tracking-tighter">Voice of <span className="text-gray-500">Excellence.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-10 rounded-[40px] bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all group overflow-hidden"
            >
              <Quote className="absolute top-10 right-10 text-white/5 group-hover:text-blue-500/20 transition-colors" size={60} />
              
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" className="text-blue-500" />)}
              </div>

              <p className="text-lg text-gray-300 leading-relaxed mb-8 relative z-10">"{t.content}"</p>

              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border border-white/10" />
                <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-widest">{t.name}</h4>
                   <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{t.role} — {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
