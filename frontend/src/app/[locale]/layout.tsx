import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import { Noto_Sans_Bengali, Noto_Sans_Devanagari, Noto_Nastaliq_Urdu } from 'next/font/google';

const notoBengali = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-noto-bengali', display: 'swap' });
const notoDevanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-noto-devanagari', display: 'swap' });
const notoUrdu = Noto_Nastaliq_Urdu({ subsets: ['arabic'], variable: '--font-noto-urdu', display: 'swap' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: requestedLocale } = await params;
  if (!hasLocale(routing.locales, requestedLocale)) notFound();

  const locale = requestedLocale as Locale;
  setRequestLocale(locale);
  const messages = await getMessages();
  const fontClass = locale === 'bn' ? notoBengali.variable : locale === 'hi' ? notoDevanagari.variable : locale === 'ur' ? notoUrdu.variable : '';
  const direction = locale === 'ur' ? 'rtl' : 'ltr';

  return (
    <div lang={locale} dir={direction} className={fontClass}>
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
