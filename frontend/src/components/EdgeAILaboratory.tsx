import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Zap, ShieldCheck, BrainCircuit, 
  BarChart, FileText, ImageIcon, Search,
  RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import { edgeAI } from '../services/edge-ai';

export const EdgeAILaboratory: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<'sentiment' | 'summary'>('sentiment');

  const runTask = async () => {
    setLoading(true);
    try {
      let data;
      if (activeTask === 'sentiment') {
        data = await edgeAI.analyzeSentiment(inputText);
      } else {
        data = await edgeAI.summarize(inputText);
      }
      setResult(data);
    } catch (error) {
      console.error('Edge AI Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">Edge AI Laboratory</h3>
            <p className="text-slate-500 font-medium">Нейросети, работающие прямо на вашем устройстве</p>
          </div>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-100">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Local & Secure</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 w-fit">
              <button 
                onClick={() => setActiveTask('sentiment')}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTask === 'sentiment' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                Анализ настроения
              </button>
              <button 
                onClick={() => setActiveTask('summary')}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTask === 'summary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                Саммари (Beta)
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Введите текст для локальной обработки AI..."
              className="w-full h-40 bg-slate-50 border-none rounded-3xl p-6 text-sm focus:ring-2 focus:ring-amber-500 mb-6"
            />

            <button
              onClick={runTask}
              disabled={loading || !inputText}
              className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-amber-600 transition-all shadow-xl shadow-amber-100 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
              Запустить Edge AI
            </button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-[40px] p-8 text-white"
              >
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Результат обработки</h4>
                <div className="text-lg font-bold">
                  {activeTask === 'sentiment' ? (
                    <div className="flex items-center gap-4">
                      <span className={result.label === 'POSITIVE' ? 'text-emerald-400' : 'text-rose-400'}>
                        {result.label}
                      </span>
                      <span className="text-sm text-slate-500">Уверенность: {(result.score * 100).toFixed(1)}%</span>
                    </div>
                  ) : (
                    <p className="text-slate-300 text-sm leading-relaxed">{result}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Почему Edge AI?
            </h4>
            <div className="space-y-4">
              <FeatureItem icon={<ShieldCheck />} title="100% Приватно" desc="Данные не отправляются на сервер" />
              <FeatureItem icon={<Zap />} title="Мгновенно" desc="Никаких сетевых задержек" />
              <FeatureItem icon={<RefreshCw />} title="Оффлайн" desc="Работает даже без интернета" />
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[40px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Cpu className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold mb-2 text-lg">Hardware Acceleration</h4>
              <p className="text-xs text-indigo-100 leading-relaxed mb-6">
                Мы используем WebGPU и WebAssembly для максимальной производительности нейросетей на вашем железе.
              </p>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between text-[10px] font-black uppercase mb-2">
                  <span>GPU Usage</span>
                  <span>Optimal</span>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: any) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 text-amber-500">
      {icon}
    </div>
    <div>
      <div className="font-bold text-slate-900 text-sm">{title}</div>
      <div className="text-[10px] text-slate-400 font-medium">{desc}</div>
    </div>
  </div>
);

