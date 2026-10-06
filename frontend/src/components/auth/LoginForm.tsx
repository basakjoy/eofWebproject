'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/authApi';
import { normalizeAuthUser } from '@/lib/authUtils';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginForm() {
  const router = useRouter();
  const { setSession } = useAuthStore();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Prefill remembered email only
  useEffect(() => {
    try {
      const rememberedEmail = localStorage.getItem('rememberEmail');
      if (rememberedEmail) {
        setFormData((prev) => ({ ...prev, email: rememberedEmail }));
        setRememberMe(true);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleRoleRedirect = (role?: string) => {
    const normalizedRole = String(role || '').toLowerCase();
    if (normalizedRole === 'admin' || normalizedRole === 'superadmin') {
      router.push('/admin');
    } else if (normalizedRole === 'investor') {
      router.push('/dashboard/investments');
    } else if (normalizedRole === 'premium') {
      router.push('/dashboard/premium');
    } else {
      router.push('/dashboard/user');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.login({ email, password });
      const { data } = response;
      if (!data?.token) {
        throw new Error('The server did not return an authentication token.');
      }
      const { token, ...userData } = data;
      const user = normalizeAuthUser(userData);

      authApi.saveSession(token, userData);

      // Save or remove remembered email preference
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      // Update auth store
      setSession(token, user);

      // Smoothly navigate to the appropriate dashboard
      handleRoleRedirect(user.role);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setOAuthLoading(true);
    setError('');
    try {
      const result = await signIn('google', { redirect: false });
      if (result?.error) {
        setError(result.error || 'Google authentication failed.');
      } else if (result?.ok) {
        const user = authApi.getCurrentUser();
        const token = authApi.getToken();
        if (user && token) {
          setSession(token, user);
          handleRoleRedirect(user.role);
        } else {
          router.push('/dashboard/user');
        }
      }
    } catch (err: any) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setOAuthLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <Alert type="error" message={error} onDismiss={() => setError('')} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            {t('auth.emailAddress', 'Email Address')}
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0c243c]/15 focus:border-[#0c243c] transition-all font-medium text-sm"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {t('auth.password', 'Password')}
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-[#0c243c] hover:underline"
            >
              {t('auth.forgotPassword', 'Forgot Password?')}
            </Link>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0c243c]/15 focus:border-[#0c243c] transition-all font-medium text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label
            htmlFor="rememberMe"
            className="flex items-center gap-2.5 text-xs font-bold text-gray-700 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#0c243c] focus:ring-[#0c243c] cursor-pointer"
            />
            {t('auth.rememberEmail', 'Remember Email')}
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          className="w-full py-3.5 bg-[#0a2a2a] hover:bg-[#082222] text-white rounded-xl font-bold text-base transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('auth.signingIn', 'Signing In...')}
            </>
          ) : (
            t('auth.signIn', 'Sign In')
          )}
        </Button>

        {/* Divider */}
        <div className="relative py-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-3 bg-white text-[11px] text-gray-400 font-medium uppercase tracking-wider">
            {t('auth.orSignInWith', 'or Sign In with')}
          </span>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={oauthLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-700 text-xs shadow-sm hover:border-gray-300 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {oauthLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {t('auth.continueWithGoogle', 'Continue with Google')}
          </button>
        </div>
      </form>
    </div>
  );
}
