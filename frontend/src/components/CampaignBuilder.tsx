import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Target, MessageSquare, Mail, 
  Share2, Zap, Sparkles, ChevronRight,
  Layout, Send, CheckCircle2, Loader2,
  Users, BarChart
} from 'lucide-react';

export const CampaignBuilder: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState({
    goal: '',
    audience: '',
    tone: 'professional',
    channels: ['landing', 'email', 'social']
  });

  const handleStart = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3); // Успех
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[40px] border border-slate-100 p-12 shadow-xl shadow-slate-100"
          >
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-10 shadow-xl shadow-indigo-100">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">Запустите кампанию за 1 минуту</h2>
            <p className="text-slate-500 font-medium mb-12 text-lg">AI агенты создадут лендинг, серию писем и контент для соцсетей на основе вашей цели.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Какая ваша главная цель?</label>
                <input 
                  value={config.goal}
                  onChange={(e) => setConfig({...config, goal: e.target.value})}
                  placeholder="Например: Продажа новой коллекции кроссовок" 
                  className="w-full bg-slate-50 border-none rounded-3xl p-6 text-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200"
              >
                Продолжить к настройкам <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[40px] border border-slate-100 p-12 shadow-xl shadow-slate-100"
          >
            <h3 className="text-2xl font-black text-slate-900 mb-8">Детали кампании</h3>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Целевая аудитория</label>
                  <input 
                    value={config.audience}
                    onChange={(e) => setConfig({...config, audience: e.target.value})}
                    placeholder="Например: Молодежь 18-25 лет" 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Тональность</label>
                  <select 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600"
                    value={config.tone}
                    onChange={(e) => setConfig({...config, tone: e.target.value})}
                  >
                    <option value="professional">Профессиональный</option>
                    <option value="friendly">Дружелюбный</option>
                    <option value="luxury">Премиальный</option>
                    <option value="bold">Дерзкий</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Каналы продвижения</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'landing', label: 'Landing Page', icon: <Layout className="w-4 h-4" /> },
                    { id: 'email', label: 'Email Sequence', icon: <Mail className="w-4 h-4" /> },
                    { id: 'social', label: 'Social Posts', icon: <Share2 className="w-4 h-4" /> }
                  ].map(ch => (
                    <button 
                      key={ch.id}
                      onClick={() => {
                        const next = config.channels.includes(ch.id as any) 
                          ? config.channels.filter(c => c !== ch.id)
                          : [...config.channels, ch.id as any];
                        setConfig({...config, channels: next});
                      }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                        config.channels.includes(ch.id as any) ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-100 text-slate-400'
                      }`}
                    >
                      {ch.icon} <span className="font-bold text-sm">{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              disabled={isGenerating}
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-6 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-100 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
              {isGenerating ? 'AI Агенты работают...' : 'Запустить генерацию всей кампании'}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-emerald-500 rounded-[40px] p-12 text-white text-center shadow-2xl shadow-emerald-100">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black mb-2">Кампания готова к запуску!</h3>
              <p className="text-emerald-50 font-medium">Мы сгенерировали лендинг, 3 письма и 5 постов для соцсетей.</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <ResultCard icon={<Layout />} title="Лендинг" status="Готов" />
              <ResultCard icon={<Mail />} title="Email-цепочка" status="Готов (3/3)" />
              <ResultCard icon={<Share2 />} title="Соцсети" status="Готов (5/5)" />
            </div>

            <button className="w-full bg-slate-900 text-white py-6 rounded-3xl font-bold text-lg shadow-xl hover:bg-slate-800 transition-all">
              Перейти к обзору кампании
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResultCard = ({ icon, title, status }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <div className="font-bold text-slate-900 mb-1">{title}</div>
    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{status}</div>
  </div>
);

