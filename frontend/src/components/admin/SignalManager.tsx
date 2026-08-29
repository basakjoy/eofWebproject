import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Clock3,
  Edit2,
  Loader2,
  Sparkles,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  BarChart3,
  Target,
} from "lucide-react";
import { signalsApi, type SignalRecord } from "@/lib/signalsApi";

// --- Utility Functions ---
const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

type SignalStatus = "active" | "closed" | "pending";
type ToastType = "success" | "error";

interface ToastState {
  message: string;
  type: ToastType;
}

interface SignalFormData {
  pair: string;
  type: string;
  entryPrice: string;
  takeProfit1: string;
  takeProfit2: string;
  takeProfit3: string;
  stopLoss: string;
  reliability: string;
  timeframe: string;
  status: SignalStatus;
}

// --- Custom Toast Component for Demo ---
const Toast = ({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) => (
  <div className={`fixed bottom-4 right-4 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg shadow-black/40 border transition-all animate-in slide-in-from-bottom-5 ${type === 'error' ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-white/10 text-white'}`}>
    {type === 'error' ? <XCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
    <p className="text-sm font-medium">{message}</p>
    <button onClick={onClose} className="ml-2 text-white/70 hover:text-white">
      <XCircle className="h-4 w-4" />
    </button>
  </div>
);

// --- Main Application Component ---
export default function App() {
  const [signals, setSignals] = useState<SignalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, PENDING, CLOSED
  const [toast, setToast] = useState<ToastState | null>(null);

  const [formData, setFormData] = useState<SignalFormData>({
    pair: "EUR/USD",
    type: "BUY",
    entryPrice: "",
    takeProfit1: "",
    takeProfit2: "",
    takeProfit3: "",
    stopLoss: "",
    reliability: "85",
    timeframe: "4H",
    status: "active",
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSignals = async () => {
    setIsLoading(true);
    try {
      const response = await signalsApi.getAllSignals({ limit: 100 });
      setSignals(Array.isArray(response.data) ? response.data : []);
    } catch {
      showToast("Failed to fetch signals.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchSignals();
  }, []);

  // Filtered and Searched Signals
  const displayedSignals = useMemo(() => {
    return signals
      .filter((s) => {
        if (statusFilter === "ALL") return true;
        return String(s.status ?? "").toUpperCase() === statusFilter;
      })
      .filter((s) =>
        String(s.pair ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(s.type ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [signals, searchQuery, statusFilter]);

  const activeSignalsCount = useMemo(() => signals.filter((s) => String(s.status ?? "").toLowerCase() === "active").length, [signals]);
  const avgWinRate = useMemo(() => {
    if (signals.length === 0) return 0;
    const total = signals.reduce((acc, curr) => acc + (Number(curr.reliability) || 0), 0);
    return Math.round((total / signals.length) * 100);
  }, [signals]);

  // Dynamic Risk/Reward Calculation
  const calculateRR = () => {
    const entry = parseFloat(formData.entryPrice);
    const sl = parseFloat(formData.stopLoss);
    const tp = parseFloat(formData.takeProfit1);
    
    if (!entry || !sl || !tp || entry === sl) return null;

    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    const rr = (reward / risk).toFixed(2);
    return rr;
  };

  const rrRatio = calculateRR();

  const resetForm = () => {
    setFormData({
      pair: "EUR/USD",
      type: "BUY",
      entryPrice: "",
      takeProfit1: "",
      takeProfit2: "",
      takeProfit3: "",
      stopLoss: "",
      reliability: "85",
      timeframe: "4H",
      status: "active",
    });
    setEditingId(null);
  };

  const handleEdit = (signal: SignalRecord) => {
    setEditingId(signal.id);
    setFormData({
      pair: signal.pair || "EUR/USD",
      type: String(signal.direction || signal.type || "BUY").toUpperCase(),
      entryPrice: signal.entryPrice?.toString() || "",
      takeProfit1: signal.takeProfits?.[0]?.toString() || signal.takeProfit1?.toString() || signal.takeProfit?.toString() || "",
      takeProfit2: signal.takeProfits?.[1]?.toString() || signal.takeProfit2?.toString() || "",
      takeProfit3: signal.takeProfits?.[2]?.toString() || signal.takeProfit3?.toString() || "",
      stopLoss: signal.stopLoss?.toString() || "",
      reliability: signal.reliability ? String(Math.round(Number(signal.reliability) * 100)) : "85",
      timeframe: signal.timeframe || "4H",
      status: (String(signal.status || "active").toLowerCase() as SignalStatus),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this signal? This action cannot be undone.")) return;

    setIsDeleting(id);
    try {
      await signalsApi.deleteSignal(id);
      showToast("Signal deleted successfully.");
      await fetchSignals();
      if (editingId === id) resetForm();
    } catch (error) {
      showToast("Failed to delete signal.", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        pair: formData.pair.toUpperCase(),
        direction: formData.type.toUpperCase(),
        type: formData.type.toUpperCase(),
        entryPrice: Number(formData.entryPrice),
        stopLoss: Number(formData.stopLoss),
        stoploss: Number(formData.stopLoss),
        takeProfit: formData.takeProfit1 ? Number(formData.takeProfit1) : undefined,
        takeProfit1: formData.takeProfit1 ? Number(formData.takeProfit1) : undefined,
        takeProfit2: formData.takeProfit2 ? Number(formData.takeProfit2) : undefined,
        takeProfit3: formData.takeProfit3 ? Number(formData.takeProfit3) : undefined,
        takeProfits: [formData.takeProfit1, formData.takeProfit2, formData.takeProfit3]
          .map((value) => (value ? Number(value) : null))
          .filter((value) => value !== null),
        reliability: Number(formData.reliability) / 100,
        timeframe: formData.timeframe,
        status: formData.status,
      };

      if (editingId) {
        await signalsApi.updateSignal(editingId, payload);
        showToast("Signal updated successfully.");
      } else {
        await signalsApi.createSignal(payload);
        showToast("Signal published successfully.");
      }

      resetForm();
      await fetchSignals();
    } catch (error) {
      showToast(editingId ? "Failed to update signal" : "Failed to publish signal", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-defined popular pairs for quick selection
  const popularPairs = ["EUR/USD","EUR/AUD","EUR/NZD","USD/CHF","GBP/CHF", "GBP/USD","GBP/CAD","AUD/USD","AUD/JPY","AUD/CAD","AUD/NZD","NZD/USD","CAD/JPY","USD/JPY","GBP/JPY", "XAU/USD", "BTC/USD", "ETH/USD"];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 pb-20 selection:bg-indigo-500/30 selection:text-indigo-100">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Welcome & Stats Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 text-white shadow-xl shadow-black/40">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
            <div className="w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Good morning, Trader.</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Manage your setups, broadcast signals to your community, and track your active performance from one unified dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-[140px]">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Active Setups</p>
                <p className="text-3xl font-bold text-white">{activeSignalsCount}</p>
              </div>
              <div className="bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-5 w-[140px]">
                <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">Total Signals</p>
                <p className="text-3xl font-bold text-white">{signals.length}</p>
              </div>
              <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-5 w-[140px]">
                <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">Avg Confidence</p>
                <p className="text-3xl font-bold text-emerald-400">{avgWinRate}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Panel (Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-slate-900 rounded-3xl border border-white/10 shadow-sm shadow-black/30 p-6 sm:p-8 lg:sticky lg:top-24">
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold mb-3">
                  {editingId ? <Edit2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {editingId ? "Edit Mode" : "New Setup"}
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {editingId ? "Update Signal" : "Publish Signal"}
                </h3>
                <p className="text-slate-400 text-sm mt-1">Configure your entry and exit targets.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section 1: Core Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Asset Pair</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.pair}
                        onChange={(e) => setFormData({ ...formData, pair: e.target.value.toUpperCase() })}
                        placeholder="e.g. EUR/USD"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white outline-none transition-all focus:border-indigo-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/20 uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-500"
                        required
                      />
                    </div>
                    {/* Quick Select Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {popularPairs.map(pair => (
                        <button
                          key={pair}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, pair }))}
                          className={cn(
                            "px-2 py-1 text-[10px] font-semibold rounded-md border transition-colors",
                            formData.pair === pair 
                              ? "bg-white text-slate-900 border-white" 
                              : "bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.06] hover:text-slate-200"
                          )}
                        >
                          {pair}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">Direction</label>
                      <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: "BUY" })}
                          className={cn(
                            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                            formData.type === "BUY" ? "bg-emerald-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                          )}
                        >
                          BUY
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: "SELL" })}
                          className={cn(
                            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                            formData.type === "SELL" ? "bg-rose-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                          )}
                        >
                          SELL
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">Timeframe</label>
                      <select
                        value={formData.timeframe}
                        onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-slate-200 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/20 [&>option]:bg-slate-900"
                      >
                        {["15M", "30M", "1H", "4H", "1D"].map(tf => <option key={tf} value={tf}>{tf}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="border-white/10" />

                {/* Section 2: Pricing */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1.5">Entry Price</label>
                      <input
                        type="number"
                        step="any"
                        value={formData.entryPrice}
                        onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                        placeholder="0.0000"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/20 placeholder:text-slate-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center justify-between text-sm font-semibold text-slate-300 mb-1.5">
                        <span>Stop Loss</span>
                        {rrRatio && (
                          <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">R:R 1:{rrRatio}</span>
                        )}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.stopLoss}
                        onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                        placeholder="0.0000"
                        className="w-full rounded-xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-sm font-medium text-rose-200 outline-none transition focus:border-rose-500/50 focus:bg-rose-500/[0.08] focus:ring-4 focus:ring-rose-500/20 placeholder:text-rose-500/40"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/10">
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 mb-3">
                      <Target className="w-4 h-4 text-indigo-400" />
                      Take Profit Targets
                    </label>
                    <div className="space-y-3">
                      {[
                        { id: 1, val: formData.takeProfit1, key: 'takeProfit1' },
                        { id: 2, val: formData.takeProfit2, key: 'takeProfit2' },
                        { id: 3, val: formData.takeProfit3, key: 'takeProfit3' },
                      ].map((tp) => (
                        <div key={tp.id} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500 w-6">TP{tp.id}</span>
                          <input
                            type="number"
                            step="any"
                            value={tp.val}
                            onChange={(e) => setFormData({ ...formData, [tp.key]: e.target.value })}
                            placeholder={tp.id === 1 ? "Required target" : "Optional target"}
                            required={tp.id === 1}
                            className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <hr className="border-white/10" />

                {/* Section 3: Meta */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-semibold text-slate-300">Confidence Level</label>
                      <span className="text-lg font-bold text-indigo-400">{formData.reliability}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={formData.reliability}
                      onChange={(e) => setFormData({ ...formData, reliability: e.target.value })}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] font-medium text-slate-500 mt-1 uppercase">
                      <span>Low</span>
                      <span>Moderate</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: "active", label: "Active", color: "bg-emerald-500" },
                        { val: "pending", label: "Pending", color: "bg-amber-500" },
                        { val: "closed", label: "Closed", color: "bg-slate-500" }
                      ].map((s) => (
                        <button
                          key={s.val}
                          type="button"
                          onClick={() => setFormData({ ...formData, status: s.val as SignalStatus })}
                          className={cn(
                            "flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border",
                            formData.status === s.val
                              ? "border-white bg-white text-slate-900 shadow-md"
                              : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                          )}
                        >
                          <span className={cn("w-2 h-2 rounded-full", s.color)}></span>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-900/40 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                    ) : editingId ? (
                      "Save Changes"
                    ) : (
                      "Publish Signal"
                    )}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/10 active:scale-[0.98]"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Signal Feed */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            
            {/* Feed Toolbar */}
            <div className="bg-slate-900 rounded-2xl border border-white/10 p-4 shadow-sm shadow-black/30 flex flex-col sm:flex-row gap-4 justify-between items-center z-10">
              
              <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-full sm:w-auto overflow-x-auto hide-scrollbar">
                {["ALL", "ACTIVE", "PENDING", "CLOSED"].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={cn(
                      "px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap",
                      statusFilter === filter 
                        ? "bg-white text-slate-900 shadow-sm" 
                        : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search pairs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-4 py-2 text-sm text-white outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.06] placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Signal List */}
            <div className="flex flex-col gap-4">
              {isLoading && signals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-900 rounded-3xl border border-dashed border-white/10">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mb-4" />
                  <p className="text-slate-400 font-medium">Loading your signals...</p>
                </div>
              ) : displayedSignals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-slate-900 rounded-3xl border border-dashed border-white/10 text-center px-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Activity className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">No signals found</h3>
                  <p className="text-slate-400 text-sm max-w-sm">
                    {searchQuery || statusFilter !== "ALL" 
                      ? "Try adjusting your filters or search terms." 
                      : "You haven't created any signals yet. Use the form on the left to publish your first setup."}
                  </p>
                  {(searchQuery || statusFilter !== "ALL") && (
                    <button 
                      onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }}
                      className="mt-4 text-indigo-400 text-sm font-semibold hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                displayedSignals.map((signal) => {
                  const isBuy = String(signal.type).toUpperCase() === "BUY";
                  const status = String(signal.status).toLowerCase();
                  const isEditing = editingId === signal.id;
                  
                  return (
                    <div 
                      key={signal.id} 
                      className={cn(
                        "group bg-slate-900 rounded-3xl border p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:shadow-black/30",
                        isEditing ? "border-indigo-500/50 ring-4 ring-indigo-500/10" : "border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                        
                        {/* Header & Core Info */}
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm border",
                            status === 'closed' ? "bg-white/5 border-white/10 text-slate-500" :
                            isBuy ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          )}>
                            {isBuy ? <ArrowUpRight className="h-6 w-6 stroke-[2.5]" /> : <ArrowDownLeft className="h-6 w-6 stroke-[2.5]" />}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="text-xl font-bold text-white tracking-tight">{signal.pair}</h4>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                status === 'closed' ? "bg-white/10 text-slate-400" :
                                isBuy ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                              )}>
                                {signal.type}
                              </span>
                              <span className={cn(
                                "flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                status === 'active' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" :
                                status === 'pending' ? "bg-amber-500/10 border-amber-500/20 text-amber-300" :
                                "bg-white/5 border-white/10 text-slate-400"
                              )}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", 
                                  status === 'active' ? "bg-emerald-400" : status === 'pending' ? "bg-amber-400" : "bg-slate-500"
                                )}></span>
                                {status}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                              <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> {signal.timeframe} TF</span>
                              <span className="flex items-center gap-1">
                                <BarChart3 className="w-3.5 h-3.5" /> 
                                {signal.reliability ? Math.round(Number(signal.reliability) * 100) : 85}% Conf.
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions (Desktop right-aligned, mobile bottom-aligned) */}
                        <div className="flex items-center gap-2 self-end sm:self-start sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(signal)}
                            className="p-2 rounded-xl text-slate-500 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                            title="Edit Setup"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(signal.id)}
                            disabled={isDeleting === signal.id}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-300 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                            title="Delete Setup"
                          >
                            {isDeleting === signal.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Pricing Grid */}
                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/10">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Entry</p>
                          <p className="font-semibold text-white">{signal.entryPrice || "—"}</p>
                        </div>
                        <div className="bg-rose-500/[0.06] rounded-xl p-3 border border-rose-500/15">
                          <p className="text-[10px] font-bold text-rose-400/80 uppercase tracking-wider mb-1">Stop Loss</p>
                          <p className="font-semibold text-rose-300">{signal.stopLoss || "—"}</p>
                        </div>
                        <div className="bg-emerald-500/[0.06] rounded-xl p-3 border border-emerald-500/15 md:col-span-2">
                          <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider mb-1 flex items-center justify-between">
                            Targets
                            {(signal.takeProfits?.length ?? 0) > 1 && <span className="bg-emerald-500/20 text-emerald-300 px-1.5 rounded-sm">{signal.takeProfits?.length ?? 0} Levels</span>}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {(signal.takeProfits?.length ?? 0) > 0 ? (
                              signal.takeProfits?.map((tp, idx) => (
                                <span key={idx} className="font-semibold text-emerald-300 text-sm bg-white/[0.04] border border-emerald-500/15 px-2 py-0.5 rounded">
                                  <span className="text-[10px] opacity-60 mr-1">T{idx+1}</span>{tp}
                                </span>
                              ))
                            ) : signal.takeProfit ? (
                              <span className="font-semibold text-emerald-300 text-sm bg-white/[0.04] border border-emerald-500/15 px-2 py-0.5 rounded">
                                {signal.takeProfit}
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-slate-500">—</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Global Toast Container */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}