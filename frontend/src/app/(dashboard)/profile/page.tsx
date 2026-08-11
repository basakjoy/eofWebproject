'use client';

import { useEffect, useState, useCallback } from 'react';
import { usersApi } from '@/lib/usersApi';
import {
  User, Mail, Phone, MapPin, Lock, Shield,
  Camera, Save, RefreshCw, CheckCircle, AlertCircle,
  Eye, EyeOff, Pencil, X, Key
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  phone?: string;
  location?: string;
  bio?: string;
}

interface ProfileForm {
  name: string;
  phone: string;
  location: string;
  bio: string;
}

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

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

// ─── Input Field ─────────────────────────────────────────────────────────────

function FieldInput({
  label, icon: Icon, value, onChange, type = 'text', disabled = false, placeholder = ''
}: {
  label: string; icon: React.ElementType; value: string;
  onChange: (v: string) => void; type?: string; disabled?: boolean; placeholder?: string;
}) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type={isPassword && !showPw ? 'password' : 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 ${isPassword ? 'pr-10' : 'pr-4'} py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 ${
            disabled ? 'text-slate-500 cursor-not-allowed' : 'text-white'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
          <Icon className="w-4 h-4 text-blue-400" />
        </div>
        <h2 className="font-bold text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const [form, setForm] = useState<ProfileForm>({ name: '', phone: '', location: '', bio: '' });
  const [pwForm, setPwForm] = useState<PasswordForm>({ current: '', next: '', confirm: '' });
  const [editing, setEditing] = useState(false);
  const [pwSection, setPwSection] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const res = await usersApi.getCurrentUserProfile();
      const u: UserProfile = res?.data ?? {};
      setProfile(u);
      setForm({
        name: u.name ?? '',
        phone: (u as any).phone ?? '',
        location: (u as any).location ?? '',
        bio: (u as any).bio ?? '',
      });
    } catch {
      // Try from localStorage fallback
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setProfile(u);
        setForm({ name: u.name ?? '', phone: '', location: '', bio: '' });
      }
    }
  }, []);

  useEffect(() => {
    loadProfile().finally(() => setLoading(false));
  }, [loadProfile]);

  const handleSave = async () => {
    if (!form.name.trim()) { showToast('Name cannot be empty.', 'error'); return; }
    setSaving(true);
    try {
      await usersApi.updateUser(profile!.id, { name: form.name });
      setProfile(p => p ? { ...p, name: form.name } : p);
      setEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      showToast('All password fields are required.', 'error'); return;
    }
    if (pwForm.next !== pwForm.confirm) {
      showToast('New passwords do not match.', 'error'); return;
    }
    if (pwForm.next.length < 6) {
      showToast('New password must be at least 6 characters.', 'error'); return;
    }
    setChangingPw(true);
    try {
      await usersApi.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwForm({ current: '', next: '', confirm: '' });
      setPwSection(false);
      showToast('Password changed successfully!', 'success');
    } catch {
      showToast('Failed to change password. Check your current password.', 'error');
    } finally {
      setChangingPw(false);
    }
  };

  const avatarUrl = profile
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1d4ed8&color=fff&size=128&bold=true`
    : '';

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ADMIN: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    USER: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account information and security settings</p>
      </div>

      {/* Profile Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/10 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <img
              src={avatarUrl}
              alt={profile?.name ?? 'User'}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500/30 shadow-xl"
            />
            <button className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h2 className="text-2xl font-black text-white">{profile?.name ?? '—'}</h2>
              {profile?.role && (
                <span className={`inline-flex text-xs font-bold px-3 py-1 rounded-full border ${roleColors[profile.role] ?? roleColors.USER}`}>
                  {profile.role}
                </span>
              )}
              {profile?.status && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {profile.status}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm">{profile?.email}</p>
            {profile?.createdAt && (
              <p className="text-slate-600 text-xs mt-1">
                Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>

          {/* Edit toggle */}
          <button
            onClick={() => { setEditing(!editing); setPwSection(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shrink-0 ${
              editing
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {editing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <SectionCard title="Personal Information" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FieldInput
            label="Full Name" icon={User} value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            disabled={!editing} placeholder="Your full name"
          />
          <FieldInput
            label="Email Address" icon={Mail} value={profile?.email ?? ''}
            onChange={() => {}} disabled={true}
          />
          <FieldInput
            label="Phone Number" icon={Phone} value={form.phone}
            onChange={v => setForm(f => ({ ...f, phone: v }))}
            disabled={!editing} placeholder="+1 (555) 000-0000"
          />
          <FieldInput
            label="Location" icon={MapPin} value={form.location}
            onChange={v => setForm(f => ({ ...f, location: v }))}
            disabled={!editing} placeholder="City, Country"
          />
        </div>

        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            disabled={!editing}
            rows={3}
            placeholder="Tell us a little about yourself..."
            className={`w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm transition-all focus:outline-none focus:border-blue-500 resize-none ${
              !editing ? 'text-slate-500 cursor-not-allowed' : 'text-white'
            }`}
          />
        </div>

        {editing && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-all"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        )}
      </SectionCard>

      {/* Security Section */}
      <SectionCard title="Security" icon={Shield}>
        <div className="space-y-3">
          {/* Change password CTA */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center">
                <Key className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Change Password</p>
                <p className="text-xs text-slate-500">Update your login credentials</p>
              </div>
            </div>
            <button
              onClick={() => { setPwSection(!pwSection); setEditing(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                pwSection ? 'bg-slate-700 text-white' : 'bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30'
              }`}
            >
              {pwSection ? 'Cancel' : 'Change'}
            </button>
          </div>

          {/* Password change form */}
          {pwSection && (
            <div className="p-5 rounded-xl border border-slate-700/60 bg-slate-800/30 space-y-4">
              <FieldInput
                label="Current Password" icon={Lock} value={pwForm.current}
                onChange={v => setPwForm(f => ({ ...f, current: v }))} type="password"
              />
              <FieldInput
                label="New Password" icon={Lock} value={pwForm.next}
                onChange={v => setPwForm(f => ({ ...f, next: v }))} type="password"
                placeholder="Min. 6 characters"
              />
              <FieldInput
                label="Confirm New Password" icon={Lock} value={pwForm.confirm}
                onChange={v => setPwForm(f => ({ ...f, confirm: v }))} type="password"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPw}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-all"
                >
                  {changingPw ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {changingPw ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

          {/* 2FA row */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-400 border border-slate-600">
              Coming soon
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
