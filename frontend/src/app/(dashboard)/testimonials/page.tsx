'use client';

import Card from '@/components/common/Card';
import { Heart, MessageSquare, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TestimonialsPage() {
  const { t } = useLanguage();

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ',
      text: t('testimonials.item1', 'Empire of Forex has transformed my trading journey. The signals are accurate and timely. Highly recommended!'),
      rating: 5,
      profit: 15000,
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelC',
      text: t('testimonials.item2', 'Best investment platform I\'ve used. The ROI has been consistent and the support team is always helpful.'),
      rating: 5,
      profit: 25000,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyR',
      text: t('testimonials.item3', 'I started with a small investment and now I\'m making excellent returns. The platform is user-friendly and secure.'),
      rating: 5,
      profit: 8500,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-black text-white">{t('testimonials.heroTitle', 'Testimonials')}</h1>
        <p className="text-slate-400 mt-1">{t('testimonials.subtitle', 'Success stories from our community')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} hover className="bg-[#0C0C10] border-white/5 text-white">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full border border-white/10"
              />
              <div>
                <p className="font-bold text-white">{testimonial.name}</p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4">{testimonial.text}</p>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl mb-4">
              <p className="text-emerald-400/80 text-xs uppercase font-bold tracking-wider">{t('investments.profitEarned', 'Total Profit')}</p>
              <p className="text-2xl font-black text-emerald-400">${testimonial.profit.toLocaleString()}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-white/10 rounded-xl hover:bg-white/5 text-slate-300 transition-colors">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold">Like</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-white/10 rounded-xl hover:bg-white/5 text-slate-300 transition-colors">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold">Reply</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
