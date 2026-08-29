'use client';

import Navbar from '@/components/common/Navbar';
import BottomNavbar from '@/components/common/BottomNavbar';
import Footer from '@/components/common/Footer';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#050508] text-white min-h-screen selection:bg-[#FF6B00] selection:text-white font-sans antialiased overflow-x-hidden">
      <Navbar />
      <main className="bg-[#050508]">{children}</main>
      <BottomNavbar />
      <Footer />
    </div>
  );
}
