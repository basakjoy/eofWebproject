'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';

const COUNTRY_CODES = [
  { code: '+1', country: '🇺🇸 USA' },
  { code: '+44', country: '🇬🇧 UK' },
  { code: '+91', country: '🇮🇳 India' },
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
  const { setUser, setToken } = useAuthStore();
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
      const { token, ...user } = data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      if (userType === 'investor') {
        router.push('/dashboard/user');
      } else {
        router.push('/dashboard');
      }
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
      const { token, ...user } = data;

      localStorage.setItem('token', token);
      
      if (rememberMe) {
        localStorage.setItem('rememberEmail', loginData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      setToken(token);
      setUser(user);

      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'investor') {
        router.push('/dashboard/investor');
      } else {
        router.push('/dashboard/user');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: 'google' | 'apple') => {
    console.log(`Sign ${activeTab === 'login' ? 'in' : 'up'} with ${provider}`);
    // TODO: Implement OAuth
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-blue-900/40 border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('signup');
                setError('');
              }}
              className={`pb-2 text-sm font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'text-gray-900 dark:text-white border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`pb-2 text-sm font-semibold transition-all ${
                activeTab === 'login'
                  ? 'text-gray-900 dark:text-white border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              Sign in
            </button>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'signup' ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Create an account</h2>
              
              {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    placeholder="Join"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    required
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium min-w-max"
                    >
                      {COUNTRY_CODES.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.country} {item.code}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="(770) 3614690"
                      value={signupData.phone}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUserType('user')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        userType === 'user'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      User
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('investor')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        userType === 'investor'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Investor
                    </button>
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  Create an account
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or sign up with</span>
                  </div>
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <span>G</span>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuth('apple')}
                    className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <span></span>
                    Apple
                  </button>
                </div>

                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" className="w-4 h-4 rounded accent-blue-600 dark:accent-blue-500" required />
                  <span className="text-gray-600 dark:text-gray-400">
                    By creating an account, you agree to our{' '}
                    <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Terms & Conditions
                    </Link>
                  </span>
                </label>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Welcome Back</h2>
              
              {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-600 dark:accent-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  Sign In
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or sign in with</span>
                  </div>
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <span>G</span>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuth('apple')}
                    className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <span></span>
                    Apple
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
