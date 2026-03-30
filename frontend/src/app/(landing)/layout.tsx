'use client';

import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark">
      <Navbar />
      <main className=" bg-black">{children}</main>
      <Footer />
    </div>
  );
}
