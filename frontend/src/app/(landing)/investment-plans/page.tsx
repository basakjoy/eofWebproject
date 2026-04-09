'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { CheckCircle2, X } from 'lucide-react';

const plans = [
  {
    name: 'Normal Plan',
    price: 'Free',
    minInvestment: 'No Deposit',
    expectedROI: 'N/A',
    features: [
      { name: 'Access to Signals', included: true },
      { name: 'Basic Market Analysis', included: true },
      { name: 'Trading Education', included: true },
      { name: 'Fund Management', included: false },
      { name: 'Portfolio Tracking', included: false },
      { name: 'Monthly Payouts', included: false },
      { name: 'Priority Support', included: false },
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Premium Plan',
    price: '$99/month',
    minInvestment: 'No Deposit',
    expectedROI: '8-10%',
    features: [
      { name: 'Access to Signals', included: true },
      { name: 'Basic Market Analysis', included: true },
      { name: 'Trading Education', included: true },
      { name: 'Fund Management', included: false },
      { name: 'Portfolio Tracking', included: true },
      { name: 'Monthly Payouts', included: false },
      { name: 'Priority Support', included: true },
    ],
    color: 'from-purple-500 to-purple-600',
    popular: true,
  },
  {
    name: 'Investor Plan',
    price: 'Custom',
    minInvestment: 'Min $100',
    expectedROI: '8-15%',
    features: [
      { name: 'Access to Signals', included: true },
      { name: 'Basic Market Analysis', included: true },
      { name: 'Trading Education', included: true },
      { name: 'Fund Management', included: true },
      { name: 'Portfolio Tracking', included: true },
      { name: 'Monthly Payouts', included: true },
      { name: 'Priority Support', included: true },
    ],
    color: 'from-pink-500 to-pink-600',
  },
];

export default function InvestmentPlansPage() {
  return (
    <div className="w-full pt-16">
      {/* Hero */}
      <section className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-9xl font-bold text-white/80 tracking-tight mb-8 leading-tight">Investment Plans</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect investment plan that matches your goals and capital
          </p>
        </div>
      </section>

      {/* Plans Comparison */}
      <section className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                hover 
                className={plan.popular ? 'border-2 border-indigo-500/50' : ''}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </div>
                  </div>
                )}
              
              <div className={`bg-gradient-to-br ${plan.color} rounded-2xl p-4 mb-6 text-white`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-gray-400 text-sm">Subscription</p>
                  <p className="text-2xl font-bold text-white">{plan.price}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Minimum Investment</p>
                  <p className="text-xl font-bold text-indigo-400">{plan.minInvestment}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Expected ROI</p>
                  <p className="text-xl font-bold text-green-400">{plan.expectedROI}</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2">
                    {feature.included ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? 'gradient' : 'outline'} 
                className="w-full"
              >
                {plan.name === 'Investor Plan' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </Card>
          ))}
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <Card>
            <h2 className="text-4xl font-bold gradient-text mb-8">Detailed Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 font-bold text-white">Feature</th>
                    <th className="text-center py-4 px-4 font-bold text-white">Normal</th>
                    <th className="text-center py-4 px-4 font-bold text-white">Premium</th>
                    <th className="text-center py-4 px-4 font-bold text-white">Investor</th>
                  </tr>
                </thead>
                <tbody>
                {[
                  { name: 'Trading Signals', normal: true, premium: true, investor: true },
                  { name: 'Market Analysis', normal: true, premium: true, investor: true },
                  { name: 'Educational Content', normal: true, premium: true, investor: true },
                  { name: 'Portfolio Dashboard', normal: false, premium: true, investor: true },
                  { name: 'Risk Management Tools', normal: false, premium: true, investor: true },
                  { name: 'Fund Management', normal: false, premium: false, investor: true },
                  { name: 'Monthly Payouts', normal: false, premium: false, investor: true },
                  { name: 'Dedicated Manager', normal: false, premium: false, investor: true },
                  { name: 'Priority Email Support', normal: false, premium: true, investor: true },
                  { name: '24/7 Phone Support', normal: false, premium: false, investor: true },
                ].map((feature) => (
                  <tr key={feature.name} className="border-b border-gray-700/50">
                    <td className="py-4 px-4 text-gray-300">{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      {feature.normal ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {feature.premium ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {feature.investor ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold gradient-text mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change your plan anytime. Changes take effect at the start of your next billing cycle.' },
              { q: 'What happens if I withdraw before the end of the month?', a: 'Early withdrawals are processed, but you may forfeit the monthly profit share for that month.' },
              { q: 'Is there a lock-in period for investments?', a: 'No, your funds are always accessible. You can withdraw anytime without penalties.' },
              { q: 'How are profits calculated?', a: 'Profits are calculated daily on your current balance and paid out monthly. Returns vary based on market conditions.' },
            ].map((faq, idx) => (
              <Card key={idx} hover>
                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </Card>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
}
