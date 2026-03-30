'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Link from 'next/link';
import { Award, Users, Target, TrendingUp } from 'lucide-react';

const teamMembers = [
  {
    name: 'John Smith',
    role: 'Founder & CEO',
    image: '👨‍💼',
    bio: '15+ years in forex trading and financial markets',
  },
  {
    name: 'Sarah Johnson',
    role: 'Chief Trader',
    image: '👩‍💼',
    bio: 'Expert in technical analysis with proven track record',
  },
  {
    name: 'Mike Chen',
    role: 'Risk Manager',
    image: '👨‍💼',
    bio: 'Specialized in portfolio risk management',
  },
  {
    name: 'Emma Davis',
    role: 'Head of Education',
    image: '👩‍🏫',
    bio: 'Trading educator with 10+ years experience',
  },
];

const trackRecord = [
  { year: '2020', aum: '$10M', returns: '8.5%' },
  { year: '2021', aum: '$35M', returns: '11.2%' },
  { year: '2022', aum: '$80M', returns: '9.8%' },
  { year: '2023', aum: '$150M', returns: '13.5%' },
  { year: '2024', aum: '$250M', returns: '12.8%' },
];

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold gradient-text mb-6">About Empire of Forex</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Leading the forex trading industry with innovation, transparency, and consistent results since 2020.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="w-full px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card>
              <h2 className="text-4xl font-bold gradient-text mb-6">Our Story</h2>
              <p className="text-gray-300 mb-4">
                Founded in 2020, Empire of Forex emerged from a vision to democratize professional forex trading. Our founders, with combined experience of 50+ years in financial markets, created a platform that levels the playing field for retail traders.
              </p>
              <p className="text-gray-300 mb-4">
                What started as a small team of 3 traders has grown to a community of over 12,000 active traders managing $250M+ in assets.
              </p>
              <p className="text-gray-300">
                We believe in transparency, education, and consistent returns. Every decision we make is focused on our traders' success.
              </p>
            </Card>
            
            <Card hover className="h-full">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Award className="w-12 h-12 text-indigo-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Industry Award Winner</h3>
                    <p className="text-gray-400 text-sm">Best Forex Platform 2023</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="w-12 h-12 text-purple-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-white">12,000+ Traders</h3>
                    <p className="text-gray-400 text-sm">Growing community worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Target className="w-12 h-12 text-pink-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-white">87% Win Rate</h3>
                    <p className="text-gray-400 text-sm">Consistent performance</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold gradient-text mb-4">Our Team</h2>
            <p className="text-xl text-gray-400">Industry experts dedicated to your success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name} hover>
                <div className="text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-indigo-400 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-3xl font-bold gradient-text mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To empower retail traders with professional-grade tools, education, and signals, enabling them to build consistent wealth through forex trading. We're committed to transparency, fairness, and continuous innovation.
              </p>
            </Card>
            
            <Card>
              <h3 className="text-3xl font-bold gradient-text mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To become the world's most trusted forex trading platform, where every trader has access to institutional-quality research, signals, and risk management tools regardless of their capital size.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Track Record */}
      <section className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold gradient-text mb-4">Track Record</h2>
            <p className="text-xl text-gray-400">Growing AUM and consistent returns</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {trackRecord.map((record) => (
            <Card key={record.year} hover>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-400 mb-2">{record.year}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-gray-400 text-sm">AUM</p>
                    <p className="text-lg font-bold text-white">{record.aum}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Returns</p>
                    <p className="text-lg font-bold text-green-400">{record.returns}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
          <Link href="/register">
            <Button variant="gradient" size="lg">
              Start Trading With Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
