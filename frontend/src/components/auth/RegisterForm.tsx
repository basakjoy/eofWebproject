'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/authApi';
import { normalizeAuthUser } from '@/lib/authUtils';
import { useLanguage, getLocalizedPath } from '@/context/LanguageContext';

const PENDING_GOOGLE_SIGNUP_KEY = 'pending-google-signup';

interface PendingGoogleSignup {
  phone: string;
  userType: 'user' | 'investor';
}

const COUNTRY_CODES = [
  { code: '+880', country: 'Bangladesh' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+92', country: 'Pakistan' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+61', country: 'Australia' },
  { code: '+55', country: 'Brazil' },
  { code: '+27', country: 'South Africa' },
  { code: '+971', country: 'UAE' },
  { code: '+966', country: 'Saudi Arabia' },
];

export default function RegisterForm() {
  const router = useRouter();
  const { setSession } = useAuthStore();
  const { t, locale } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'user' | 'investor'>('user');
  const [countryCode, setCountryCode] = useState('+1');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getInternationalPhone = () => `${countryCode}${formData.phone.replace(/\D/g, '')}`;

  useEffect(() => {
    const pendingSignup = sessionStorage.getItem(PENDING_GOOGLE_SIGNUP_KEY);
    if (!pendingSignup) return;

    let cancelled = false;

    const completeGoogleSignup = async () => {
      setOAuthLoading(true);
      setError('');

      try {
        const pending = JSON.parse(pendingSignup) as PendingGoogleSignup;
        const session = await getSession();
        const sessionUser = session?.user as (NonNullable<typeof session>['user'] & {
          id?: string;
          role?: string;
          accessToken?: string;
        }) | undefined;

        if (!sessionUser?.id || !sessionUser.email || !sessionUser.accessToken) {
          throw new Error(t('auth.googleSessionMissing', 'Google sign-up could not be completed. Please try again.'));
        }

        const userData = {
          id: sessionUser.id,
          name: sessionUser.name || sessionUser.email.split('@')[0],
          email: sessionUser.email,
          role: sessionUser.role || 'user',
          phone: pending.phone,
        };
        const user = normalizeAuthUser(userData);

        authApi.saveSession(sessionUser.accessToken, userData);
        setSession(sessionUser.accessToken, user);
        await authApi.updatePhone(user.id, pending.phone);

        sessionStorage.removeItem(PENDING_GOOGLE_SIGNUP_KEY);

        if (!cancelled) {
          const role = String(user.role).toLowerCase();
          const dashboardPath = role === 'admin' || role === 'superadmin'
            ? '/admin'
            : role === 'investor'
              ? '/dashboard/investments'
              : role === 'premium'
                ? '/dashboard/premium'
                : '/dashboard/user';
          router.replace(dashboardPath);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : t('auth.googleSignupFailed', 'Google sign-up failed. Please try again.');
          setError(message);
        }
      } finally {
        if (!cancelled) setOAuthLoading(false);
      }
    };

    void completeGoogleSignup();

    return () => {
      cancelled = true;
    };
  }, [router, setSession, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your first and last name');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const phone = getInternationalPhone();
    if (!/^\+[1-9]\d{6,14}$/.test(phone)) {
      setError(t('auth.invalidPhoneNumber', 'Enter a valid phone number with its country code.'));
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone,
        userType,
      });

      const { data } = response;
      const { token, ...userData } = data;
      const user = normalizeAuthUser(userData);

      authApi.saveSession(token, userData);
      setSession(token, user);

      if (userType === 'investor') {
        router.push('/dashboard/investments');
      } else {
        router.push('/dashboard/user');
      }
    } catch (err: unknown) {
      const responseMessage = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setError(responseMessage || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async () => {
    if (userType === 'investor') {
      setError(t('auth.googleInvestorUnavailable', 'Google sign-up is currently available for trader accounts. Use email registration for an investor account.'));
      return;
    }

    const phone = getInternationalPhone();
    if (!/^\+[1-9]\d{6,14}$/.test(phone)) {
      setError(t('auth.invalidPhoneNumber', 'Enter a valid phone number with its country code.'));
      return;
    }

    setError('');
    setOAuthLoading(true);

    try {
      sessionStorage.setItem(PENDING_GOOGLE_SIGNUP_KEY, JSON.stringify({ phone, userType }));
      await signIn('google', {
        callbackUrl: `${window.location.origin}${getLocalizedPath('/register', locale)}`,
      });
    } catch {
      sessionStorage.removeItem(PENDING_GOOGLE_SIGNUP_KEY);
      setError(t('auth.googleSignupFailed', 'Google sign-up failed. Please try again.'));
      setOAuthLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && <div className="mb-6"><Alert type="error" message={error} onDismiss={() => setError('')} /></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Type Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t('auth.accountType', 'Account Type')}</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUserType('user')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                userType === 'user'
                  ? 'bg-[#0a2a2a] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('auth.traderUser', 'Trader / User')}
            </button>
            <button
              type="button"
              onClick={() => setUserType('investor')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                userType === 'investor'
                  ? 'bg-[#0a2a2a] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('auth.investor', 'Investor')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t('auth.firstName', 'First Name')}</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t('auth.lastName', 'Last Name')}</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t('auth.emailAddress', 'Email Address')}</label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-medium text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t('auth.phoneNumber', 'Phone Number')}</label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-2 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-xs font-bold min-w-max outline-none"
            >
              {COUNTRY_CODES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.country} {item.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="123 456 789"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel-national"
              inputMode="tel"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t('auth.password', 'Password')}</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t('auth.confirmPassword', 'Confirm Password')}</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 py-2">
            <input type="checkbox" required id="terms" className="w-4 h-4 rounded border-gray-300 text-[#0c243c] focus:ring-[#0c243c] cursor-pointer" />
            <label htmlFor="terms" className="text-xs text-gray-500 font-medium cursor-pointer">
               {t('auth.termsAgreement', 'I accept the Terms and Conditions')}{' '}
               <Link href={getLocalizedPath('/terms-of-service', locale)} className="text-[#0c243c] font-black underline decoration-2 ml-1">
                 {t('footer.termsOfService', 'Terms of Service')}
               </Link>
            </label>
        </div>

        <Button 
          type="submit" 
          loading={loading} 
          className="w-full py-3.5 bg-[#0a2a2a] hover:bg-[#082222] text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-[#0a2a2a]/10 cursor-pointer"
        >
          {t('auth.createFreeAccount', 'Create Free Account')}
        </Button>

        <div className="relative py-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <span className="relative px-3 bg-white text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {t('auth.orSignUpWith', 'or Sign Up with')}
            </span>
        </div>

        <div>
          <button
            type="button"
            onClick={handleOAuthSignUp}
            disabled={loading || oauthLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-700 text-xs shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {oauthLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {oauthLoading ? t('auth.connectingToGoogle', 'Connecting to Google...') : t('auth.continueWithGoogle', 'Continue with Google')}
          </button>
        </div>
      </form>
    </div>
  );
}
