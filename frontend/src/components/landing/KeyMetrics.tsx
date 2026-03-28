'use client';

import Card from '@/components/common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartHeight = isMobile ? 250 : isTablet ? 280 : 300;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 sm:mb-4">Platform Performance</h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 px-2">Real-time metrics showing our platform's incredible growth</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <Card hover>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">Total Assets Under Management</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">$250M+</p>
              <p className="text-green-400 text-xs sm:text-sm mt-1">↑ 25% this month</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">Active Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">12,450+</p>
              <p className="text-green-400 text-xs sm:text-sm mt-1">↑ 15% growth</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">Average Monthly ROI</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">12.5%</p>
              <p className="text-green-400 text-xs sm:text-sm mt-1">Consistent growth</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">Win Rate</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">87%</p>
              <p className="text-green-400 text-xs sm:text-sm mt-1">Industry leading</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Card>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Portfolio Growth</h3>
          <div className="w-full h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                <XAxis stroke="#999" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis stroke="#999" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4f46e5', borderRadius: '8px' }}
                  labelStyle={{ color: '#e0e7ff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#818cf8" 
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{ fill: '#6366f1', r: isMobile ? 3 : 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Weekly Performance</h3>
          <div className="w-full h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                <XAxis stroke="#999" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis stroke="#999" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4f46e5', borderRadius: '8px' }}
                  labelStyle={{ color: '#e0e7ff' }}
                />
                <Bar dataKey="profit" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
}
