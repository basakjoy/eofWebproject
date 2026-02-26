'use client';

import Card from '@/components/common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const portfolioData = [
  { month: 'Jan', value: 40000 },
  { month: 'Feb', value: 45000 },
  { month: 'Mar', value: 52000 },
  { month: 'Apr', value: 48000 },
  { month: 'May', value: 61000 },
  { month: 'Jun', value: 75000 },
];

const performanceData = [
  { name: 'Week 1', profit: 2400 },
  { name: 'Week 2', profit: 2210 },
  { name: 'Week 3', profit: 2290 },
  { name: 'Week 4', profit: 2000 },
  { name: 'Week 5', profit: 2181 },
];

export default function KeyMetrics() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold gradient-text mb-4">Platform Performance</h2>
        <p className="text-xl text-gray-400">Real-time metrics showing our platform's incredible growth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card hover>
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Assets Under Management</p>
              <p className="text-3xl font-bold text-white mt-2">$250M+</p>
              <p className="text-green-400 text-sm mt-1">↑ 25% this month</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-white mt-2">12,450+</p>
              <p className="text-green-400 text-sm mt-1">↑ 15% growth</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Average Monthly ROI</p>
              <p className="text-3xl font-bold text-white mt-2">12.5%</p>
              <p className="text-green-400 text-sm mt-1">Consistent growth</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Win Rate</p>
              <p className="text-3xl font-bold text-white mt-2">87%</p>
              <p className="text-green-400 text-sm mt-1">Industry leading</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-2xl font-bold text-white mb-6">Portfolio Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
              <XAxis stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4f46e5' }}
                labelStyle={{ color: '#e0e7ff' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#818cf8" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-2xl font-bold text-white mb-6">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
              <XAxis stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4f46e5' }}
                labelStyle={{ color: '#e0e7ff' }}
              />
              <Bar dataKey="profit" fill="#ec4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </section>
  );
}
