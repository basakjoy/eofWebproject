'use client';

import { useState } from "react";
import { Wallet, ArrowRight, DollarSign, TrendingUp, Info } from "lucide-react";
import { Input } from "@/components/dashboard/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/ui/select";
import { toast } from "sonner";

export default function InvestmentForm() {
  const [amount, setAmount] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  const durationMap: Record<string, number> = {
    "3m": 3,
    "6m": 6,
    "12m": 12,
  };

  const calculateReturns = () => {
    if (!amount || !duration || !durationMap[duration]) return "0.00";

    const invest = parseFloat(amount);
    const months = durationMap[duration];

    // Estimated trading profit ~6% monthly
    const estimatedTradingProfit = invest * 0.06 * months;

    // Client gets 50% of trading profit
    const clientProfit = estimatedTradingProfit * 0.5;

    const totalReturns = invest + clientProfit;

    return totalReturns.toFixed(2);
  };

  const handleInvest = () => {
    if (!amount || !duration) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Investment request submitted successfully!");
    setAmount("");
    setDuration("");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <Wallet className="w-5 h-5" style={{ color: "#0D73ED" }} />
        </div>
        <div>
          <h3 className="font-display font-semibold" style={{ color: "#1e293b" }}>
            Quick Investment
          </h3>
          <p className="text-sm" style={{ color: "#64748b" }}>
            50% Profit Sharing Model
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Amount */}
        <div>
          <label className="text-sm mb-2 block" style={{ color: "#64748b" }}>
            Investment Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748b" }} />
            <Input
              type="number"
              min="100"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10"
              style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="text-sm mb-2 block" style={{ color: "#64748b" }}>
            Investment Duration
          </label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger style={{ borderColor: "#e2e8f0" }}>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months – 50% Profit Sharing</SelectItem>
              <SelectItem value="6m">6 Months – 50% Profit Sharing</SelectItem>
              <SelectItem value="12m">12 Months – 50% Profit Sharing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ROI Display */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: "rgba(13, 115, 237, 0.1)", border: "1px solid rgba(13, 115, 237, 0.2)" }}>
          <div className="flex items-center gap-2 mb-2" style={{ color: "#0D73ED" }}>
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              Estimated Total Returns
            </span>
          </div>

          <p className="text-2xl font-display font-bold" style={{ color: "#1e293b" }}>
            ${calculateReturns()}
          </p>

          <div className="flex items-start gap-2 text-xs mt-2" style={{ color: "#64748b" }}>
            <Info className="w-4 h-4 mt-[1px]" />
            <p>
              Based only on 50% profit sharing from trading.
              Actual returns depend on market performance.
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleInvest}
          className="w-full text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: "#0D73ED" }}
        >
          Invest Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
