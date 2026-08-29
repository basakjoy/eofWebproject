'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SupportChat from './SupportChat';
import { useAuthStore } from '@/store/authStore';

export default function FloatingSupport() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Only show floating support button if user is authenticated
  if (!user) {
    return null;
  }

  // Do not show on any admin pages
  if (!pathname || pathname.startsWith('/admin')) {
    return null;
  }

  // Show only on home and user dashboard routes
  const isHome = pathname === '/' || pathname === '/home';
  const isDashboard = pathname.startsWith('/dashboard');

  if (!isHome && !isDashboard) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-600/50 flex items-center justify-center hover:shadow-xl hover:shadow-indigo-600/70 transition-all duration-300 transform hover:scale-110 z-40 group"
            title="Open support chat"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>

            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 rounded-full bg-indigo-600 opacity-0"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none border border-gray-700"
            >
              Need help?
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 border-r border-t border-gray-700 transform rotate-45" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Support Chat Component */}
      <SupportChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
