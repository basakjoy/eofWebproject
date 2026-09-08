'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usersApi } from '@/lib/usersApi';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  Camera,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Pencil,
  X,
  Key,
  Award,
  Sparkles,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Check,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

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
  preferredAsset?: string;
  riskAppetite?: string;
}

export default function RefinedProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    name: '',
    phone: '',
    location: '',
    bio: '',
    preferredAsset: 'Forex Majors (EUR/USD, GBP/USD)',
    riskAppetite: 'Moderate (1-2% Risk / Trade)',
  });

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [changingPw, setChangingPw] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const res = await usersApi.getCurrentUserProfile();
      const u: UserProfile = res?.data ?? {};
      if (u.id) {
        setProfile(u);
        setForm({
          name: u.name ?? '',
          phone: u.phone ?? '',
          location: u.location ?? '',
          bio: u.bio ?? '',
          preferredAsset: 'Forex Majors (EUR/USD, GBP/USD)',
          riskAppetite: 'Moderate (1-2% Risk / Trade)',
        });
      }
    } catch {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setProfile(u);
        setForm({
          name: u.name ?? '',
          phone: u.phone ?? '',
          location: u.location ?? '',
          bio: u.bio ?? '',
          preferredAsset: 'Forex Majors (EUR/USD, GBP/USD)',
          riskAppetite: 'Moderate (1-2% Risk / Trade)',
        });
      }
    }
  }, []);

  useEffect(() => {
    loadProfile().finally(() => setLoading(false));
  }, [loadProfile]);

  const handleSaveProfile = async () => {
    if (!form.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      if (profile?.id) {
        await usersApi.updateUser(profile.id, { name: form.name, phone: form.phone });
      }
      setProfile((p) => (p ? { ...p, name: form.name, phone: form.phone, location: form.location, bio: form.bio } : p));
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
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

    setChangingPw(true);
    try {
      await usersApi.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
      toast.success('Password updated successfully!');
      setShowPasswordChange(false);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch {
      toast.error('Failed to change password. Verify your current password.');
    } finally {
      setChangingPw(false);
    }
  };

  const avatarUrl = profile?.name
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=FF6B00&color=fff&size=128&bold=true`
    : `https://ui-avatars.com/api/?name=Trader&background=FF6B00&color=fff&size=128&bold=true`;

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
            <ShieldCheck className="w-3.5 h-3.5 text-fiery-orange" />
            VERIFIED TRADER IDENTITY
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            User <span className="text-transparent bg-clip-text bg-gradient-to-r from-fiery-orange to-fiery-amber">Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage your personal identity, contact info, trading preferences, and security credentials.
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(!editing);
            setShowPasswordChange(false);
          }}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
            editing
              ? 'bg-panel-dark border border-white/10 text-zinc-300 hover:text-white'
              : 'bg-gradient-to-r from-fiery-orange via-fiery-red to-fiery-amber text-black shadow-fiery hover:scale-105'
          }`}
        >
          {editing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4 text-black" />}
          {editing ? 'Cancel Editing' : 'Edit Profile Info'}
        </button>
      </div>

      {/* ══ HERO COMMAND BANNER ══ */}
      <div className="relative rounded-3xl bg-card-dark/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-fiery-orange/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Avatar Container */}
          <div className="relative group/avatar">
            <img
              src={avatarUrl}
              alt={profile?.name ?? 'User'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-fiery-orange/40 shadow-2xl"
            />
            <button
              onClick={() => toast.info('Avatar generator sync active')}
              className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <Camera className="w-6 h-6 text-fiery-amber" />
            </button>
          </div>

          {/* Info & Badges */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{profile?.name || 'Trader Member'}</h2>
              
              <span className="px-3 py-1 rounded-full bg-fiery-orange/15 border border-fiery-orange/30 text-fiery-amber text-xs font-black uppercase tracking-wider">
                {profile?.role || 'VIP Investor'}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Desk
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 font-mono">{profile?.email}</p>

            <p className="text-[11px] text-zinc-500 font-light flex items-center justify-center sm:justify-start gap-1 pt-1">
              <Award className="w-3.5 h-3.5 text-fiery-amber" />
              Member registered since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2026'}
            </p>
          </div>

        </div>
      </div>

      {/* ══ PERSONAL INFORMATION & TRADING PREFERENCES ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Personal Information Form (7 cols) */}
        <div className="lg:col-span-7 bg-card-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-fiery-orange" />
              Personal Identification
            </h2>
            {editing && <span className="text-xs text-fiery-amber font-bold">Editing Mode Active</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  disabled={!editing}
                  className={`w-full bg-panel-dark border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm transition-all focus:outline-none focus:border-fiery-orange ${
                    !editing ? 'border-white/5 text-zinc-400 cursor-not-allowed' : 'border-white/20 text-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={profile?.email ?? ''}
                  disabled
                  className="w-full bg-panel-dark border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  disabled={!editing}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full bg-panel-dark border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm transition-all focus:outline-none focus:border-fiery-orange ${
                    !editing ? 'border-white/5 text-zinc-400 cursor-not-allowed' : 'border-white/20 text-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Location / City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  disabled={!editing}
                  placeholder="New York, USA"
                  className={`w-full bg-panel-dark border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm transition-all focus:outline-none focus:border-fiery-orange ${
                    !editing ? 'border-white/5 text-zinc-400 cursor-not-allowed' : 'border-white/20 text-white'
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Investor Bio / Notes</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              disabled={!editing}
              placeholder="Institutional trader focused on Forex & Commodities..."
              className={`w-full bg-panel-dark border rounded-2xl p-4 text-xs sm:text-sm transition-all focus:outline-none focus:border-fiery-orange resize-none ${
                !editing ? 'border-white/5 text-zinc-400 cursor-not-allowed' : 'border-white/20 text-white'
              }`}
            />
          </div>

          {editing && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-fiery-orange to-fiery-amber text-black font-extrabold text-xs shadow-fiery hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <Save className="w-4 h-4 text-black" />}
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Right: Security & Trading Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Trading Profile Card */}
          <div className="bg-card-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <TrendingUp className="w-5 h-5 text-fiery-amber" />
              Trading Preferences
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-panel-dark border border-white/5">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Preferred Assets</span>
                <span className="text-white font-bold block mt-1">{form.preferredAsset}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-panel-dark border border-white/5">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Risk Appetite Tier</span>
                <span className="text-emerald-400 font-bold block mt-1">{form.riskAppetite}</span>
              </div>
            </div>
          </div>

          {/* Security Credentials Trigger */}
          <div className="bg-card-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-fiery-orange" />
                Security Credentials
              </h2>
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="px-3.5 py-1.5 rounded-xl bg-fiery-orange/10 border border-fiery-orange/30 text-fiery-amber text-xs font-bold hover:bg-fiery-orange/20 transition-all"
              >
                {showPasswordChange ? 'Close' : 'Change Password'}
              </button>
            </div>

            {showPasswordChange && (
              <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Current Password</label>
                  <input
                    type="password"
                    value={pwForm.current}
                    onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                    className="w-full bg-panel-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-fiery-orange"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">New Password</label>
                  <input
                    type="password"
                    value={pwForm.next}
                    onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                    placeholder="Min 6 characters"
                    className="w-full bg-panel-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-fiery-orange"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                    className="w-full bg-panel-dark border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-fiery-orange"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPw}
                  className="w-full py-3 rounded-xl bg-fiery-orange text-black font-extrabold text-xs shadow-fiery hover:scale-105 transition-all disabled:opacity-50 mt-2"
                >
                  {changingPw ? 'Updating...' : 'Update Security Credentials'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
