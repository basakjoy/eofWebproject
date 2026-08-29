'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { CheckCircle2, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const comparisonRows = [
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
];

const faqs = [
  { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change your plan anytime. Changes take effect at the start of your next billing cycle.' },
  { q: 'What happens if I withdraw before the end of the month?', a: 'Early withdrawals are processed, but you may forfeit the monthly profit share for that month.' },
  { q: 'Is there a lock-in period for investments?', a: 'No, your funds are always accessible. You can withdraw anytime without penalties.' },
  { q: 'How are profits calculated?', a: 'Profits are calculated daily on your current balance and paid out monthly. Returns vary based on market conditions.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

export default function InvestmentPlansPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full pt-16 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="w-full px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="max-w-7xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-8xl font-bold text-white/90 tracking-tight mb-6 leading-[1.05]">
            Investment Plans
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the perfect investment plan that matches your goals and capital
          </p>
        </motion.div>
      </section>

      {/* Plans Comparison */}
      <section className="w-full px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="relative"
              >
                <Card
                  hover
                  className={`h-full ${plan.popular ? 'border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''}`}
                >
                  {plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 18 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wide shadow-md shadow-indigo-600/30">
                        MOST POPULAR
                      </div>
                    </motion.div>
                  )}

                  <div className={`bg-gradient-to-br ${plan.color} rounded-2xl p-5 mb-6 text-white`}>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Subscription</p>
                      <p className="text-2xl font-bold text-white">{plan.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Minimum Investment</p>
                      <p className="text-lg font-semibold text-indigo-400">{plan.minInvestment}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Expected ROI</p>
                      <p className="text-lg font-semibold text-emerald-400">{plan.expectedROI}</p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fi) => (
                      <motion.li
                        key={feature.name}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + fi * 0.04 }}
                        className="flex items-center gap-2"
                      >
                        {feature.included ? (
                          <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-700 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                          {feature.name}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button variant={plan.popular ? 'gradient' : 'outline'} className="w-full">
                      {plan.name === 'Investor Plan' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="w-full px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <Card>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-8">Detailed Comparison</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-4 px-4 font-semibold text-gray-400 text-sm uppercase tracking-wide">Feature</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-400 text-sm uppercase tracking-wide">Normal</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-400 text-sm uppercase tracking-wide">Premium</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-400 text-sm uppercase tracking-wide">Investor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((feature, i) => (
                      <motion.tr
                        key={feature.name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-gray-800 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-300">{feature.name}</td>
                        <td className="py-4 px-4 text-center">
                          {feature.normal ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-700 mx-auto" />
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {feature.premium ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-700 mx-auto" />
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {feature.investor ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-700 mx-auto" />
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ — animated accordion */}
      <section className="w-full px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  custom={idx}
                  variants={fadeUp}
                >
                  <Card
                    className={`cursor-pointer transition-colors ${isOpen ? 'border-indigo-500/40' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-4" onClick={() => setOpenFaq(isOpen ? null : idx)}>
                      <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-400 pt-3">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}