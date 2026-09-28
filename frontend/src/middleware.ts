import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n/routing';

const localePattern = new RegExp(`^/(${locales.join('|')})(?:/(.*)|$)`);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match locale-prefixed routes, e.g. /bn, /hi/services, /ur/trading-signals
  const match = pathname.match(localePattern);

  if (match) {
    const locale = match[1] as Locale;
    const rest = match[2] ? `/${match[2]}` : '';
    // If user accesses /bn or /ur directly without a subpath, take them to the home page
    const destination = rest === '' || rest === '/' ? '/home' : rest;

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = destination;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-next-locale', locale);

    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
