import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, BarChart3, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const GrowthSimulator: React.FC = () => {
  const [currentLeads, setCurrentLeads] = useState(100);
  const [conversionRate, setConversionRate] = useState(0.05);
  const [marketingSpend, setMarketingSpend] = useState(1000);
  const [increase, setIncrease] = useState(1.2);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runSim = async () => {
    setLoading(true);
    try {
      const data = await api.runGrowthSimulation({ currentLeads, conversionRate, marketingSpend, increase });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Growth Simulator</h2>
            <p className="text-xs text-slate-400 font-medium">Digital Twin: Predict ROI & Business Growth</p>
          </div>
        </div>
        <button 
          onClick={runSim}
          disabled={loading}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
          Run Simulation
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Controls */}
        <aside className="w-80 border-r border-slate-50 flex flex-col bg-slate-50/30 p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Users className="w-3 h-3" /> Monthly Leads</label>
            <input type="number" value={currentLeads} onChange={e => setCurrentLeads(Number(e.target.value))} className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold" />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BarChart3 className="w-3 h-3" /> Conversion Rate (%)</label>
            <input type="number" value={(conversionRate * 100).toFixed(1)} onChange={e => setConversionRate(Number(e.target.value) / 100)} className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold" />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><DollarSign className="w-3 h-3" /> Marketing Spend ($)</label>
            <input type="number" value={marketingSpend} onChange={e => setMarketingSpend(Number(e.target.value))} className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold" />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-3 h-3" /> Spend Increase (x)</label>
            <div className="flex items-center gap-4">
              <input type="range" min="1" max="5" step="0.1" value={increase} onChange={e => setIncrease(Number(e.target.value))} className="flex-1 accent-emerald-600" />
              <span className="text-sm font-black text-emerald-600">{increase}x</span>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 p-10 bg-white overflow-y-auto custom-scrollbar">
          {result ? (
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 space-y-2">
                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Projected Revenue</div>
                  <div className="text-3xl font-black text-slate-900">${result.projectedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="p-8 bg-blue-50 rounded-[32px] border border-blue-100 space-y-2">
                  <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Projected ROI</div>
                  <div className="text-3xl font-black text-slate-900">{(result.roi * 100).toFixed(0)}%</div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Confidence Interval (80%)</h3>
                <div className="relative h-12 w-full bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-y-0 bg-emerald-200/50" style={{ left: '20%', right: '20%' }} />
                  <div className="relative z-10 text-[10px] font-black text-slate-600 uppercase">
                    ${result.confidenceInterval[0].toLocaleString(undefined, { maximumFractionDigits: 0 })} — ${result.confidenceInterval[1].toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-900 rounded-[32px] text-white space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white"><TrendingUp className="w-4 h-4" /></div>
                  <h4 className="font-black text-sm uppercase tracking-widest">AI Strategy Recommendation</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Based on 1,000 Monte Carlo iterations, increasing your spend by <span className="text-emerald-400">{increase}x</span> is <span className="text-emerald-400">highly likely</span> to yield a positive ROI. We recommend focusing on conversion rate optimization (CRO) to further amplify these results.
                </p>
                <button className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:gap-3 transition-all">
                  Apply AI Optimization Plan <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <BarChart3 className="w-20 h-20 text-slate-200" />
              <div>
                <h3 className="text-xl font-black text-slate-900">Simulator Idle</h3>
                <p className="text-sm font-medium text-slate-400">Adjust parameters and run the simulation to see your business future.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};





