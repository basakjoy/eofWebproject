'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/authApi';
import { signIn, useSession } from "next-auth/react";

export default function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Handle session changes (OAuth login success)
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const user = session.user as any;
      
      // Save token to localStorage
      if (user.accessToken) {
        localStorage.setItem('token', user.accessToken);
        authApi.setUserData(user);
        setToken(user.accessToken);
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'user',
          createdAt: '',
          updatedAt: ''
        });
      }

      // Redirect based on role
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'investor') {
        router.push('/dashboard/investor');
      } else {
        router.push('/dashboard');
      }
    }
  }, [status, session, setToken, setUser, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(formData);
      const { data } = response;
      const { token, ...user } = data;

      // Save token to localStorage
      localStorage.setItem('token', token);
      authApi.setUserData(user);
      
      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      // Set user and token in store
      setToken(token);
      setUser(user);

      // Redirect based on role
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

  const handleGoogleLogin = async () => {
    setOAuthLoading(true);
    try {
      const result = await signIn('google', { redirect: false });
      
      if (result?.error) {
        setError(result.error || 'Google login failed');
      } else if (result?.ok) {
        // Session will be updated and useEffect will handle redirect
      }
    } catch (err: any) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setOAuthLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-blue-900/20 border border-gray-200 dark:border-gray-800">
      {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
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
        <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
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
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or sign in with</span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={oauthLoading}
          className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {oauthLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Signing in...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
            </>
          )}
        </button>
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors opacity-50 cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 13.5c0-.5.1-.96.28-1.41.55-1.57.1-3.67-1.23-4.61-.43-.31-.91-.55-1.4-.73.17-.47.28-1.01.28-1.59 0-2.85-2.32-5.16-5.16-5.16-2.57 0-4.72 1.89-5.09 4.37-2.06.56-3.6 2.38-3.6 4.56 0 2.65 2.15 4.8 4.8 4.8.41 0 .81-.05 1.21-.15.43 1.61 1.9 2.78 3.65 2.78h4.52c2.14 0 3.88-1.74 3.88-3.88 0-.33-.04-.65-.1-.97z"/>
          </svg>
          <span className="text-sm font-medium text-gray-400">Coming Soon</span>
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
          Create one
        </Link>
      </p>
    </form>
  );
}
