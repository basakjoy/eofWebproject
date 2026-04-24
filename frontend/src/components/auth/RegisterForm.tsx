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
    <div className="w-full">
      {error && <div className="mb-6"><Alert type="error" message={error} onDismiss={() => setError('')} /></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">First Name</label>
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
            <label className="text-sm font-bold text-gray-700">Last Name</label>
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
          <label className="text-sm font-bold text-gray-700">Email Address</label>
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
          <label className="text-sm font-bold text-gray-700">Phone Number</label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-2 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-xs font-bold min-w-max outline-none"
            >
              {COUNTRY_CODES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="123 456 789"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Password</label>
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
            <label className="text-sm font-bold text-gray-700">Confirm</label>
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
            <input type="checkbox" required id="terms" className="w-4 h-4 rounded border-gray-300 text-[#0c243c] focus:ring-[#0c243c]" />
            <label htmlFor="terms" className="text-[10px] text-gray-500 font-medium font-bold">
               I accept the <Link href="/terms" className="text-[#0c243c] font-black underline decoration-2">Terms and Conditions</Link>
            </label>
        </div>

        <Button 
          type="submit" 
          loading={loading} 
          className="w-full py-3.5 bg-[#0a2a2a] hover:bg-[#082222] text-white rounded-full font-bold text-md transition-all shadow-lg shadow-[#0a2a2a]/10"
        >
          Create Free Account
        </Button>

        <div className="relative py-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-50"></div></div>
            <span className="relative px-3 bg-white text-[9px] text-gray-400 font-medium">or Sign Up with:</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthSignUp('google')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all font-bold text-gray-600 text-xs shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all font-bold text-gray-600 text-xs shadow-sm"
          >
            <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.248h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>
      </form>
    </div>
  );
}
