'use client';

import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-black">{children}</main>
      <Footer />
    </>
  );
}
