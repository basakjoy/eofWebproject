'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { 
  CheckCircle2, 
  Star, 
  Globe, 
  ShieldCheck, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Award
} from 'lucide-react';
import { brokersApi } from '@/lib/brokersApi';

export default function BrokersPromotionalPage() {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const result = await brokersApi.getAllBrokers({ limit: 20 });
        if (result.success && result.data) {
          setBrokers(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch brokers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  return (
    <div className="w-full pt-16 min-h-screen ">
      {/* Hero Section */} 
      <section className="w-full px-4 py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[80px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white border border-white/10 text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Trusted & Verified Partners</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 tracking-tight mb-8 leading-tight">
            Top Forex <br className="hidden md:block" />
            <span className=" from-amber-400 to-orange-500 bg-clip-text text-transparent">Brokers 2026</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Trade with confidence using our carefully curated list of industry-leading forex brokers. Enjoy tight spreads, high leverage, and unmatched reliability.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="gradient" className="px-8 py-4 rounded-full font-bold text-lg">
              Compare Brokers
            </Button>
            <Button variant="outline" className="px-8 py-4 rounded-full font-bold text-lg">
              Read Methodology
            </Button>
          </div>
        </div>
      </section>

      {/* Brokers List */}
      <section className="w-full px-4 py-16 bg-black/40">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4 font-medium animate-pulse">Loading top brokers...</p>
            </div>
          ) : brokers.length === 0 ? (
            <div className="text-center py-20">
              <ShieldCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Brokers Available</h3>
              <p className="text-gray-400">We are currently updating our list of recommended brokers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brokers.map((broker, index) => {
                let parsedFeatures: string[] = [];
                try {
                  if (typeof broker.features === 'string') {
                    parsedFeatures = JSON.parse(broker.features);
                  } else if (Array.isArray(broker.features)) {
                    parsedFeatures = broker.features;
                  }
                } catch (e) {
                  // Ignore parsing errors
                }

                return (
                  <Card 
                    key={broker.id} 
                    hover 
                    className="group relative border border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden flex flex-col"
                  >
                    {/* Highlight Top Broker */}
                    {index === 0 && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1">
                        <Award className="w-3 h-3" /> #1 RATED
                      </div>
                    )}
                    
                    {/* Card Header: Logo & Rating */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {broker.logo ? (
                          <div className="w-12 h-12 rounded-lg bg-white p-2 flex items-center justify-center shadow-lg">
                            <img src={broker.logo} alt={broker.name} className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {broker.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-white">{broker.name}</h3>
                          {broker.country && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Globe className="w-3 h-3" /> {broker.country}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-bold text-lg">{broker.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">{broker.reviewCount || 0} reviews</span>
                      </div>
                    </div>

                    {/* Card Body: Stats */}
                    <div className="p-6 grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Min Deposit</p>
                        <p className="text-lg font-bold text-white">${broker.minimumDeposit || '0'}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Max Leverage</p>
                        <p className="text-lg font-bold text-indigo-400">{broker.leverage || '1:100'}</p>
                      </div>
                    </div>

                    {/* Features List */}
                    {parsedFeatures.length > 0 && (
                      <div className="px-6 pb-6 flex-grow">
                        <ul className="space-y-3">
                          {parsedFeatures.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300 text-sm leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Card Footer: CTA */}
                    <div className="p-6 pt-0 mt-auto">
                      <a 
                        href={broker.website || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] group-hover:scale-[1.02]"
                      >
                        Open Account
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full px-4 py-24 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Trust Our Recommendations?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Our rigorous selection process ensures you only trade with the best.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: 'Strict Regulation', 
                desc: 'We only list brokers regulated by top-tier financial authorities like FCA, ASIC, and CySEC to guarantee the safety of your funds.',
                color: 'text-green-400'
              },
              { 
                icon: TrendingUp, 
                title: 'Exceptional Trading Conditions', 
                desc: 'Our partnered brokers offer the lowest spreads, zero-commission accounts, and ultra-fast execution speeds.',
                color: 'text-indigo-400'
              },
              { 
                icon: Star, 
                title: 'Verified User Reviews', 
                desc: 'Real feedback from real traders. Our transparent review system helps you make an informed decision.',
                color: 'text-amber-400'
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 ${item.color}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
