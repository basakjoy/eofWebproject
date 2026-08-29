'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Edit2, Trash2, Eye, RefreshCw, X, Plus, Users as UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';

type ManagedUser = { id: string; name: string; email: string; role: string; status: string };
type FormState = { name: string; email: string; password: string; role: string; status: string };
const emptyForm: FormState = { name: '', email: '', password: '', role: 'user', status: 'active' };

// Soft, glowy tints tuned for a near-black/navy surface — a light tinted fill
// with a matching ring reads clearly without ever going full white-on-dark.
const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-300 ring-1 ring-inset ring-red-500/25',
  premium: 'bg-blue-500/10 text-blue-300 ring-1 ring-inset ring-blue-500/25',
  investor: 'bg-purple-500/10 text-purple-300 ring-1 ring-inset ring-purple-500/25',
  trader: 'bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/25',
  user: 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/10',
};

const getRoleStyle = (role: string) => ROLE_STYLES[role.toLowerCase()] ?? ROLE_STYLES.user;

const getInitials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || '?';

const AVATAR_HUES = [
  'bg-slate-500/15 text-slate-300',
  'bg-teal-500/15 text-teal-300',
  'bg-indigo-500/15 text-indigo-300',
  'bg-rose-500/15 text-rose-300',
  'bg-emerald-500/15 text-emerald-300',
];
const getAvatarHue = (seed: string) => AVATAR_HUES[[...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_HUES.length];

export default function UserManager() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState<ManagedUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllUsers();
      setUsers(Array.isArray(response?.data) ? response.data : []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadUsers(); }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminApi.updateUser(editingId, { name: form.name, role: form.role, status: form.status });
      } else {
        await adminApi.createUser({ name: form.name, email: form.email, password: form.password, role: form.role as 'user' | 'admin' | 'trader' });
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const edit = (user: ManagedUser) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, status: user.status });
    setShowForm(true);
  };

  const remove = async (user: ManagedUser) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    setDeletingId(user.id);
    try {
      await adminApi.deleteUser(user.id);
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white">User Management</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            {loading ? 'Loading accounts…' : `${users.length} account${users.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => void loadUsers()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}>
            <Plus className="h-4 w-4" />
            Add user
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span>{error}</span>
          <button onClick={() => setError('')} aria-label="Dismiss error" className="shrink-0 rounded p-0.5 text-red-300/80 transition-colors hover:bg-red-500/15 hover:text-red-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-5 grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-5">
          <div className="md:col-span-5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">{editingId ? 'Edit user' : 'New user'}</h3>
            <button type="button" onClick={closeForm} aria-label="Close form" className="rounded p-1 text-slate-500 transition-colors hover:bg-white/10 hover:text-slate-300">
              <X className="h-4 w-4" />
            </button>
          </div>
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition-shadow focus:border-white/20 focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            required={!editingId}
            type="email"
            placeholder="Email"
            value={form.email}
            disabled={!!editingId}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition-shadow focus:border-white/20 focus:ring-2 focus:ring-blue-500/30 disabled:bg-white/[0.02] disabled:text-slate-500"
          />
          {!editingId && (
            <input
              required
              type="password"
              minLength={6}
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition-shadow focus:border-white/20 focus:ring-2 focus:ring-blue-500/30"
            />
          )}
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition-shadow focus:border-white/20 focus:ring-2 focus:ring-blue-500/30 [&>option]:bg-slate-900"
          >
            <option value="user">User</option>
            <option value="premium">Premium</option>
            <option value="investor">Investor</option>
            <option value="trader">Trader</option>
            <option value="admin">Admin</option>
          </select>
          {editingId && (
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition-shadow focus:border-white/20 focus:ring-2 focus:ring-blue-500/30 [&>option]:bg-slate-900"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          )}
          <div className="flex gap-2 md:col-span-5">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create user'}
            </Button>
            <Button type="button" size="sm" onClick={closeForm}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-xs font-medium uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3.5" colSpan={5}>
                    <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center">
                  <UsersIcon className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="mt-2 text-sm font-medium text-slate-400">No users yet</p>
                  <p className="text-sm text-slate-500">Add a user to get started.</p>
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarHue(user.id || user.email)}`}>
                        {getInitials(user.name)}
                      </span>
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getRoleStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setViewing(user)} aria-label={`View ${user.name}`} className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-blue-500/10 hover:text-blue-300">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => edit(user)} aria-label={`Edit ${user.name}`} className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-amber-500/10 hover:text-amber-300">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => void remove(user)}
                        aria-label={`Delete ${user.name}`}
                        disabled={deletingId === user.id}
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                      >
                        <Trash2 className={`h-4 w-4 ${deletingId === user.id ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setViewing(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/50" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${getAvatarHue(viewing.id || viewing.email)}`}>
                  {getInitials(viewing.name)}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">{viewing.name}</h3>
                  <p className="text-sm text-slate-400">{viewing.email}</p>
                </div>
              </div>
              <button onClick={() => setViewing(null)} aria-label="Close" className="rounded p-1 text-slate-500 transition-colors hover:bg-white/10 hover:text-slate-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Role</dt>
                <dd className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getRoleStyle(viewing.role)}`}>{viewing.role}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd className="inline-flex items-center gap-1.5 font-medium text-slate-300">
                  <span className={`h-1.5 w-1.5 rounded-full ${viewing.status === 'active' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  {viewing.status === 'active' ? 'Active' : 'Inactive'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </Card>
  );
}