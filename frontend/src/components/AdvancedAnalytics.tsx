import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Target, 
  ArrowUpRight, ArrowDownRight, Activity,
  Zap, AlertTriangle, CheckCircle2, Search
} from 'lucide-react';
import { api } from '../services/api';

export const AdvancedAnalytics: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [stats, setStats] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // В реальности: 
      // const [s, r] = await Promise.all([api.getProjectAnalytics(projectId), api.getDesignRecommendations(projectId)]);
      
      setTimeout(() => {
        setStats({
          visitors: 4520,
          conversions: 312,
          cr: 6.9,
          crTrend: +1.2,
          activeUsers: 8,
          engagement: 84
        });
        setRecommendations([
          { id: '1', title: 'Оптимизация Hero', message: 'Вариант B в A/B тесте показывает на 15% выше конверсию.', type: 'conversion', priority: 'high' },
          { id: '2', title: 'SEO Тексты', message: 'Блок "О нас" слишком длинный. AI может сократить его для лучшей читаемости.', type: 'seo', priority: 'medium' },
          { id: '3', title: 'Контрастность', message: 'Цвет текста в подвале имеет низкий контраст. Рекомендуем #333333.', type: 'design', priority: 'low' }
        ]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 animate-pulse space-y-8">
    <div className="h-32 bg-slate-50 rounded-[32px]" />
    <div className="grid grid-cols-2 gap-8"><div className="h-64 bg-slate-50 rounded-[32px]" /><div className="h-64 bg-slate-50 rounded-[32px]" /></div>
  </div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Метрики */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard label="Визиты" value={stats.visitors} trend={+5.4} icon={<Activity className="w-5 h-5 text-indigo-600" />} />
        <MetricCard label="Конверсии" value={stats.conversions} trend={+12.8} icon={<Target className="w-5 h-5 text-emerald-600" />} />
        <MetricCard label="CR %" value={`${stats.cr}%`} trend={stats.crTrend} icon={<TrendingUp className="w-5 h-5 text-amber-600" />} />
        <MetricCard label="Engagement" value={`${stats.engagement}%`} trend={-2.1} icon={<Zap className="w-5 h-5 text-violet-600" />} />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* График (заглушка) */}
        <div className="col-span-2 bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Динамика конверсии</h3>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2">
              <option>Последние 30 дней</option>
              <option>7 дней</option>
            </select>
          </div>
          <div className="h-64 flex items-end gap-2 px-4">
            {[40, 60, 45, 70, 85, 65, 90, 75, 95, 80, 100, 85].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="flex-1 bg-indigo-500/10 hover:bg-indigo-500 rounded-t-lg transition-colors cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* AI Рекомендации */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BarChart3 className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold">AI Советник</h3>
            </div>
            
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      rec.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {rec.title}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">{rec.message}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/50">
              Применить все правки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, trend, icon }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(trend)}%
      </div>
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black text-slate-900">{value}</div>
  </div>
);

