import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BarChart2, CheckCircle2, AlertCircle, TrendingUp, 
  Users, MousePointer2, Target, ArrowRight, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';

interface ABTestResult {
  id: string;
  name: string;
  goalType: string;
  variants: {
    name: string;
    visitors: number;
    conversions: number;
    conversionRate: number;
    isWinner?: boolean;
  }[];
  confidence: number;
  recommendation: string;
}

export const ABTestResults: React.FC<{ testId: string }> = ({ testId }) => {
  const { t } = useTranslation();
  const [results, setResults] = useState<ABTestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [testId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      // В реальности: await api.getABTestResults(testId)
      setTimeout(() => {
        const mockResults: ABTestResult = {
          id: testId,
          name: 'Заголовок Hero-секции',
          goalType: 'click',
          variants: [
            { name: 'Вариант A (Базовый)', visitors: 1240, conversions: 85, conversionRate: 6.85 },
            { name: 'Вариант B (AI-Генерация)', visitors: 1180, conversions: 112, conversionRate: 9.49, isWinner: true }
          ],
          confidence: 98.4,
          recommendation: 'Вариант B показывает значительно лучшую конверсию. Рекомендуем применить его как основной.'
        };
        setResults(mockResults);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch A/B results:', error);
    }
  };

  if (loading || !results) return <div className="animate-pulse h-64 bg-slate-50 rounded-3xl" />;

  return (
    <div className="space-y-8">
      {/* Победитель */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-[40px] text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-10 opacity-20">
          <TrendingUp className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-100">Результат теста</span>
          </div>
          <h3 className="text-3xl font-black mb-4">Вариант B побеждает!</h3>
          <p className="text-emerald-50 font-medium max-w-lg mb-6">{results.recommendation}</p>
          <button className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl">
            Применить изменения
          </button>
        </div>
      </motion.div>

      {/* Сравнение вариантов */}
      <div className="grid grid-cols-2 gap-6">
        {results.variants.map((v, idx) => (
          <div key={idx} className={`p-8 rounded-[32px] border ${v.isWinner ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-white shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-900">{v.name}</h4>
              {v.isWinner && <div className="bg-emerald-500 text-white p-1.5 rounded-full"><CheckCircle2 className="w-4 h-4" /></div>}
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm font-medium">Конверсия</span>
                <span className={`text-2xl font-black ${v.isWinner ? 'text-emerald-600' : 'text-slate-900'}`}>{v.conversionRate}%</span>
              </div>
              
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${v.isWinner ? 'bg-emerald-500' : 'bg-slate-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(v.conversionRate / 15) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Визиты</div>
                  <div className="font-bold text-slate-700 flex items-center gap-1.5"><Users className="w-3.5 h-3.4" /> {v.visitors}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Цели</div>
                  <div className="font-bold text-slate-700 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> {v.conversions}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Статистическая достоверность */}
      <div className="bg-slate-900 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-white font-bold">Достоверность данных</h4>
            <p className="text-slate-400 text-sm">Расчет произведен методом Z-теста</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-indigo-400">{results.confidence}%</div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Стат. значимость</div>
        </div>
      </div>
    </div>
  );
};

