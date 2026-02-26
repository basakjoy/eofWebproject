'use client';

import IntroSection from '@/components/landing/IntroSection';
import BrokerTrustSection from '@/components/landing/BrokerTrustSection';
import LiveSignalsSection from '@/components/landing/LiveSignalsSection';
import WinsSection from '@/components/landing/WinsSection';
import TradingToolsSection from '@/components/landing/TradingToolsSection';
import SpreadsSection from '@/components/landing/SpreadsSection';
import PaymentMethodsSection from '@/components/landing/PaymentMethodsSection';
import FeaturedToolsSection from '@/components/landing/FeaturedToolsSection';
import MobileTradingSection from '@/components/landing/MobileTradingSection';
import PremiumAccountSection from '@/components/landing/PremiumAccountSection';
import AwardsSection from '@/components/landing/AwardsSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';


export default function HomePage() {
  return (
    <>
      <IntroSection />
      <BrokerTrustSection />
      <LiveSignalsSection />
      <WinsSection />
      <TradingToolsSection />
      <SpreadsSection />
      <PaymentMethodsSection />
      <FeaturedToolsSection />
      <MobileTradingSection />
      <PremiumAccountSection />
      <AwardsSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
};
