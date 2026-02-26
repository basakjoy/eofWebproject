'use client';

import { Star } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Portfolio Manager',
      company: 'Goldman Ventures',
      content:
        'Empire of Forex transformed our trading strategy. The signal accuracy is unmatched, and the platform\'s stability is exceptional.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Investment Director',
      company: 'Capital Growth Fund',
      content:
        'The analytics dashboard saved us countless hours. Real-time insights and accurate signals helped us increase ROI by 40%.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emma Thompson',
      role: 'Independent Trader',
      company: 'Self-employed',
      content:
        'Finally, a platform built for serious traders. The UX is intuitive, and the features are exactly what I needed to scale my operations.',
      rating: 5,
    },
  ];

  useEffect(() => {
    // Animate section header
    gsap.from('.testimonials-header', {
      scrollTrigger: {
        trigger: '.testimonials-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    // Animate testimonial cards with stagger
    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: '.testimonials-container',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
      stagger: 0.15,
    });
  }, []);

  return (
    <section className="py-32 px-6 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 testimonials-header">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">Testimonials</p>
          <h2 className="text-7xl md:text-8xl font-black text-white leading-tight max-w-3xl">
            Trusted by Professionals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 testimonials-container">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card bg-gray-950 border border-gray-800 hover:border-blue-600 p-8 rounded-xl transition-all duration-300 group hover:shadow-lg hover:shadow-blue-600/20"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">
                "{testimonial.content}"
              </p>

              <div>
                <p className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
                <p className="text-gray-600 text-xs">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
