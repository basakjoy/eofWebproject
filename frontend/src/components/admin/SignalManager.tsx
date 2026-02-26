'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function SignalManager() {
  const [signals, setSignals] = useState([
    {
      id: 1,
      pair: 'EURUSD',
      type: 'BUY',
      entry: 1.085,
      target: 1.092,
      stopLoss: 1.080,
      status: 'active',
    },
    {
      id: 2,
      pair: 'GBPUSD',
      type: 'SELL',
      entry: 1.265,
      target: 1.250,
      stopLoss: 1.275,
      status: 'active',
    },
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Signal</h2>
          <Button size="sm">
            <Plus className="w-4 h-4" />
            New Signal
          </Button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Currency Pair"
              options={[
                { value: 'EURUSD', label: 'EUR/USD' },
                { value: 'GBPUSD', label: 'GBP/USD' },
                { value: 'USDJPY', label: 'USD/JPY' },
                { value: 'AUDUSD', label: 'AUD/USD' },
              ]}
            />
            <Select
              label="Signal Type"
              options={[
                { value: 'BUY', label: 'BUY' },
                { value: 'SELL', label: 'SELL' },
                { value: 'TP', label: 'Take Profit' },
                { value: 'SL', label: 'Stop Loss' },
              ]}
            />
            <Input label="Entry Price" type="number" step="0.0001" placeholder="1.0850" />
            <Input label="Target Price" type="number" step="0.0001" placeholder="1.0920" />
            <Input label="Stop Loss" type="number" step="0.0001" placeholder="1.0800" />
            <Select
              label="Timeframe"
              options={[
                { value: '15m', label: '15 Minutes' },
                { value: '1h', label: '1 Hour' },
                { value: '4h', label: '4 Hours' },
                { value: '1d', label: '1 Day' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={4}
              placeholder="Technical analysis and reasons for this signal..."
            ></textarea>
          </div>
          <Button variant="primary">Publish Signal</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-6">Active Signals</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Pair</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Entry</th>
                <th className="px-4 py-3 text-left font-semibold">Target</th>
                <th className="px-4 py-3 text-left font-semibold">SL</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal) => (
                <tr key={signal.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{signal.pair}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        signal.type === 'BUY'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {signal.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">{signal.entry}</td>
                  <td className="px-4 py-3">{signal.target}</td>
                  <td className="px-4 py-3">{signal.stopLoss}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                      {signal.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="p-1 hover:bg-blue-100 rounded">
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-1 hover:bg-red-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
