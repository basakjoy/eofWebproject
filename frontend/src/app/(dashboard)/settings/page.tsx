'use client';

import { useEffect, useState, useCallback } from 'react';
import { usersApi } from '@/lib/usersApi';
import {
  Bell, Lock, Palette, Globe, Shield, Trash2,
  CheckCircle, AlertCircle, RefreshCw, ChevronRight,
  Mail, Smartphone, TrendingUp, Zap, Moon, Sun,
  Monitor, LogOut, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-4 duration-300 max-w-sm ${
      type === 'success' ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-rose-950 border-rose-800 text-rose-300'
    }`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
        enabled ? 'bg-blue-600' : 'bg-slate-700'
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

function SectionCard({ title, icon: Icon, iconColor = 'text-blue-400', iconBg = 'bg-blue-600/20 border-blue-500/20', children }: {
  title: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h2 className="font-bold text-white">{title}</h2>
      </div>
      <div className="p-6 space-y-3">{children}</div>
    </div>
  );
}

// ─── Setting Row ──────────────────────────────────────────────────────────────

function SettingRow({ label, description, action }: {
  label: string;
  description?: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 hover:border-slate-600/60 transition-all">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ title, message, onConfirm, onCancel, danger = false }: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
        <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all text-white ${
              danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Notification prefs type ──────────────────────────────────────────────────

interface NotifPrefs {
  emailNotifications: boolean;
  signalAlerts: boolean;
  investmentUpdates: boolean;
  withdrawalAlerts: boolean;
  profitDistributions: boolean;
  marketNews: boolean;
  weeklyReport: boolean;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const [loading, setLoading] = useState(true);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profile, setProfile] = useState<{ id: string; name: string; email: string } | null>(null);

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  // Language
  const [language, setLanguage] = useState('en');

  // Currency display
  const [currency, setCurrency] = useState('USD');

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState<'private' | 'public'>('private');

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

  const toggleNotif = (key: keyof NotifPrefs) =>
    setNotifPrefs(p => ({ ...p, [key]: !p[key] }));

  // Load profile
  const loadProfile = useCallback(async () => {
    try {
      const res = await usersApi.getCurrentUserProfile();
      if (res?.data) setProfile(res.data);
    } catch {
      const raw = localStorage.getItem('user');
      if (raw) setProfile(JSON.parse(raw));
    }
  }, []);

  useEffect(() => {
    loadProfile().finally(() => setLoading(false));
  }, [loadProfile]);

  // Save notification preferences
  const handleSaveNotifs = async () => {
    setSavingNotifs(true);
    try {
      // Persist locally (backend doesn't have a notif-prefs endpoint yet)
      localStorage.setItem('notifPrefs', JSON.stringify(notifPrefs));
      await new Promise(r => setTimeout(r, 600)); // simulate save
      showToast('Notification preferences saved!', 'success');
    } catch {
      showToast('Failed to save preferences.', 'error');
    } finally {
      setSavingNotifs(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Apply saved notif prefs on load
  useEffect(() => {
    const saved = localStorage.getItem('notifPrefs');
    if (saved) {
      try { setNotifPrefs(JSON.parse(saved)); } catch {}
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 space-y-6 bg-slate-950 text-white">

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showLogoutConfirm && (
        <ConfirmDialog
          title="Sign out?"
          message="You will be redirected to the login page. Any unsaved changes will be lost."
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmDialog
          danger
          title="Delete Account?"
          message="This action is permanent and cannot be undone. All your data, investments, and transaction history will be permanently removed."
          onConfirm={() => {
            setShowDeleteConfirm(false);
            showToast('Please contact support to complete account deletion.', 'error');
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your preferences, notifications & security</p>
      </div>

      {/* Account Summary */}
      {profile && (
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/5 border border-blue-500/15">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1d4ed8&color=fff&size=64&bold=true`}
            alt={profile.name}
            className="w-12 h-12 rounded-xl border border-blue-500/30"
          />
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{profile.name}</p>
            <p className="text-slate-400 text-sm truncate">{profile.email}</p>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="ml-auto flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors shrink-0"
          >
            Edit Profile <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── Notifications ── */}
      <SectionCard title="Notifications" icon={Bell}>
        <SettingRow
          label="Email Notifications"
          description="Receive important updates via email"
          action={<Toggle enabled={notifPrefs.emailNotifications} onChange={() => toggleNotif('emailNotifications')} />}
        />
        <SettingRow
          label="Signal Alerts"
          description="Get notified when new trading signals are published"
          action={<Toggle enabled={notifPrefs.signalAlerts} onChange={() => toggleNotif('signalAlerts')} />}
        />
        <SettingRow
          label="Investment Updates"
          description="Status changes on your active investments"
          action={<Toggle enabled={notifPrefs.investmentUpdates} onChange={() => toggleNotif('investmentUpdates')} />}
        />
        <SettingRow
          label="Withdrawal Alerts"
          description="Notifications when withdrawals are processed or rejected"
          action={<Toggle enabled={notifPrefs.withdrawalAlerts} onChange={() => toggleNotif('withdrawalAlerts')} />}
        />
        <SettingRow
          label="Profit Distributions"
          description="Alert when monthly profit is distributed to your account"
          action={<Toggle enabled={notifPrefs.profitDistributions} onChange={() => toggleNotif('profitDistributions')} />}
        />
        <SettingRow
          label="Market News"
          description="Latest forex market news and economic events"
          action={<Toggle enabled={notifPrefs.marketNews} onChange={() => toggleNotif('marketNews')} />}
        />
        <SettingRow
          label="Weekly Summary Report"
          description="A weekly overview of your portfolio performance"
          action={<Toggle enabled={notifPrefs.weeklyReport} onChange={() => toggleNotif('weeklyReport')} />}
        />

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveNotifs}
            disabled={savingNotifs}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-all"
          >
            {savingNotifs ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {savingNotifs ? 'Saving…' : 'Save Preferences'}
          </button>
        </div>
      </SectionCard>

      {/* ── Appearance ── */}
      <SectionCard title="Appearance" icon={Palette} iconColor="text-violet-400" iconBg="bg-violet-600/20 border-violet-500/20">
        <SettingRow
          label="Theme"
          description="Choose your preferred color theme"
          action={
            <div className="flex gap-1.5">
              {([
                { val: 'light', icon: Sun, label: 'Light' },
                { val: 'dark', icon: Moon, label: 'Dark' },
                { val: 'system', icon: Monitor, label: 'Auto' },
              ] as const).map(t => (
                <button
                  key={t.val}
                  onClick={() => setTheme(t.val)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    theme === t.val
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <t.icon className="w-3 h-3" />
                  {t.label}
                </button>
              ))}
            </div>
          }
        />
        <SettingRow
          label="Currency Display"
          description="Default currency for amounts across the dashboard"
          action={
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:border-blue-500 transition-colors"
            >
              {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          }
        />
      </SectionCard>

      {/* ── Language & Region ── */}
      <SectionCard title="Language & Region" icon={Globe} iconColor="text-emerald-400" iconBg="bg-emerald-600/20 border-emerald-500/20">
        <SettingRow
          label="Language"
          description="Select your preferred interface language"
          action={
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="en">🇬🇧 English</option>
              <option value="es">🇪🇸 Spanish</option>
              <option value="fr">🇫🇷 French</option>
              <option value="de">🇩🇪 German</option>
              <option value="ar">🇸🇦 Arabic</option>
            </select>
          }
        />
      </SectionCard>

      {/* ── Privacy & Security ── */}
      <SectionCard title="Privacy & Security" icon={Shield} iconColor="text-amber-400" iconBg="bg-amber-600/20 border-amber-500/20">
        <SettingRow
          label="Profile Visibility"
          description="Control who can see your profile information"
          action={
            <div className="flex gap-1.5">
              {(['private', 'public'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setProfileVisibility(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    profileVisibility === v
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          }
        />
        <SettingRow
          label="Two-Factor Authentication"
          description="Enhance security with an extra verification step"
          action={
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-700 text-slate-400 border border-slate-600">
              Coming soon
            </span>
          }
        />
        <SettingRow
          label="Active Sessions"
          description="You are currently signed in on this device"
          action={
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">1 active</span>
            </div>
          }
        />
      </SectionCard>

      {/* ── Account Actions ── */}
      <SectionCard title="Account" icon={Lock} iconColor="text-slate-400" iconBg="bg-slate-700/50 border-slate-600/40">
        <SettingRow
          label="Sign Out"
          description="Securely log out of your account"
          action={
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-all border border-slate-600"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          }
        />
        <SettingRow
          label="Delete Account"
          description="Permanently remove your account and all associated data"
          action={
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 font-bold text-xs transition-all border border-rose-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          }
        />
      </SectionCard>

      {/* App version footer */}
      <p className="text-center text-xs text-slate-700 pb-4">
        Empire of Forex © {new Date().getFullYear()} · v1.0.0
      </p>
    </div>
  );
}
