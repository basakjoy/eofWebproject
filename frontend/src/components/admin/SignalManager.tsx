"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Zap, ArrowUpRight, ArrowDownLeft, Loader2, X, Info } from "lucide-react"; 
import { signalService } from "@/services/signalService";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

export default function SignalManager() {          
  const [signals, setSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state
  const [formData, setFormData] = useState({
    pair: "EUR/USD",
    type: "Buy",
    entryPrice: "",
    takeProfit1: "",
    takeProfit2: "",
    takeProfit3: "",
    stopLoss: "",
    reliability: "85",
    timeframe: "1h",
    analysis: ""
  });

  const fetchSignals = async () => {
    setIsLoading(true);

    try {
      const response = await signalService.getSignals();
      // Ensure we always have an array, even if the API returns something else
      const signalsData = Array.isArray(response.data) ? response.data : 
                          (response.data && Array.isArray(response.data.signals) ? response.data.signals : []);
      setSignals(signalsData);
    } catch (error) {
      toast.error("Failed to fetch signals. Please try again.");
      setSignals([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const resetForm = () => {
    setFormData({
      pair: "EUR/USD",
      type: "Buy",
      entryPrice: "",
      takeProfit1: "",
      takeProfit2: "",
      takeProfit3: "",
      stopLoss: "",
      reliability: "85",
      timeframe: "1h",
      analysis: ""
    });

    setEditingId(null);
  };

  const handleEdit = (signal: any) => {
    setEditingId(signal.id);
    setFormData({
      pair: signal.pair,
      type: signal.type,
      entryPrice: signal.entry_price ? signal.entry_price.toString() : signal.entryPrice?.toString() || "",
      takeProfit1: signal.take_profit_1 ? signal.take_profit_1.toString() : signal.takeProfit1?.toString() || "",
      takeProfit2: signal.take_profit_2 ? signal.take_profit_2.toString() : signal.takeProfit2?.toString() || "",
      takeProfit3: signal.take_profit_3 ? signal.take_profit_3.toString() : signal.takeProfit3?.toString() || "",
      stopLoss: signal.stop_loss ? signal.stop_loss.toString() : signal.stopLoss?.toString() || "",
      reliability: signal.reliability ? (signal.reliability * 100).toString() : "85",
      timeframe: signal.timeframe || "1h",
      analysis: signal.analysis || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this signal?"))
      return;

    setIsDeleting(id);

    try {
      await signalService.deleteSignal(id);
      toast.success("Signal deleted successfully.");
      fetchSignals();
    } catch (error) {
      toast.error("Failed to delete signal. Please try again");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const signalData = {
        pair: formData.pair,
        type: formData.type,
        entryPrice: parseFloat(formData.entryPrice),
        takeProfit1: parseFloat(formData.takeProfit1),
        takeProfit2: parseFloat(formData.takeProfit2),
        takeProfit3: parseFloat(formData.takeProfit3),
        stopLoss: parseFloat(formData.stopLoss),
        reliability: parseFloat(formData.reliability) / 100,
        timeframe: formData.timeframe,
        analysis: formData.analysis
      };

      if (editingId) {
        await signalService.updateSignal(editingId, signalData);
        toast.success("Signal updated successfully!");
      } else {
        await signalService.createSignal(signalData);
        toast.success("Trading signal published successfully!");
      }

      resetForm();
      fetchSignals();
    } catch (error) {
      toast.error(editingId ? "Failed to update signal" : "Failed to publish signal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-display">
            Signal Center
          </h2>
          <p className="text-gray-500 font-medium">Broadcast and manage premium trading signals</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" onClick={resetForm} className="hidden lg:flex">
             Clear Form
           </Button>
        </div>
      </div>

      {/* Admin Quick Guide */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Welcome, Signal Admin!</h3>
            <p className="text-sm text-gray-500">Please use the tools below to provide accurate and timely trading information.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Management</h4>
            <ul className="text-xs space-y-1.5 text-gray-600">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"/> <strong>View All:</strong> Active, pending, and closed signals.</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"/> <strong>Edit:</strong> Update parameters (TP, SL, status).</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"/> <strong>Delete:</strong> Remove signals (use with caution).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Signal Creation</h4>
            <ul className="text-xs space-y-1.5 text-gray-600">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-400 rounded-full"/> <strong>Pairs:</strong> e.g., EUR/USD, GBP/JPY, GOLD.</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-400 rounded-full"/> <strong>Type:</strong> BUY / SELL with Entry & SL.</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-400 rounded-full"/> <strong>TP1-TP3:</strong> Target profit levels (TP2/3 optional).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Signal Status</h4>
            <div className="flex flex-wrap gap-1.5">
               <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded">Pending</span>
               <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Active</span>
               <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Profit</span>
               <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Loss</span>
               <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Cancelled</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Running Trades</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Monitor the progress of active signals in the list below. 
              You can quickly update their status or close them out as needed.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Publish Signal Form */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Update Signal" : "Publish New Signal"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Pair</label>
                  <select 
                    value={formData.pair}
                    onChange={(e) => setFormData({...formData, pair: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option>EUR/USD</option>
                    <option>GBP/USD</option>
                    <option>USD/JPY</option>
                    <option>GOLD</option>
                    <option>BTC/USD</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option>Buy</option>
                    <option>Sell</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Entry Price</label>
                <input 
                  type="text"
                  placeholder="1.0850"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">TP 1</label>
                  <input 
                    type="text"
                    placeholder="1.0900"
                    value={formData.takeProfit1}
                    onChange={(e) => setFormData({...formData, takeProfit1: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">TP 2</label>
                  <input 
                    type="text"
                    value={formData.takeProfit2}
                    onChange={(e) => setFormData({...formData, takeProfit2: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">TP 3</label>
                  <input 
                    type="text"
                    value={formData.takeProfit3}
                    onChange={(e) => setFormData({...formData, takeProfit3: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Stop Loss</label>
                  <input 
                    type="text"
                    placeholder="1.0800"
                    value={formData.stopLoss}
                    onChange={(e) => setFormData({...formData, stopLoss: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Reliability %</label>
                  <input 
                    type="number"
                    value={formData.reliability}
                    onChange={(e) => setFormData({...formData, reliability: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Analysis (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Technical reasoning..."
                  value={formData.analysis}
                  onChange={(e) => setFormData({...formData, analysis: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  editingId ? "Update Signal" : "Publish Signal"
                )}
              </Button>
              {editingId && (
                <Button variant="outline" className="w-full" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </form>
          </div>
        </div>

        {/* Signals List */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                Recent Broadcasts
                <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full">
                  {signals.length}
                </span>
              </h3>
              <div className="flex gap-2">
                 <button onClick={fetchSignals} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                   <Zap className="w-4 h-4 text-blue-600" />
                 </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {isLoading && signals.length === 0 ? (
                <div className="p-20 text-center">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
                  <p className="text-gray-500 font-medium">Fetching signals...</p>
                </div>
              ) : !Array.isArray(signals) || signals.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No signals published yet.</p>
                </div>
              ) : (
                Array.isArray(signals) && signals.map((signal) => (
                  <div key={signal.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors group">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                          signal.type?.toLowerCase() === 'buy' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        )}>
                          {signal.type?.toLowerCase() === 'buy' ? <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" /> : <ArrowDownLeft className="w-5 h-5 sm:w-6 sm:h-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900 text-base sm:text-lg">{signal.pair}</span>
                            <span className={cn(
                              "text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 rounded-md",
                              signal.type?.toLowerCase() === 'buy' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                            )}>
                              {signal.type}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">• {new Date(signal.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Entry</p>
                              <p className="text-sm font-bold text-gray-900">{signal.entryPrice || signal.entry_price}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Stop Loss</p>
                              <p className="text-sm font-bold text-red-600">{signal.stopLoss || signal.stop_loss}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Targets</p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">TP1: {signal.takeProfit1 || signal.take_profit_1}</span>
                                {signal.takeProfit2 && <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded hidden lg:inline-block">TP2: {signal.takeProfit2}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <button 
                          onClick={() => handleEdit(signal)}
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(signal.id)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          disabled={isDeleting === signal.id}
                        >
                          {isDeleting === signal.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
