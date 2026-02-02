import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Users, Gift, CreditCard, Share2, Copy, Check,
  Trophy, TrendingUp, DollarSign, ExternalLink,
  Wallet, PieChart, ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';

export const ReferralDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [refLink, setRefLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // api.getReferralStats()
      // api.getReferralLink()
      setTimeout(() => {
        setStats({
          totalReferrals: 12,
          activeReferrals: 5,
          totalEarnings: 24500,
          pendingEarnings: 3200,
          paidEarnings: 18000
        });
        setRefLink('https://constructor.ai/ref/alex_777');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-indigo-100">
          <Gift className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Партнерская программа</h1>
          <p className="text-slate-500 font-medium">Приглашайте друзей и зарабатывайте вместе</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 rounded-[48px] text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Share2 className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl font-black mb-6 leading-tight">Получайте 10% с каждой покупки реферала</h2>
          <p className="text-indigo-100 text-lg mb-8 font-medium">Поделитесь своей ссылкой с коллегами и друзьями. Они получат скидку 15% на первую покупку, а вы — вознаграждение.</p>
          
          <div className="flex gap-3 bg-white/10 backdrop-blur-md p-2 rounded-3xl border border-white/20">
            <div className="flex-1 px-4 py-3 font-bold text-white truncate opacity-80">{refLink}</div>
            <button 
              onClick={handleCopy}
              className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-xl"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Приглашено" value={stats.totalReferrals} subLabel="Пользователей" icon={<Users className="text-blue-500" />} />
        <StatCard label="Активно" value={stats.activeReferrals} subLabel="Покупок" icon={<TrendingUp className="text-emerald-500" />} />
        <StatCard label="Заработано" value={`${stats.totalEarnings.toLocaleString()} ₽`} subLabel="Всего" icon={<DollarSign className="text-amber-500" />} />
        <StatCard label="К выплате" value={`${stats.pendingEarnings.toLocaleString()} ₽`} subLabel="В ожидании" icon={<Wallet className="text-indigo-500" />} />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <History className="w-6 h-6 text-slate-400" /> Недавние рефералы
            </h3>
            <div className="space-y-4">
              <ReferralRow name="Иван М." date="24 Окт 2023" status="active" earning="+1,200 ₽" />
              <ReferralRow name="Digital Agency XYZ" date="18 Окт 2023" status="completed" earning="+5,400 ₽" />
              <ReferralRow name="Анна С." date="12 Окт 2023" status="active" earning="+450 ₽" />
              <ReferralRow name="Михаил К." date="05 Окт 2023" status="pending" earning="0 ₽" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[40px]">
            <h3 className="text-lg font-bold mb-4">Вывод средств</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium">Минимальная сумма вывода составляет 1,000 ₽. Выплаты производятся каждое воскресенье.</p>
            <div className="p-5 bg-white/5 rounded-3xl border border-white/10 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Доступно</span>
                <span className="text-xs font-bold text-indigo-400">84%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-indigo-500 w-[84%]" />
              </div>
              <p className="text-xl font-black">18,400 ₽</p>
            </div>
            <button className="w-full bg-indigo-600 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/50">
              Вывести на карту
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subLabel, icon }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
    <div className="flex items-center justify-between mb-6">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-all">{icon}</div>
      <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-300 transition-all" />
    </div>
    <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    <p className="text-xs text-slate-400 mt-1">{subLabel}</p>
  </div>
);

const ReferralRow = ({ name, date, status, earning }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400">{name[0]}</div>
      <div>
        <h4 className="font-bold text-slate-900">{name}</h4>
        <p className="text-xs text-slate-400 font-medium">{date}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-black text-indigo-600 mb-1">{earning}</div>
      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
        status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
        status === 'completed' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

