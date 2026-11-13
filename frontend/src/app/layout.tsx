
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Inter, IBM_Plex_Mono, Noto_Sans_Bengali, Noto_Sans_Devanagari, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/providers/ThemeProvider';
import Providers from '@/app/providers';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-bengali',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-devanagari',
  display: 'swap',
});

const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-urdu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EOF - Empire of Forex | Professional Trading Platform',
  description: 'Advanced forex trading signals, real-time market analysis, and professional portfolio management.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const locale = ['en', 'bn', 'hi', 'ur'].includes(rawLocale) ? rawLocale : 'en';
  const dir = locale === 'ur' ? 'rtl' : 'ltr';

  const fontVariables = `${inter.variable} ${ibmPlexMono.variable} ${notoBengali.variable} ${notoDevanagari.variable} ${notoUrdu.variable}`;

  return (
    <html lang={locale} dir={dir} data-scroll-behavior="smooth" suppressHydrationWarning className={fontVariables}>
      <body className={`${inter.className} antialiased selection:bg-[#FF6B00] selection:text-white`}>
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
        <GoogleAnalytics gaId="G-T0ZC3HNQ0K" />
      </body>
    </html>
  );
}
