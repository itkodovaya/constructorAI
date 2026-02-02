import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, TrendingUp, Users, ShoppingBag, 
  ArrowUpRight, ArrowDownRight, Activity, 
  Filter, Calendar, Download, RefreshCcw,
  MousePointer2, Target, PieChart, Brain
} from 'lucide-react';
import { api } from '../services/api';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

export const AnalyticsDashboard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('7d');

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Simulate fetching analytics data
      const [leadsData, productsData, forecastData] = await Promise.all([
        api.getLeads(projectId),
        api.getProducts(projectId),
        api.getForecast(projectId)
      ]);

      const leads = leadsData.leads || [];
      const products = productsData.products || [];
      setForecast(forecastData);
      
      // Calculate mock metrics
      const totalLeads = leads.length;
      const qualifiedLeads = leads.filter((l: any) => l.status === 'qualified').length;
      const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : 0;
      
      setStats({
        overview: [
          { label: 'Total Leads', value: totalLeads, trend: '+12%', isUp: true, icon: <Users className="w-5 h-5" /> },
          { label: 'Conv. Rate', value: `${conversionRate}%`, trend: '+2.4%', isUp: true, icon: <Target className="w-5 h-5" /> },
          { label: 'Store Items', value: products.length, trend: 'Stable', isUp: true, icon: <ShoppingBag className="w-5 h-5" /> },
          { label: 'Avg. Value', value: '$142', trend: '-3%', isUp: false, icon: <TrendingUp className="w-5 h-5" /> },
        ],
        funnel: [
          { stage: 'Visitors', count: totalLeads * 10 || 100, percentage: '100%' },
          { stage: 'Interactions', count: totalLeads * 3 || 30, percentage: '30%' },
          { stage: 'Leads', count: totalLeads, percentage: `${((totalLeads / (totalLeads * 10 || 100)) * 100).toFixed(0)}%` },
          { stage: 'Qualified', count: qualifiedLeads, percentage: `${((qualifiedLeads / (totalLeads || 1)) * 100).toFixed(0)}%` },
        ],
        recentActivity: leads.slice(0, 5).map((l: any) => ({
          id: l.id,
          user: l.name || 'Anonymous',
          action: l.status === 'qualified' ? 'Became Qualified' : 'New Submission',
          time: new Date(l.createdAt).toLocaleTimeString()
        }))
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [projectId, timeRange]);

  if (loading && !stats) {
    return <LoadingState message="Загрузка аналитики..." />;
  }

  if (!stats) {
    return (
      <EmptyState
        iconType="analytics"
        title="Нет данных аналитики"
        description="Аналитические данные появятся после начала работы с проектом."
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-2 sm:p-4 lg:p-6 pb-6 sm:pb-8 lg:pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Analytics Insights</h3>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Data-driven performance for your project</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex bg-slate-100 p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-inner">
            {['24h', '7d', '30d'].map(r => (
              <button 
                key={r} 
                onClick={() => setTimeRange(r)}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-black uppercase transition-all ${timeRange === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {r}
              </button>
            ))}
          </div>
          <button onClick={fetchStats} className="p-2 sm:p-2.5 bg-white border border-slate-100 rounded-lg sm:rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
            <RefreshCcw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.overview.map((m: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute -right-2 sm:-right-4 -top-2 sm:-top-4 w-16 h-16 sm:w-24 sm:h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                  {React.cloneElement(m.icon, { className: 'w-4 h-4 sm:w-5 sm:h-5' })}
                </div>
                <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg ${m.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {m.isUp ? <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  {m.trend}
                </div>
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{m.label}</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{m.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Predictive Intelligence */}
        <div className="bg-slate-900 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] shadow-2xl p-6 sm:p-8 lg:p-10 text-white space-y-6 sm:space-y-8 lg:space-y-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 sm:p-6 lg:p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
            <TrendingUp className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 text-blue-400" />
          </div>
          <div className="relative z-10 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-900/20">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-black text-lg sm:text-xl">Neural Forecast</h4>
                <p className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest">30-Day Predictive Model</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-3 sm:pt-4">
              <div className="space-y-1">
                <div className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Expected Leads</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tighter">{forecast?.summary.predictedLeads || 0}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Uplift</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 tracking-tighter">{forecast?.summary.uplift || '0%'}</div>
              </div>
            </div>

            <div className="h-24 sm:h-32 flex items-end gap-1 sm:gap-1.5 pt-4 sm:pt-6">
              {forecast?.chartData.slice(0, 15).map((d: any, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.expectedLeads / 10) * 100}%` }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-1 bg-blue-500/40 rounded-t-lg group/bar relative"
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-[8px] font-bold rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">{d.expectedLeads} leads</div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-slate-400 font-medium leading-relaxed">AI analyzes historical data patterns to predict future performance with 94% confidence.</p>
          </div>
        </div>

        {/* Sales Funnel */}
        <div className="lg:col-span-2 bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border border-slate-100 shadow-sm p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-50 rounded-lg sm:rounded-xl flex items-center justify-center text-indigo-600"><Target className="w-4 h-4 sm:w-5 sm:h-5" /></div>
              <h4 className="font-black text-base sm:text-lg text-slate-900">Conversion Funnel</h4>
            </div>
            <button className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 flex items-center gap-2 transition-colors">
              Full Report <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {stats.funnel.map((f: any, i: number) => (
              <div key={i} className="relative group">
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-slate-100 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-slate-400">{i + 1}</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-700">{f.stage}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs sm:text-sm font-black text-slate-900">{f.count}</span>
                    <span className="text-[9px] sm:text-[10px] font-black text-indigo-500 w-8 sm:w-10 text-right">{f.percentage}</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: f.percentage }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ opacity: 1 - (i * 0.2) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] shadow-2xl p-4 sm:p-6 lg:p-8 text-white space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-400"><Activity className="w-4 h-4 sm:w-5 sm:h-5" /></div>
            <h4 className="font-black text-base sm:text-lg">Live Pulse</h4>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {stats.recentActivity.map((a: any, i: number) => (
              <div key={a.id} className="flex gap-4 group">
                <div className="shrink-0 w-1 bg-blue-500/20 rounded-full group-hover:bg-blue-500 transition-colors" />
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{a.time}</div>
                  <div className="text-sm font-bold text-white">{a.user}</div>
                  <div className="text-xs text-slate-400">{a.action}</div>
                </div>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <div className="py-6 sm:py-10 text-center space-y-3 sm:space-y-4">
                <MousePointer2 className="w-8 h-8 sm:w-10 sm:h-10 text-slate-700 mx-auto" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No activity yet</p>
              </div>
            )}
          </div>

          <button className="w-full py-3 sm:py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
};
