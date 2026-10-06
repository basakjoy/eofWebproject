'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { normalizeAuthUser } from '@/lib/authUtils';
import { authApi } from '@/lib/authApi';
import { useLanguage, getLocalizedPath } from '@/context/LanguageContext';

const COUNTRY_CODES = [
  { code: '+880', country: '🇧🇩 Bangladesh' },
  { code: '+1', country: '🇺🇸 USA' },
  { code: '+44', country: '🇬🇧 UK' },
  { code: '+91', country: '🇮🇳 India' },
  { code: '+92', country: '🇵🇰 Pakistan' },
  { code: '+86', country: '🇨🇳 China' },
  { code: '+81', country: '🇯🇵 Japan' },
  { code: '+33', country: '🇫🇷 France' },
  { code: '+49', country: '🇩🇪 Germany' },
  { code: '+39', country: '🇮🇹 Italy' },
  { code: '+34', country: '🇪🇸 Spain' },
  { code: '+61', country: '🇦🇺 Australia' },
  { code: '+55', country: '🇧🇷 Brazil' },
  { code: '+27', country: '🇿🇦 South Africa' },
];

interface AuthModalProps {
  initialTab?: 'login' | 'signup';
  onClose?: () => void;
}

export default function AuthModal({ initialTab = 'signup', onClose }: AuthModalProps) {
  const router = useRouter();
  const { setSession } = useAuthStore();
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'user' | 'investor'>('user');
  const [countryCode, setCountryCode] = useState('+1');
  const [rememberMe, setRememberMe] = useState(false);

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signupData.firstName.trim() || !signupData.lastName.trim()) {
      setError('Please enter your first and last name');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', {
        name: `${signupData.firstName} ${signupData.lastName}`,
        email: signupData.email,
        password: signupData.password,
        phone: `${countryCode}${signupData.phone}`,
        userType,
      });

      const { data } = response.data;
      const { token, ...userData } = data;
      const user = normalizeAuthUser(userData);

      authApi.saveSession(token, userData);
      setSession(token, user);

      if (userType === 'investor') {
        router.push('/dashboard/investments');
      } else {
        router.push('/dashboard/user');
      }
      onClose?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', loginData);
      const { data } = response.data;
      const { token, ...userData } = data;
      const user = normalizeAuthUser(userData);

      authApi.saveSession(token, userData);
      
      if (rememberMe) {
        localStorage.setItem('rememberEmail', loginData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      setSession(token, user);

      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'investor') {
        router.push('/dashboard/investments');
      } else if (user.role === 'premium') {
        router.push('/dashboard/premium');
      } else {
        router.push('/dashboard/user');
      }
      onClose?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: 'google' | 'apple') => {
    console.log(`Sign ${activeTab === 'login' ? 'in' : 'up'} with ${provider}`);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-poppins">
      <div className="w-full max-w-md bg-[#0C0C10] text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('signup');
                setError('');
              }}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t('auth.createAccount', 'Create Account')}
            </button>
            <button
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t('auth.signIn', 'Sign In')}
            </button>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-lg font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {activeTab === 'signup' ? (
            <>
              <h2 className="text-xl font-bold text-white mb-5">{t('auth.createAccount', 'Create an account')}</h2>
              
              {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={t('auth.firstName', 'First Name')}
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    required
                  />
                  <Input
                    label={t('auth.lastName', 'Last Name')}
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <Input
                  label={t('auth.emailAddress', 'Email')}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">{t('auth.phoneNumber', 'Phone Number')}</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-white/10 bg-[#161622] text-white text-xs font-medium min-w-max outline-none"
                    >
                      {COUNTRY_CODES.map((item) => (
                        <option key={item.code} value={item.code} className="bg-zinc-900 text-white">
                          {item.country} {item.code}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="123 456 789"
                      value={signupData.phone}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>

                <Input
                  label={t('auth.password', 'Password')}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />

                <Input
                  label={t('auth.confirmPassword', 'Confirm Password')}
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">{t('auth.accountType', 'Account Type')}</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUserType('user')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        userType === 'user'
                          ? 'bg-[#FF6B00] text-white shadow-md'
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {t('auth.traderUser', 'Trader / User')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('investor')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        userType === 'investor'
                          ? 'bg-[#FF6B00] text-white shadow-md'
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {t('auth.investor', 'Investor')}
                    </button>
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full bg-[#FF6B00] hover:bg-[#FF8A00] text-white py-3 rounded-xl font-bold">
                  {t('auth.createFreeAccount', 'Create an account')}
                </Button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-[#0C0C10] text-zinc-500 uppercase">{t('auth.orSignUpWith', 'Or sign up with')}</span>
                  </div>
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    className="flex items-center justify-center gap-2 py-2 px-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-xs font-bold"
                  >
                    Google
                  </button>
                </div>

                <label className="flex items-center gap-2 text-xs pt-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-[#FF6B00]" required />
                  <span className="text-zinc-400">
                    {t('auth.termsAgreement', 'I accept the Terms and Conditions')}{' '}
                    <Link href={getLocalizedPath('/terms-of-service', locale)} className="text-[#FF6B00] hover:underline">
                      {t('footer.termsOfService', 'Terms & Conditions')}
                    </Link>
                  </span>
                </label>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-5">{t('auth.signIn', 'Welcome Back')}</h2>
              
              {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <Input
                  label={t('auth.emailAddress', 'Email')}
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />

                <Input
                  label={t('auth.password', 'Password')}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#FF6B00]"
                    />
                    <span>{t('auth.rememberEmail', 'Remember me')}</span>
                  </label>
                  <Link href="/forgot-password" className="text-[#FF6B00] hover:underline">
                    {t('auth.forgotPassword', 'Forgot password?')}
                  </Link>
                </div>

                <Button type="submit" loading={loading} className="w-full bg-[#FF6B00] hover:bg-[#FF8A00] text-white py-3 rounded-xl font-bold">
                  {t('auth.signIn', 'Sign In')}
                </Button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-[#0C0C10] text-zinc-500 uppercase">{t('auth.orSignInWith', 'Or sign in with')}</span>
                  </div>
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    className="flex items-center justify-center gap-2 py-2 px-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-xs font-bold"
                  >
                    Google
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
