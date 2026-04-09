import React from 'react';
import Link from 'next/link';
import { ArrowRight, Facebook , Instagram, X , Youtube } from 'lucide-react';
import { LogoIcon } from './LogoIcon';

interface FooterProps {}

export default function Footer({}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-24 sm:px-8 lg:px-10">
        {/* CTA Section */}
        <div className="mb-24 pb-24 border-b border-gray-900">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Have a Great Idea?
              </h2>
              <p className="text-gray-400 text-xl">Tell us about it and let's create something amazing together.</p>
            </div>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 whitespace-nowrap text-lg"
            >
              Let's Talk! <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        Links Grid
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-16">
          {/* Home */}
          <div>
            <h3 className="text-white font-bold mb-6">Home</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Trading */}
          <div>
            <h3 className="text-white font-bold mb-6">Trading</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/trading-signals" className="text-gray-400 hover:text-white transition-colors">
                  Live Signals
                </Link>
              </li>
              <li>
                <Link href="/dashboard/market-analysis" className="text-gray-400 hover:text-white transition-colors">
                  Market Analysis
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Education
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-10 h-10 text-blue-600" />
            <p className="text-gray-500 text-sm">
              © {currentYear} Empire of Forex. All rights reserved.
            </p>
          </div>

          <div className="flex gap-8 ">
            <a href="https://www.facebook.com/empireforex" className="border boder-white/20 bg-white/70 backdrop-blur-md p-3 rounded-full hover:scale-110 hover:border-blue-500 transition">
              <Facebook size={22} className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/empireofforexworld/?next=%2F" className="border boder-white/20 bg-white/70 backdrop-blur-md p-3 rounded-full hover:scale-110 hover:border-blue-500 transition">
              <Instagram size={22} className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/empireofforexworld/?next=%2F" className="border boder-white/20 bg-white/70 backdrop-blur-md p-3 rounded-full hover:scale-110 hover:border-blue-500 transition">
              <X size={22} className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@EmpireofForex" className="border boder-white/20 bg-white/70 backdrop-blur-md p-3 rounded-full hover:scale-110 hover:border-blue-500 transition">
              <Youtube size={22} className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
