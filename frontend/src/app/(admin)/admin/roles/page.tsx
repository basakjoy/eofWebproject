'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Loader2,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { adminManagementApi, AdminRecord } from '@/lib/adminManagementApi';

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

type ToastType = 'success' | 'error' | 'warning';

interface ToastState {
  message: string;
  type: ToastType;
}

const Toast = ({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-900 text-green-100',
    error: 'bg-red-900 text-red-100',
    warning: 'bg-amber-900 text-amber-100',
  }[type];

  const Icon = { success: CheckCircle2, error: XCircle, warning: AlertCircle }[type];

  return (
    <div className={cn(
      'fixed bottom-4 right-4 flex items-center gap-3 rounded px-4 py-3 shadow-lg transition-all animate-in slide-in-from-bottom-5',
      bgColor
    )}>
      <Icon className="h-5 w-5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 opacity-70 hover:opacity-100"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
};

const ADMIN_SCOPES = [
  { value: 'SIGNAL_ADMIN', label: 'Signal Admin' },
  { value: 'CONTENT_ADMIN', label: 'Content Admin' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
] as const;

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'trader', label: 'Trader' },
] as const;

export default function RolesPage() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    scope: 'SIGNAL_ADMIN' as const,
  });

  const [revokeData, setRevokeData] = useState<{
    userId: string;
    revertTo: 'user' | 'trader';
  } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const result = await adminManagementApi.listAdmins();
      if (result.success && result.data) {
        setAdmins(result.data);
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to fetch admins',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await adminManagementApi.grantAdmin({
        email: formData.email,
        scope: formData.scope as any,
      });

      if (result.success) {
        showToast(`${formData.email} promoted to ${formData.scope}`);
        setFormData({ email: '', scope: 'SIGNAL_ADMIN' });
        await fetchAdmins();
      } else {
        showToast(result.message || 'Failed to grant admin', 'error');
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to grant admin',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (userId: string) => {
    if (!revokeData || revokeData.userId !== userId) {
      setRevokeData({ userId, revertTo: 'user' });
      return;
    }

    try {
      setDeletingId(userId);
      const result = await adminManagementApi.revokeAdmin(userId, revokeData.revertTo);

      if (result.success) {
        showToast('Admin access revoked');
        setRevokeData(null);
        await fetchAdmins();
      } else {
        showToast(result.message || 'Failed to revoke admin', 'error');
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to revoke admin',
        'error'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 p-6 pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-amber-600" />
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
        </div>
        <p className="text-zinc-400 text-sm">Manage admin roles and access scopes for your platform</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Grant Admin Form */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800 rounded-sm border border-zinc-700 p-6 sticky top-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                Grant Admin Access
              </h2>
              <p className="text-xs text-zinc-400">Add a new admin by email</p>
            </div>

            <form onSubmit={handleGrant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2 uppercase">
                  Scope
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scope: e.target.value as typeof formData.scope,
                    })
                  }
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                >
                  {ADMIN_SCOPES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.email}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-zinc-900 font-semibold text-sm py-2 px-4 rounded-sm transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                ) : null}
                Grant Access
              </button>
            </form>
          </div>
        </div>

        {/* Right: Admins List */}
        <div className="lg:col-span-2">
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-sm pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
            />
          </div>

          {/* Table */}
          <div className="bg-zinc-800 rounded-sm border border-zinc-700 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <Shield className="w-8 h-8 text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-400">No admins found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-700/50 border-b border-zinc-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">
                        Scope
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">
                        Granted
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-300 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {filteredAdmins.map((admin) => (
                      <React.Fragment key={admin.id}>
                        <tr className="hover:bg-zinc-700/20 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-amber-600">
                            {admin.email}
                          </td>
                          <td className="px-4 py-3 text-zinc-200">{admin.name}</td>
                          <td className="px-4 py-3">
                            <span className="inline-block bg-zinc-700 text-zinc-200 text-xs font-semibold px-2 py-1 rounded">
                              {admin.adminScope}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-zinc-400">
                            {new Date(admin.adminScopeGrantedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleRevoke(admin.id)}
                              disabled={deletingId === admin.id}
                              className="text-red-500 hover:text-red-400 disabled:opacity-50"
                            >
                              {deletingId === admin.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {revokeData?.userId === admin.id && (
                          <tr className="bg-red-900/10 border-b border-red-900/50">
                            <td colSpan={5} className="px-4 py-3">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-red-400 mb-2">
                                    Confirm revoke: {admin.email}
                                  </p>
                                  <select
                                    value={revokeData.revertTo}
                                    onChange={(e) =>
                                      setRevokeData({
                                        ...revokeData,
                                        revertTo: e.target.value as 'user' | 'trader',
                                      })
                                    }
                                    className="bg-zinc-800 border border-zinc-700 rounded-sm px-2 py-1 text-xs outline-none"
                                  >
                                    {ROLE_OPTIONS.map((r) => (
                                      <option key={r.value} value={r.value}>
                                        Revert to: {r.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setRevokeData(null)}
                                    className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-sm text-xs font-semibold"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleRevoke(admin.id)}
                                    disabled={deletingId === admin.id}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-sm text-xs font-semibold"
                                  >
                                    Confirm
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
