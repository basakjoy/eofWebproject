'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2, LockKeyhole, Mail } from 'lucide-react';
import axios from 'axios';
import { LogoIcon } from '@/components/common/LogoIcon';
import { useLanguage } from '@/context/LanguageContext';
import { authApi } from '@/lib/authApi';

interface ForgotPasswordFormProps {
  token: string;
}

export default function ForgotPasswordForm({ token }: ForgotPasswordFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleRequestReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');
    try {
      await authApi.requestPasswordReset(email.trim().toLowerCase());
      setNotice(t('auth.resetEmailSent', 'If an eligible account exists for that email, a reset link has been sent.'));
    } catch {
      setError(t('auth.resetRequestError', 'Unable to send a reset link right now. Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (password.length < 6) {
      setError(t('auth.passwordTooShort', 'Use at least 6 characters for your password.'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch', 'The passwords do not match.'));
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      setCompleted(true);
    } catch (requestError: unknown) {
      setError(axios.isAxiosError(requestError) && requestError.response?.status === 400
        ? t('auth.resetLinkInvalid', 'This reset link is invalid or has expired. Request a new link and try again.')
        : t('auth.resetRequestError', 'Unable to reset your password right now. Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  const loginHref = '/login';

  return (
    <main className="min-h-screen bg-white px-5 py-8 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col">
        <Link href="/home" className="mb-12 inline-flex w-fit items-center gap-2">
          <LogoIcon size={32} />
          <span className="text-lg font-black uppercase tracking-tight text-[#0c243c]">Empire of Forex</span>
        </Link>

        <section className="my-auto pb-12">
          {completed ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-emerald-600" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-gray-900">
                {t('auth.passwordResetSuccess', 'Your password has been reset.')}
              </h1>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {t('auth.passwordResetSuccessDescription', 'Your account is ready. Sign in with your new password.')}
              </p>
              <Link href={loginHref} className="mt-7 inline-flex w-full justify-center rounded-lg bg-[#0a2a2a] px-4 py-3 font-bold text-white hover:bg-[#082222]">
                {t('auth.backToSignIn', 'Back to Sign In')}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f0ef] text-[#0a2a2a]">
                  {token ? <LockKeyhole className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {token
                    ? t('auth.resetTitle', 'Choose a new password')
                    : t('auth.forgotTitle', 'Recover your account')}
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {token
                    ? t('auth.resetDescription', 'Set a new password to regain access. Inactive accounts will be reactivated.')
                    : t('auth.forgotDescription', 'Enter your account email and we will send you a secure password reset link.')}
                </p>
              </div>

              {error && (
                <div role="alert" className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {notice && (
                <div role="status" className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-800">
                  {notice}
                </div>
              )}

              {token ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t('auth.newPassword', 'New Password')}
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="new-password"
                      minLength={6}
                      maxLength={72}
                      required
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3.5 py-3 text-sm font-normal text-gray-900 outline-none transition focus:border-[#0a2a2a] focus:ring-2 focus:ring-[#0a2a2a]/15"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-gray-700">
                    {t('auth.confirmPassword', 'Confirm Password')}
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                      minLength={6}
                      maxLength={72}
                      required
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3.5 py-3 text-sm font-normal text-gray-900 outline-none transition focus:border-[#0a2a2a] focus:ring-2 focus:ring-[#0a2a2a]/15"
                    />
                  </label>
                  <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0a2a2a] px-4 py-3 font-bold text-white transition hover:bg-[#082222] disabled:cursor-not-allowed disabled:opacity-60">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    {loading ? t('auth.resettingPassword', 'Resetting Password...') : t('auth.resetPassword', 'Reset Password')}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t('auth.emailAddress', 'Email Address')}
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      autoCapitalize="none"
                      required
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3.5 py-3 text-sm font-normal text-gray-900 outline-none transition focus:border-[#0a2a2a] focus:ring-2 focus:ring-[#0a2a2a]/15"
                    />
                  </label>
                  <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0a2a2a] px-4 py-3 font-bold text-white transition hover:bg-[#082222] disabled:cursor-not-allowed disabled:opacity-60">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    {loading ? t('auth.sendingResetLink', 'Sending reset link...') : t('auth.sendResetLink', 'Send Reset Link')}
                  </button>
                  {notice && (
                    <button type="button" onClick={() => setNotice('')} className="w-full py-2 text-sm font-semibold text-[#0a2a2a] hover:underline">
                      {t('auth.requestAnotherLink', 'Request another link')}
                    </button>
                  )}
                </form>
              )}

              <Link href={loginHref} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t('auth.backToSignIn', 'Back to Sign In')}
              </Link>
            </>
          )}
        </section>
      </div>
    </main>
  );
}