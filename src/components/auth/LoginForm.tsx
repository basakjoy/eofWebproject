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
    <div className="w-full">
      {error && <div className="mb-6"><Alert type="error" message={error} onDismiss={() => setError('')} /></div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
             <input
               type="checkbox"
               id="rememberMe"
               checked={rememberMe}
               onChange={(e) => setRememberMe(e.target.checked)}
               className="w-4 h-4 rounded border-gray-300 text-[#0c243c] focus:ring-[#0c243c]"
             />
          </div>
          <label htmlFor="rememberMe" className="text-sm font-bold text-gray-700 cursor-pointer">
            Remember Me
          </label>
        </div>

        <Button 
          type="submit" 
          loading={loading} 
          className="w-full py-4 bg-[#0a2a2a] hover:bg-[#082222] text-white rounded-full font-bold text-lg transition-all"
        >
          Sign In
        </Button>

        <div className="text-center mt-4">
          <Link href="/forgot-password" className="text-sm font-bold text-[#0c243c] border-b border-[#0c243c]">
             Forgot Password?
          </Link>
        </div>

        <div className="relative py-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 italic font-medium"></div></div>
            <span className="relative px-4 bg-white text-[11px] text-gray-400 font-medium">or Sign In with:</span>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all font-bold text-gray-700 text-sm shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all font-bold text-gray-700 text-sm shadow-sm"
          >
            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.248h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
          </button>
        </div>
      </form>
    </div>
  );
}
