import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Zap, Brain, Database, Play, CheckCircle, AlertCircle, 
  BarChart2, Settings, History, ChevronRight, Sparkles,
  Info, Cpu, Network
} from 'lucide-react';
import { api } from '../services/api';

interface Dataset {
  id: string;
  contentType: string;
  samples: number;
  status: string;
  createdAt: string;
}

interface TrainingJob {
  id: string;
  modelType: string;
  status: string;
  progress: number;
  createdAt: string;
}

export const FineTuningDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'datasets' | 'jobs' | 'models'>('datasets');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const datasetsData = await api.getFineTuningJobs(); // В реальности другие методы
      setDatasets([
        { id: '1', contentType: 'text', samples: 45, status: 'completed', createdAt: '2023-11-01' },
        { id: '2', contentType: 'layout', samples: 12, status: 'completed', createdAt: '2023-11-05' }
      ]);
      setJobs([
        { id: 'job-1', modelType: 'text', status: 'completed', progress: 100, createdAt: '2023-11-02' },
        { id: 'job-2', modelType: 'layout', status: 'running', progress: 45, createdAt: '2023-11-06' }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch fine-tuning data:', error);
    }
  };

  const startTraining = async (type: string) => {
    try {
      // api.startFineTuning({ modelType: type, datasetId: '...' })
      alert(`Запущено обучение модели: ${type}`);
    } catch (error) {
      console.error('Failed to start training:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-100">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Обучение</h1>
            <p className="text-slate-500 font-medium">Fine-tuning моделей на ваших данных</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <TabButton active={activeTab === 'datasets'} onClick={() => setActiveTab('datasets')} label="Датасеты" />
          <TabButton active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} label="Обучение" />
          <TabButton active={activeTab === 'models'} onClick={() => setActiveTab('models')} label="Модели" />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard icon={<Database className="text-blue-500" />} label="Примеров собрано" value="1,240" />
        <StatCard icon={<Cpu className="text-purple-500" />} label="Обученных моделей" value="3" />
        <StatCard icon={<Zap className="text-amber-500" />} label="GPU часов" value="12.5" />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'datasets' && (
          <motion.div 
            key="datasets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Ваши датасеты</h3>
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Play className="w-4 h-4" /> Собрать данные
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {datasets.map(d => (
                <div key={d.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">{d.contentType} dataset</h4>
                      <p className="text-slate-500 text-sm font-medium">{d.samples} примеров из ваших проектов</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-black text-slate-400 uppercase">{d.createdAt}</span>
                    <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
                      Обучить на этом <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'jobs' && (
          <motion.div 
            key="jobs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Network className="w-48 h-48 text-indigo-600" />
              </div>
              <div className="relative z-10 max-w-xl">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Запустить новое обучение</h3>
                <p className="text-slate-500 mb-6 font-medium">Ваш персональный AI станет лучше понимать стиль ваших проектов. Рекомендуется минимум 50 примеров.</p>
                <div className="flex flex-wrap gap-3">
                  <TrainingOption label="Копирайтинг" type="text" onClick={() => startTraining('text')} />
                  <TrainingOption label="Дизайн-макеты" type="layout" onClick={() => startTraining('layout')} />
                  <TrainingOption label="Цвета" type="color" onClick={() => startTraining('color')} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Активные задачи</h3>
              {jobs.map(j => (
                <div key={j.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${j.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600 animate-pulse'}`}>
                      {j.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 max-w-xs">
                      <h4 className="font-bold text-slate-900">Fine-tuning {j.modelType}</h4>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          className="h-full bg-indigo-500" 
                          initial={{ width: 0 }}
                          animate={{ width: `${j.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${j.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                      {j.status}
                    </span>
                    <p className="text-xs text-slate-400 font-bold mt-1">{j.progress}% завершено</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-[40px] flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-xs">AI Инсайт</h4>
          </div>
          <p className="text-slate-300 font-medium max-w-lg">Обученные модели увеличивают скорость генерации контента на 40% и делают его более релевантным вашему бренду.</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 -mr-10 -mb-10">
          <Brain className="w-64 h-64" />
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
      active ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {label}
  </button>
);

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
      <span className="text-slate-500 font-medium text-sm">{label}</span>
    </div>
    <div className="text-2xl font-black text-slate-900">{value}</div>
  </div>
);

const TrainingOption = ({ label, onClick }: any) => (
  <button
    onClick={onClick}
    className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-2 group"
  >
    <Play className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-2" />
    {label}
  </button>
);

