'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Link from 'next/link';
import { TrendingUp, BarChart3, Briefcase, BookOpen, Shield } from 'lucide-react';

const services = [
  {
    icon: TrendingUp,
    title: 'Trading Signals',
    description: 'Real-time forex signals with precise entry/exit points and risk management.',
    color: 'from-indigo-500 to-indigo-600',
    href: '/trading-signals',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Management',
    description: 'Manage multiple portfolios with advanced analytics and performance tracking.',
    color: 'from-purple-500 to-purple-600',
    href: '/services',
  },
  {
    icon: Briefcase,
    title: 'Fund Management',
    description: 'Secure fund management with transparent reporting and regular payouts.',
    color: 'from-pink-500 to-pink-600',
    href: '/services',
  },
  {
    icon: BookOpen,
    title: 'Education Resources',
    description: 'Comprehensive trading courses and market analysis resources for all levels.',
    color: 'from-green-500 to-green-600',
    href: '/services',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Advanced risk assessment tools and protective strategies for your capital.',
    color: 'from-blue-500 to-blue-600',
    href: '/services',
  },
];

export default function ServiceOverview() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold gradient-text mb-4">Our Services</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Everything you need for professional forex trading and investment management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {services.map((service) => (
          <Link key={service.title} href={service.href}>
            <Card hover className="h-full">
              <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
