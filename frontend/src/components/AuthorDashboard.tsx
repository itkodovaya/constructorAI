import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Package, DollarSign, Eye, 
  CheckCircle2, Clock, AlertCircle, Plus,
  BarChart3, Users, ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';

export const AuthorDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // api.getAuthorStats()
      setTimeout(() => {
        setStats({
          itemsCount: 12,
          salesCount: 148,
          totalRevenue: 2450.50,
          recentSales: [
            { id: '1', item: 'Modern SaaS Template', amount: 49.00, date: '2024-01-28', customer: 'john@example.com' },
            { id: '2', item: 'AI Chat Widget Plugin', amount: 25.00, date: '2024-01-27', customer: 'tech@startup.io' }
          ],
          items: [
            { id: '1', name: 'Modern SaaS Template', status: 'active', sales: 85, revenue: 1250 },
            { id: '2', name: 'AI Chat Widget', status: 'active', sales: 63, revenue: 1200 },
            { id: '3', name: 'Dark Dashboard', status: 'pending', sales: 0, revenue: 0 }
          ]
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch author stats:', error);
    }
  };

  if (loading || !stats) return <div className="animate-pulse h-96 bg-slate-50 rounded-[40px]" />;

  return (
    <div className="space-y-8 p-2">
      {/* Главные метрики */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard 
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
          label="Общий доход"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          trend="+12.5% за месяц"
          color="emerald"
        />
        <StatCard 
          icon={<Package className="w-6 h-6 text-indigo-600" />}
          label="Продано товаров"
          value={stats.salesCount}
          trend="+24 новых"
          color="indigo"
        />
        <StatCard 
          icon={<Users className="w-6 h-6 text-amber-600" />}
          label="Ваши ассеты"
          value={stats.itemsCount}
          trend="1 на модерации"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Список товаров */}
        <div className="col-span-2 bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Ваш контент</h3>
            <button className="text-indigo-600 font-bold text-sm flex items-center gap-2">
              Смотреть все <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {stats.items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{item.sales} продаж</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">${item.revenue}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Выручка</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Последние продажи */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white">
          <h3 className="text-xl font-bold mb-8">Последние продажи</h3>
          <div className="space-y-6">
            {stats.recentSales.map((sale: any) => (
              <div key={sale.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white truncate max-w-[140px]">{sale.item}</span>
                  <span className="text-emerald-400 font-black">+${sale.amount}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 font-medium">
                  <Clock className="w-3 h-3" /> {sale.date}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 bg-white/10 hover:bg-white/20 text-white py-4 rounded-3xl font-bold transition-all border border-white/10">
            Детальный отчет
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
    <div className={`w-14 h-14 bg-${color}-50 rounded-2xl flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</div>
    <div className="text-3xl font-black text-slate-900 mb-2">{value}</div>
    <div className={`text-xs font-bold text-${color}-600`}>{trend}</div>
  </div>
);

