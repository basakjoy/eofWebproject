'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Loader2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { brokersApi } from '@/lib/brokersApi';

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
      'fixed bottom-4 right-4 flex items-center gap-3 rounded px-4 py-3 shadow-lg transition-all animate-in slide-in-from-bottom-5 z-50',
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

export default function AdminBrokersPage() {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [featuresInput, setFeaturesInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    website: '',
    logo: '',
    email: '',
    phone: '',
    country: '',
    status: 'active',
    rating: '5.0',
    minimumDeposit: '',
    leverage: '',
    spreads: '',
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const fetchBrokers = async () => {
    setLoading(true);
    try {
      const result = await brokersApi.getAllBrokers({ limit: 100 });
      if (result.success && result.data) {
        setBrokers(result.data);
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to fetch brokers',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        minimumDeposit: formData.minimumDeposit ? parseFloat(formData.minimumDeposit) : undefined,
        rating: formData.rating ? parseFloat(formData.rating) : 5.0,
        features: featuresInput.split(',').map(f => f.trim()).filter(Boolean),
      };
      
      const result = await brokersApi.createBroker(payload);

      if (result.success) {
        showToast(`Broker ${formData.name} created successfully`);
        setFormData({
          name: '',
          code: '',
          website: '',
          logo: '',
          email: '',
          phone: '',
          country: '',
          status: 'active',
          rating: '5.0',
          minimumDeposit: '',
          leverage: '',
          spreads: '',
        });
        setFeaturesInput('');
        await fetchBrokers();
      } else {
        showToast(result.message || 'Failed to create broker', 'error');
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to create broker',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (brokerId: string) => {
    if (!confirm('Are you sure you want to delete this broker?')) return;
    
    try {
      setDeletingId(brokerId);
      const result = await brokersApi.deleteBroker(brokerId);

      if (result.success) {
        showToast('Broker deleted successfully');
        await fetchBrokers();
      } else {
        showToast(result.message || 'Failed to delete broker', 'error');
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to delete broker',
        'error'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBrokers = brokers.filter(
    (broker) =>
      broker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 p-6 pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="w-6 h-6 text-amber-600" />
          <h1 className="text-3xl font-bold tracking-tight">Broker Management</h1>
        </div>
        <p className="text-zinc-400 text-sm">Manage the forex brokers listed on your platform</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Add Broker Form */}
        <div className="xl:col-span-1">
          <div className="bg-zinc-800 rounded-sm border border-zinc-700 p-6 sticky top-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                Add New Broker
              </h2>
              <p className="text-xs text-zinc-400">Fill in details to add a new broker</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Exness"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. EXN"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://exness.com"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="support@exness.com"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Logo URL</label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="/images/exness.png"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Cyprus"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Initial Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="5.0"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Min Deposit</label>
                  <input
                    type="number"
                    value={formData.minimumDeposit}
                    onChange={(e) => setFormData({ ...formData, minimumDeposit: e.target.value })}
                    placeholder="10"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Leverage</label>
                  <input
                    type="text"
                    value={formData.leverage}
                    onChange={(e) => setFormData({ ...formData, leverage: e.target.value })}
                    placeholder="1:2000"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Spreads</label>
                  <input
                    type="text"
                    value={formData.spreads}
                    onChange={(e) => setFormData({ ...formData, spreads: e.target.value })}
                    placeholder="From 0.0"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 uppercase">Features (Comma Separated)</label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="MT4/MT5, Crypto deposits, Copy Trading"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-sm px-3 py-2 text-sm outline-none focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.code}
                className="w-full mt-2 bg-amber-600 hover:bg-amber-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-zinc-900 font-semibold text-sm py-2.5 px-4 rounded-sm transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                ) : null}
                Add Broker
              </button>
            </form>
          </div>
        </div>

        {/* Right: Brokers List */}
        <div className="xl:col-span-2">
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search brokers..."
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
            ) : filteredBrokers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <Briefcase className="w-8 h-8 text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-400">No brokers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-700/50 border-b border-zinc-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">Broker</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">Code</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">Min Dep.</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">Leverage</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase">Rating</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {filteredBrokers.map((broker) => (
                      <tr key={broker.id} className="hover:bg-zinc-700/20 transition-colors">
                        <td className="px-4 py-3 text-zinc-200 font-medium">
                          {broker.logo ? (
                            <div className="flex items-center gap-2">
                              <img src={broker.logo} alt={broker.name} className="w-6 h-6 object-contain rounded bg-white" />
                              {broker.name}
                            </div>
                          ) : (
                            broker.name
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-amber-600">{broker.code}</td>
                        <td className="px-4 py-3 text-zinc-300">${broker.minimumDeposit || '-'}</td>
                        <td className="px-4 py-3 text-zinc-300">{broker.leverage || '-'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block bg-zinc-700 text-amber-500 text-xs font-semibold px-2 py-1 rounded">
                            ★ {broker.rating}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(broker.id)}
                            disabled={deletingId === broker.id}
                            className="text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                          >
                            {deletingId === broker.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

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
