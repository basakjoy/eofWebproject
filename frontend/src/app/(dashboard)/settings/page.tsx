'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usersApi } from '@/lib/usersApi';
import {
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Trash2,
  CheckCircle,
  RefreshCw,
  Moon,
  Sun,
  Monitor,
  LogOut,
  Sliders,
  Key,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { useLanguage, type Locale } from '@/context/LanguageContext';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fiery-orange/50';

const INPUT_CLASS =
  'w-full rounded-xl border border-white/10 bg-obsidian/70 px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 ' +
  '[color-scheme:dark] transition-colors hover:border-white/20 focus:border-fiery-orange/60 focus:outline-none focus:ring-2 focus:ring-fiery-orange/20';

const SELECT_CLASS =
  'cursor-pointer rounded-xl border border-white/10 bg-obsidian/70 px-4 py-2 text-xs font-bold text-white ' +
  '[color-scheme:dark] transition-colors hover:border-white/20 focus:border-fiery-orange/60 focus:outline-none focus:ring-2 focus:ring-fiery-orange/20';

// Selected / unselected styles that stay on the dark surface (no solid light fill)
const PILL_ACTIVE = 'border-fiery-orange/40 bg-fiery-orange/15 text-fiery-amber';
const PILL_INACTIVE =
  'border-transparent bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white';
const PILL_INACTIVE_BORDERED =
  'border-white/10 bg-panel-dark text-zinc-400 hover:bg-white/5 hover:text-white';

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 ${FOCUS_RING} ${
        enabled
          ? 'border-fiery-orange/60 bg-gradient-to-r from-fiery-orange to-fiery-amber'
          : 'border-white/10 bg-white/10 hover:bg-white/15'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full shadow-md transition-transform duration-200 ${
          enabled ? 'translate-x-[1.375rem] bg-white' : 'translate-x-1 bg-zinc-300'
        }`}
      />
    </button>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-card-dark/80 backdrop-blur-xl">
      <header className="flex items-center gap-3 border-b border-white/10 bg-panel-dark/80 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-fiery-orange/30 bg-fiery-orange/10 text-fiery-orange">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-base font-extrabold tracking-tight text-white">{title}</h2>
      </header>
      <div className="space-y-3 p-6">{children}</div>
    </section>
  );
}

// ─── Setting Row ──────────────────────────────────────────────────────────────
function SettingRow({
  label,
  description,
  action,
}: {
  label: string;
  description?: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-panel-dark/80 p-4 transition-colors hover:border-white/15 hover:bg-panel-dark">
      <div className="min-w-0">
        <p className="text-xs font-bold text-white sm:text-sm">{label}</p>
        {description && (
          <p className="mt-0.5 text-[11px] font-light leading-relaxed text-zinc-400">{description}</p>
        )}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

interface NotifPrefs {
  emailNotifications: boolean;
  signalAlerts: boolean;
  investmentUpdates: boolean;
  withdrawalAlerts: boolean;
  profitDistributions: boolean;
  marketNews: boolean;
  weeklyReport: boolean;
}

type Theme = 'light' | 'dark' | 'system';
type Tab = 'notifications' | 'appearance' | 'security' | 'account';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

const THEME_OPTIONS: { val: Theme; icon: React.ElementType; label: string }[] = [
  { val: 'light', icon: Sun, label: 'Light' },
  { val: 'dark', icon: Moon, label: 'Dark' },
  { val: 'system', icon: Monitor, label: 'System' },
];

export default function RefinedSettingsPage() {
  const { logout } = useAuthStore();
  const { locale, setLocale, options: langOptions, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('notifications');
  const [, setProfile] = useState<{ id: string; name: string; email: string } | null>(null);

  // Appearance & preferences (persisted on change)
  const [theme, setTheme] = useState<Theme>('dark');
  const [currency, setCurrency] = useState('USD');

  // Password drawer state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [isChangingPw, setIsChangingPw] = useState(false);

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    emailNotifications: true,
    signalAlerts: true,
    investmentUpdates: true,
    withdrawalAlerts: true,
    profitDistributions: true,
    marketNews: false,
    weeklyReport: true,
  });

  const toggleNotif = (key: keyof NotifPrefs) => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }));

  // Load profile & saved settings
  const loadSettings = useCallback(async () => {
    try {
      const res = await usersApi.getCurrentUserProfile();
      if (res?.data) setProfile(res.data);
    } catch {
      try {
        const raw = localStorage.getItem('user');
        if (raw) setProfile(JSON.parse(raw));
      } catch {}
    }
  }, []);

  useEffect(() => {
    loadSettings().finally(() => setLoading(false));

    try {
      const savedNotifs = localStorage.getItem('notifPrefs');
      if (savedNotifs) setNotifPrefs((p) => ({ ...p, ...JSON.parse(savedNotifs) }));

      const savedTheme = localStorage.getItem('settings.theme') as Theme | null;
      if (savedTheme && THEME_OPTIONS.some((o) => o.val === savedTheme)) setTheme(savedTheme);

      const savedCurrency = localStorage.getItem('settings.currency');
      if (savedCurrency && CURRENCIES.includes(savedCurrency)) setCurrency(savedCurrency);
    } catch {}
  }, [loadSettings]);

  const handleThemeChange = (val: Theme) => {
    setTheme(val);
    try {
      localStorage.setItem('settings.theme', val);
    } catch {}
  };

  const handleCurrencyChange = (val: string) => {
    setCurrency(val);
    try {
      localStorage.setItem('settings.currency', val);
    } catch {}
  };

  const handleSaveNotifs = async () => {
    setSavingNotifs(true);
    try {
      localStorage.setItem('notifPrefs', JSON.stringify(notifPrefs));
      await new Promise((r) => setTimeout(r, 600));
      toast.success('Notification preferences saved');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setSavingNotifs(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwForm.next.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsChangingPw(true);
    try {
      await usersApi.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
      toast.success('Password updated');
      setShowPasswordChange(false);
      setPwForm({ current: '', next:'', confirm: '' });
    } catch {
      toast.error('Failed to update password. Check your current password.');
    } finally {
      setIsChangingPw(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    // Transparent, sized to the content area — no full-screen colour patch.
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-fiery-orange" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'notifications', label: t('userDashboard.settings.notifications', 'Notifications & Alerts'), icon: Bell },
    { id: 'appearance', label: t('userDashboard.settings.appearance', 'Appearance & Display'), icon: Palette },
    { id: 'security', label: t('userDashboard.settings.security', 'Security & Auth'), icon: Shield },
    { id: 'account', label: t('userDashboard.settings.accountActions', 'Account Actions'), icon: Lock },
  ];

  const notifRows: { key: keyof NotifPrefs; label: string; description: string }[] = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive daily briefings and emergency alerts via email' },
    { key: 'signalAlerts', label: 'Live Signal Push Alerts', description: 'Get real-time push alerts when high-probability signals execute' },
    { key: 'investmentUpdates', label: 'Investment Portfolio Updates', description: 'Notifications when capital allocation returns are posted' },
    { key: 'withdrawalAlerts', label: 'Withdrawal Status Alerts', description: 'Instant notification when payout transfers update' },
    { key: 'profitDistributions', label: 'Profit Share Distributions', description: 'Monthly distribution receipts sent to your registered channel' },
    { key: 'weeklyReport', label: 'Weekly Performance Report', description: 'Automated weekly PnL and trade confluence summary' },
  ];

  return (
    <div className="space-y-8 p-2 font-poppins text-white selection:bg-fiery-orange selection:text-black sm:p-4 [color-scheme:dark]">
      {/* ══ HEADER ══ */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-fiery-orange/20 bg-fiery-orange/10 px-3.5 py-1 text-xs font-bold text-fiery-amber">
            <Sliders className="h-3.5 w-3.5 text-fiery-orange" />
            {t('userDashboard.settings.badge', 'SYSTEM PREFERENCES & SECURITY')}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {t('userDashboard.settings.title', 'Account')}{' '}
            <span className="bg-gradient-to-r from-fiery-orange to-fiery-amber bg-clip-text text-transparent">
              {t('userDashboard.settings.titleHighlight', 'Settings')}
            </span>
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            {t(
              'userDashboard.settings.subtitle',
              'Configure real-time alerts, appearance themes, security settings, and notifications.'
            )}
          </p>
        </div>
      </div>

      {/* ══ TAB NAVIGATION BAR ══ */}
      <div
        role="tablist"
        aria-label="Settings sections"
        className="flex items-center gap-1 overflow-x-auto border-b border-white/10 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors ${FOCUS_RING} ${
                active ? PILL_ACTIVE : PILL_INACTIVE
              }`}
            >
              <tab.icon className={`h-4 w-4 ${active ? 'text-fiery-orange' : ''}`} />
              {tab.label}
              {active && (
                <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-fiery-orange" />
              )}
            </button>
          );
        })}
      </div>

      {/* ══ TAB CONTENT ══ */}

      {/* 1. NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <SectionCard title="Notification & Signal Alert Preferences" icon={Bell}>
          {notifRows.map((row) => (
            <SettingRow
              key={row.key}
              label={row.label}
              description={row.description}
              action={
                <Toggle
                  label={row.label}
                  enabled={notifPrefs[row.key]}
                  onChange={() => toggleNotif(row.key)}
                />
              }
            />
          ))}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveNotifs}
              disabled={savingNotifs}
              className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fiery-orange to-fiery-amber px-6 py-3 text-xs font-extrabold text-black shadow-lg shadow-fiery-orange/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${FOCUS_RING}`}
            >
              {savingNotifs ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              {savingNotifs ? 'Saving...' : 'Save Notification Preferences'}
            </button>
          </div>
        </SectionCard>
      )}

      {/* 2. APPEARANCE */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <SectionCard title="Display Theme & Interface Mode" icon={Palette}>
            <SettingRow
              label="Visual Theme"
              description="Select display mode for dashboard charts and panels"
              action={
                <div className="flex gap-2">
                  {THEME_OPTIONS.map((opt) => {
                    const active = theme === opt.val;
                    return (
                      <button
                        key={opt.val}
                        onClick={() => handleThemeChange(opt.val)}
                        aria-pressed={active}
                        className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${FOCUS_RING} ${
                          active ? PILL_ACTIVE : PILL_INACTIVE_BORDERED
                        }`}
                      >
                        <opt.icon className={`h-3.5 w-3.5 ${active ? 'text-fiery-orange' : ''}`} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              }
            />
            <SettingRow
              label="Base Currency"
              description="Default currency denomination for PnL and trade values"
              action={
                <select
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className={SELECT_CLASS}
                  aria-label="Base currency"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c} className="bg-zinc-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              }
            />
          </SectionCard>

          <SectionCard title={t('settings.regionalLanguage', 'Regional Language Settings')} icon={Globe}>
            <SettingRow
              label={t('settings.interfaceLanguage', 'Interface Language')}
              description={t('settings.interfaceLanguageDesc', 'Select preferred platform language')}
              action={
                <select
                  value={locale}
                  onChange={(e) => {
                    const newLoc = e.target.value as Locale;
                    setLocale(newLoc);
                    const opt = langOptions.find((o) => o.value === newLoc);
                    toast.success(`Language updated to ${opt?.label || newLoc}`);
                  }}
                  className={SELECT_CLASS}
                  aria-label="Interface language"
                >
                  {langOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                      {opt.flag} {opt.nativeLabel} ({opt.label})
                    </option>
                  ))}
                </select>
              }
            />
          </SectionCard>
        </div>
      )}

      {/* 3. SECURITY */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <SectionCard title="Authentication & Password Security" icon={Shield}>
            <SettingRow
              label="Password Credentials"
              description="Update your account login password"
              action={
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className={`flex items-center gap-2 rounded-xl border border-fiery-orange/30 bg-fiery-orange/10 px-4 py-2 text-xs font-bold text-fiery-amber transition-colors hover:bg-fiery-orange/20 ${FOCUS_RING}`}
                >
                  <Key className="h-3.5 w-3.5" />
                  {showPasswordChange ? 'Cancel' : 'Change Password'}
                </button>
              }
            />

            {showPasswordChange && (
              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-4 rounded-2xl border border-white/10 bg-panel-dark/80 p-5"
              >
                <div>
                  <label htmlFor="pw-current" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Current Password
                  </label>
                  <input
                    id="pw-current"
                    type="password"
                    autoComplete="current-password"
                    value={pwForm.current}
                    onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="pw-new" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    New Password
                  </label>
                  <input
                    id="pw-new"
                    type="password"
                    autoComplete="new-password"
                    value={pwForm.next}
                    onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="pw-confirm" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Confirm New Password
                  </label>
                  <input
                    id="pw-confirm"
                    type="password"
                    autoComplete="new-password"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPw}
                    className={`rounded-xl bg-fiery-orange px-5 py-2.5 text-xs font-extrabold text-black shadow-lg shadow-fiery-orange/20 transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${FOCUS_RING}`}
                  >
                    {isChangingPw ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            <SettingRow
              label="Two-Factor Authentication (2FA)"
              description="Hardware key or Authenticator App protection"
              action={
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-extrabold text-zinc-400">
                  Coming Soon
                </span>
              }
            />

            <SettingRow
              label="Active Connected Sessions"
              description="1 active browser session connected"
              action={
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Active Session
                </span>
              }
            />
          </SectionCard>
        </div>
      )}

      {/* 4. ACCOUNT ACTIONS */}
      {activeTab === 'account' && (
        <SectionCard title="Account Management & Session Control" icon={Lock}>
          <SettingRow
            label="Sign Out Session"
            description="Safely end active session and return to home portal"
            action={
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/[0.08] ${FOCUS_RING}`}
              >
                <LogOut className="h-4 w-4 text-rose-400" />
                Sign Out
              </button>
            }
          />
          <SettingRow
            label="Request Account Deletion"
            description="Permanently erase account profile and personal data ledger"
            action={
              <button
                onClick={() => toast.info('Please contact the support desk to process account deletion')}
                className={`flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-500/20 ${FOCUS_RING}`}
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
            }
          />
        </SectionCard>
      )}
    </div>
  );
}