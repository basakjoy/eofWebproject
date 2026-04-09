import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/providers/ThemeProvider';
import  Providers from '@/app/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EOF - Empire of Forex | Professional Trading Platform',
  description: 'Advanced forex trading signals, real-time market analysis, and professional portfolio management.',
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
