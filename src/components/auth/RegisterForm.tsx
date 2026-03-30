'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/authApi';

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

export default function RegisterForm() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
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

    setLoading(true);

    try {
      const response = await authApi.register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        userType,
      });

      const { data } = response;
      const { token, ...user } = data;

      // Save token and user
      localStorage.setItem('token', token);
      authApi.setUserData(user);
      setToken(token);
      setUser(user);

      // Redirect based on user type
      if (userType === 'investor') {
        router.push('/dashboard/user');
      } else {
        router.push('/dashboard/user');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = (provider: 'google' | 'apple') => {
    // TODO: Implement OAuth sign-up
    console.log(`Sign up with ${provider}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-blue-900/20 border border-gray-200 dark:border-gray-800">
      {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First Name"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      {/* Phone Number Field */}
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
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      {/* User Type Toggle */}
      {/* <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUserType('user')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              userType === 'user'
                ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-md dark:shadow-blue-600/50'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Regular User
          </button>
          <button
            type="button"
            onClick={() => setUserType('investor')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              userType === 'investor'
                ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-md dark:shadow-blue-600/50'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Investor
          </button>
        </div>
      </div> */}

      <Button type="submit" loading={loading} className="w-full">
        Create an account
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or sign up with</span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuthSignUp('google')}
          className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="text-lg font-bold text-blue-600">G</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleOAuthSignUp('apple')}
          className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="text-lg"></span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Apple</span>
        </button>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" className="w-4 h-4 rounded accent-blue-600 dark:accent-blue-500" required />
        <span className="text-xs text-gray-600 dark:text-gray-400">
          By creating an account, you agree to our{' '}
          <Link href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            Terms & Conditions
          </Link>
        </span>
      </label>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
          Sign in here
        </Link>
      </p>
    </form>
  );
}
