'use client';

import { Mail, Phone, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: '',
    budget: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  useEffect(() => {
    gsap.from('.cta-header', {
      scrollTrigger: { trigger: '.cta-header', start: 'top 80%', once: true },
      duration: 0.8, opacity: 0, y: 30,
    });
    gsap.from('.cta-content', {
      scrollTrigger: { trigger: '.cta-content', start: 'top 80%', once: true },
      duration: 0.8, opacity: 0, x: -40,
    });
    gsap.from('.cta-form', {
      scrollTrigger: { trigger: '.cta-form', start: 'top 80%', once: true },
      duration: 0.8, opacity: 0, x: 40,
    });
    gsap.from('.contact-item', {
      scrollTrigger: { trigger: '.contact-items', start: 'top 80%', once: true },
      duration: 0.8, opacity: 0, y: 20, stagger: 0.1,
    });
    gsap.from('.form-field', {
      scrollTrigger: { trigger: '.cta-form', start: 'top 80%', once: true },
      duration: 0.6, opacity: 0, y: 15, stagger: 0.05,
    });
  }, []);

  return (
    <section className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 lg:gap-24 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10 cta-content">
            <div className="cta-header">
              <p className="text-blue-400 font-medium text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6">
                {t('cta.badge', 'Get Started')}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight">
                {t('cta.title', 'Ready to Transform Your Trading?')}
              </h2>
            </div>

            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-light">
              {t('cta.description', 'Our studio is a safe space where traders scale and shine. Join thousands of successful investors who\'ve already experienced the difference.')}
            </p>

            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 contact-items">
              <div className="contact-item flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center hover:bg-blue-600/40 transition-colors flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">{t('contact.email', 'Email')}</p>
                  <p className="text-white font-semibold">hello@empireofforex.com</p>
                </div>
              </div>
              <div className="contact-item flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center hover:bg-blue-600/40 transition-colors">
                  <Phone className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{t('contact.phone', 'Phone')}</p>
                  <p className="text-white font-semibold">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center hover:bg-blue-600/40 transition-colors">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{t('contact.liveChat', 'Live Chat')}</p>
                  <p className="text-white font-semibold">{t('contact.liveChatAvail', 'Available 24/7')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-8 lg:p-12 cta-form">
            <h3 className="text-2xl font-bold text-white mb-6">{t('cta.formTitle', 'Tell Us About Your Project')}</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-field">
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.fullName', 'Full Name')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder={t('auth.namePlaceholder', 'Your name')}
                  required
                />
              </div>

              <div className="form-field">
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.email', 'Email Address')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-field">
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('cta.interestedIn', "I'm Interested In")}</label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="">{t('common.select', 'Select...')}</option>
                    <option value="signals">{t('nav.signals', 'Trading Signals')}</option>
                    <option value="portfolio">{t('services.portfolio', 'Portfolio Management')}</option>
                    <option value="analysis">{t('dashboard.marketAnalysis', 'Market Analysis')}</option>
                    <option value="premium">{t('plans.premium', 'Premium Plan')}</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('cta.budget', 'Budget (USD)')}</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="">{t('common.select', 'Select...')}</option>
                    <option value="5k">≤ $5,000</option>
                    <option value="20k">$10K - $20K</option>
                    <option value="50k">$30K - $50K</option>
                    <option value="100k">&gt;$100K</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('cta.tellUsMore', 'Tell us more')}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  placeholder={t('cta.messagePlaceholder', 'Share details about your project...')}
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/50 form-field"
              >
                {t('cta.submitButton', 'Submit Request')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
