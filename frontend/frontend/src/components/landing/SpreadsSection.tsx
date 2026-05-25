'use client';

import { motion } from 'framer-motion';
import { MousePointerClick, Zap } from 'lucide-react';

export default function SpreadsSection() {
  const spreads = [
    { pair: 'EUR/USD', spread: '0.3', commission: '0.00', leverage: '1:500', trend: 'down' },
    { pair: 'GBP/USD', spread: '0.5', commission: '0.00', leverage: '1:500', trend: 'up' },
    { pair: 'USD/JPY', spread: '0.8', commission: '0.00', leverage: '1:500', trend: 'up' },
    { pair: 'XAU/USD', spread: '12.0', commission: '0.00', leverage: '1:200', trend: 'down' },
    { pair: 'BTC/USD', spread: '2.5', commission: '0.00', leverage: '1:100', trend: 'up' },
  ];

  return (
    <section className="py-24 bg-[#020817] relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] block mb-4">Competitive Edge</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4 uppercase tracking-tighter">Low Spreads. <span className="text-gray-500">Zero Commission.</span></h2>
          <p className="text-gray-500 mt-6 max-w-xl mx-auto text-sm">Experience the industry's most competitive trading conditions with institutional-grade hardware and liquidity providers.</p>
        </div>

        <div className="relative group bg-white/5 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="py-8 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Instrument</th>
                  <th className="py-8 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Typical Spread</th>
                  <th className="py-8 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Commission</th>
                  <th className="py-8 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Leverage</th>
                  <th className="py-8 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {spreads.map((item, index) => (
                  <motion.tr 
                    key={index}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className="transition-colors group/row"
                  >
                    <td className="py-6 px-8">
                       <div className="flex items-center gap-3">
                         <div className={`w-1.5 h-6 rounded-full ${index % 2 === 0 ? 'bg-blue-600' : 'bg-indigo-600'}`} />
                         <span className="text-lg font-black text-white tracking-tight">{item.pair}</span>
                       </div>
                    </td>
                    <td className="py-6 px-8">
                       <div className="flex items-center gap-2">
                         <span className="text-base font-bold text-green-400">{item.spread}</span>
                         <span className="text-[10px] font-black text-gray-500 uppercase">Pips</span>
                       </div>
                    </td>
                    <td className="py-6 px-8 text-sm font-bold text-gray-400">${item.commission}</td>
                    <td className="py-6 px-8 text-sm font-bold text-white">{item.leverage}</td>
                    <td className="py-6 px-8">
                       <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 group-hover/row:bg-blue-600 group-hover/row:text-white transition-all text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Trade
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer of card */}
          <div className="p-8 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-4">
                <Zap size={20} className="text-yellow-500" />
                <p className="text-xs font-bold text-gray-400">Execution time: <span className="text-white">&lt; 14ms</span></p>
             </div>
             <button className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">
                View All 150+ Instruments <MousePointerClick size={14} />
             </button>
          </div>
        </div>

      </div>
    </section>
  );
}
