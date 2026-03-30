'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { TrendingUp, Briefcase, BarChart3, BookOpen, Shield, CheckCircle2 } from 'lucide-react';

const serviceDetails = [
  {
    icon: TrendingUp,
    title: 'Trading Signals',
    description: 'Real-time forex signals with precise entry/exit points and risk management.',
    color: 'from-indigo-500 to-indigo-600',
    benefits: [
      'Real-time signal delivery',
      'Precise entry/exit points',
      'Risk/reward calculations',
      'Multiple timeframe analysis',
      'Signal accuracy history',
    ],
  },
  {
    icon: Briefcase,
    title: 'Fund Management',
    description: 'Professional fund management with transparent reporting and secure operations.',
    color: 'from-purple-500 to-purple-600',
    benefits: [
      'Professional traders manage your capital',
      'Transparent monthly reports',
      'Flexible investment amounts',
      'Regular payouts & withdrawals',
      'Risk-adjusted returns',
    ],
  },
  {
    icon: BarChart3,
    title: 'Portfolio Management',
    description: 'Comprehensive portfolio tracking and optimization tools.',
    color: 'from-pink-500 to-pink-600',
    benefits: [
      'Multi-asset portfolio tracking',
      'Performance analytics',
      'Risk assessment tools',
      'Rebalancing strategies',
      'Custom dashboards',
    ],
  },
  {
    icon: BookOpen,
    title: 'Education Resources',
    description: 'Comprehensive trading courses and market analysis education.',
    color: 'from-green-500 to-green-600',
    benefits: [
      'Beginner to advanced courses',
      'Live webinars & training',
      'Trading strategies guide',
      'Market analysis tutorials',
      'Community forums',
    ],
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Advanced tools to protect and optimize your trading capital.',
    color: 'from-blue-500 to-blue-600',
    benefits: [
      'Position sizing calculator',
      'Stop loss optimization',
      'Portfolio risk analysis',
      'Hedging strategies',
      'Capital preservation tools',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold gradient-text mb-6">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive trading solutions designed for your success
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-12">
            {serviceDetails.map((service, idx) => (
              <div key={service.title} className={`grid md:grid-cols-2 gap-8 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <Card hover>
                  <div className={`bg-gradient-to-br ${service.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <service.icon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">{service.title}</h2>
                  <p className="text-gray-300 text-lg mb-6">{service.description}</p>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Card>

                <Card>
                  <h3 className="text-2xl font-bold text-white mb-6">Key Features</h3>
                  <ul className="space-y-4">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold gradient-text mb-4">Service Tiers</h2>
            <p className="text-xl text-gray-400">Choose the services that fit your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Basic', price: 'Free', services: ['Trading Signals', 'Education Resources'] },
              { name: 'Pro', price: '$99/mo', services: ['All Basic', 'Portfolio Management', 'Risk Management'] },
              { name: 'Premium', price: 'Custom', services: ['All Services', 'Fund Management', 'Priority Support'] },
            ].map((tier) => (
            <Card key={tier.name} hover className={tier.name === 'Pro' ? 'border-2 border-indigo-500/50' : ''}>
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-indigo-400 text-xl font-bold mb-6">{tier.price}</p>
              <ul className="space-y-3 mb-8">
                {tier.services.map((svc) => (
                  <li key={svc} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    {svc}
                  </li>
                ))}
              </ul>
              <Button variant={tier.name === 'Pro' ? 'gradient' : 'outline'} className="w-full">
                {tier.name === 'Premium' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </Card>
            ))}
            </div>
        </div>
      </section>
    </div>
  );
}
