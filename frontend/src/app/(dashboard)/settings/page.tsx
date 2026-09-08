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
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Mail,
  Smartphone,
  TrendingUp,
  Zap,
  Moon,
  Sun,
  Monitor,
  LogOut,
  Sliders,
  DollarSign,
  Key,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
        enabled ? 'bg-gradient-to-r from-fiery-orange to-fiery-amber shadow-fiery/20' : 'bg-zinc-800'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
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
    <div className="rounded-3xl bg-card-dark/80 border border-white/10 backdrop-blur-xl overflow-hidden space-y-1">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 bg-panel-dark/50">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-fiery-orange/30 bg-fiery-orange/10 text-fiery-orange">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="font-extrabold text-white text-base tracking-tight">{title}</h2>
      </div>
      <div className="p-6 space-y-3">{children}</div>
    </div>
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
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-panel-dark/60 border border-white/5 hover:border-white/10 transition-all">
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-bold text-white">{label}</p>
        {description && <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed font-light">{description}</p>}
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

export default function RefinedSettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'appearance' | 'security' | 'account'>('notifications');
  const [profile, setProfile] = useState<{ id: string; name: string; email: string } | null>(null);

  // Theme & Preferences
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [profileVisibility, setProfileVisibility] = useState<'private' | 'public'>('private');

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
      const raw = localStorage.getItem('user');
      if (raw) setProfile(JSON.parse(raw));
    }
  }, []);

  useEffect(() => {
    loadSettings().finally(() => setLoading(false));

    const savedNotifs = localStorage.getItem('notifPrefs');
    if (savedNotifs) {
      try {
        setNotifPrefs(JSON.parse(savedNotifs));
      } catch {}
    }
  }, [loadSettings]);

  const handleSaveNotifs = async () => {
    setSavingNotifs(true);
    try {
      localStorage.setItem('notifPrefs', JSON.stringify(notifPrefs));
      await new Promise((r) => setTimeout(r, 600));
      toast.success('Notification preferences saved successfully!');
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
      toast.success('Password updated successfully!');
      setShowPasswordChange(false);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch {
      toast.error('Failed to update password. Verify current password.');
    } finally {
      setIsChangingPw(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030305]">
        <RefreshCw className="w-8 h-8 text-fiery-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2 sm:p-4 text-white font-poppins selection:bg-fiery-orange selection:text-white">
      
      {/* ══ HEADER ══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fiery-orange/10 border border-fiery-orange/20 text-xs font-bold text-fiery-amber mb-2">
            <Sliders className="w-3.5 h-3.5 text-fiery-orange" />
            SYSTEM PREFERENCES & SECURITY
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-fiery-orange to-fiery-amber">Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Configure real-time alerts, appearance themes, security settings, and notifications.
          </p>
        </div>
      </div>

      {/* ══ TAB NAVIGATION BAR ══ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
        {[
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
          { id: 'appearance', label: 'Appearance & Display', icon: Palette },
          { id: 'security', label: 'Security & Auth', icon: Shield },
          { id: 'account', label: 'Account Actions', icon: Lock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeTab === tab.id
                ? 'bg-fiery-orange text-black border-fiery-orange shadow-fiery/20'
                : 'bg-card-dark/60 text-zinc-400 border-white/10 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══ TAB CONTENT ══ */}

      {/* 1. NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <SectionCard title="Notification & Signal Alert Preferences" icon={Bell}>
          <SettingRow
            label="Email Notifications"
            description="Receive daily briefings and emergency alerts via email"
            action={<Toggle enabled={notifPrefs.emailNotifications} onChange={() => toggleNotif('emailNotifications')} />}
          />
          <SettingRow
            label="Live Signal Push Alerts"
            description="Get real-time push alerts when high-probability signals execute"
            action={<Toggle enabled={notifPrefs.signalAlerts} onChange={() => toggleNotif('signalAlerts')} />}
          />
          <SettingRow
            label="Investment Portfolio Updates"
            description="Notifications when capital allocation returns are posted"
            action={<Toggle enabled={notifPrefs.investmentUpdates} onChange={() => toggleNotif('investmentUpdates')} />}
          />
          <SettingRow
            label="Withdrawal Status Alerts"
            description="Instant notification when payout transfers update"
            action={<Toggle enabled={notifPrefs.withdrawalAlerts} onChange={() => toggleNotif('withdrawalAlerts')} />}
          />
          <SettingRow
            label="Profit Share Distributions"
            description="Monthly distribution receipts sent to your registered channel"
            action={<Toggle enabled={notifPrefs.profitDistributions} onChange={() => toggleNotif('profitDistributions')} />}
          />
          <SettingRow
            label="Weekly Performance Report"
            description="Automated weekly PnL and trade confluence summary"
            action={<Toggle enabled={notifPrefs.weeklyReport} onChange={() => toggleNotif('weeklyReport')} />}
          />

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSaveNotifs}
              disabled={savingNotifs}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-fiery-orange to-fiery-amber text-black font-extrabold text-xs shadow-fiery hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {savingNotifs ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <CheckCircle className="w-4 h-4 text-black" />}
              {savingNotifs ? 'Saving...' : 'Save Notification Preferences'}
            </button>
          </div>
        </SectionCard>
      )}

      {/* 2. APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <SectionCard title="Display Theme & Interface Mode" icon={Palette}>
            <SettingRow
              label="Visual Theme"
              description="Select display mode for dashboard charts and panels"
              action={
                <div className="flex gap-2">
                  {[
                    { val: 'light', icon: Sun, label: 'Light' },
                    { val: 'dark', icon: Moon, label: 'Dark' },
                    { val: 'system', icon: Monitor, label: 'System' },
                  ].map((t) => (
                    <button
                      key={t.val}
                      onClick={() => setTheme(t.val as any)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        theme === t.val
                          ? 'bg-fiery-orange text-black border-fiery-orange'
                          : 'bg-panel-dark text-zinc-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  ))}
                </div>
              }
            />
            <SettingRow
              label="Base Currency"
              description="Default currency denomination for PnL and trade values"
              action={
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-4 py-2 bg-panel-dark border border-white/10 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-fiery-orange transition-colors"
                >
                  {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              }
            />
          </SectionCard>

          <SectionCard title="Regional Language Settings" icon={Globe}>
            <SettingRow
              label="Interface Language"
              description="Select preferred platform language"
              action={
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-4 py-2 bg-panel-dark border border-white/10 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-fiery-orange transition-colors"
                >
                  <option value="en">🇬🇧 English (US)</option>
                  <option value="es">🇪🇸 Spanish</option>
                  <option value="fr">🇫🇷 French</option>
                  <option value="de">🇩🇪 German</option>
                  <option value="ar">🇸🇦 Arabic</option>
                </select>
              }
            />
          </SectionCard>
        </div>
      )}

      {/* 3. SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <SectionCard title="Authentication & Password Security" icon={Shield}>
            <SettingRow
              label="Password Credentials"
              description="Update your account login password"
              action={
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-fiery-orange/10 border border-fiery-orange/30 text-fiery-amber hover:bg-fiery-orange/20 text-xs font-bold transition-all"
                >
                  <Key className="w-3.5 h-3.5" />
                  {showPasswordChange ? 'Cancel' : 'Change Password'}
                </button>
              }
            />

            {showPasswordChange && (
              <form onSubmit={handlePasswordSubmit} className="p-5 rounded-2xl bg-panel-dark border border-white/10 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={pwForm.current}
                    onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                    className="w-full bg-[#050508] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-fiery-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={pwForm.next}
                    onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#050508] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-fiery-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                    className="w-full bg-[#050508] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-fiery-orange"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPw}
                    className="px-5 py-2.5 rounded-xl bg-fiery-orange text-black font-extrabold text-xs shadow-fiery hover:scale-105 transition-all disabled:opacity-50"
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
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-zinc-800 border border-white/10 text-zinc-400">
                  Coming Soon
                </span>
              }
            />

            <SettingRow
              label="Active Connected Sessions"
              description="1 active browser session connected"
              action={
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Session
                </span>
              }
            />
          </SectionCard>
        </div>
      )}

      {/* 4. ACCOUNT ACTIONS TAB */}
      {activeTab === 'account' && (
        <SectionCard title="Account Management & Session Control" icon={Lock}>
          <SettingRow
            label="Sign Out Session"
            description="Safely end active session and return to home portal"
            action={
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-panel-dark hover:bg-white/5 border border-white/10 text-xs font-bold text-white transition-all"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                Sign Out
              </button>
            }
          />
          <SettingRow
            label="Request Account Deletion"
            description="Permanently erase account profile and personal data ledger"
            action={
              <button
                onClick={() => toast.info('Please contact support desk to process account deletion')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-bold text-rose-400 transition-all"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                Delete Account
              </button>
            }
          />
        </SectionCard>
      )}

    </div>
  );
}
