import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Plus, Play, Pause, CheckCircle2, 
  Trash2, ChevronRight, Layout, MousePointer2,
  FileText, Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { ABTestResults } from './ABTestResults';

export const ABTestManager: React.FC<{ projectId: string; onClose: () => void }> = ({ projectId, onClose }) => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchTests();
  }, [projectId]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      // api.getABTests(projectId)
      setTimeout(() => {
        setTests([
          { id: '1', name: 'Заголовок главной', status: 'running', goal: 'click', createdAt: '2023-11-10' },
          { id: '2', name: 'Цвет кнопки CTA', status: 'completed', goal: 'purchase', createdAt: '2023-11-05' }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">A/B Тестирование</h2>
              <p className="text-slate-500 text-sm font-medium">Оптимизируйте конверсию вашего проекта</p>
            </div>
          </div>
          <button 
            onClick={() => setShowCreate(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus className="w-5 h-5" /> Создать тест
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-80 border-r border-slate-100 p-6 space-y-4 overflow-y-auto bg-slate-50/30">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Ваши эксперименты</h3>
            <div className="space-y-2">
              {tests.map(test => (
                <button
                  key={test.id}
                  onClick={() => setSelectedTest(test)}
                  className={`w-full text-left p-4 rounded-3xl transition-all border ${
                    selectedTest?.id === test.id 
                      ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-50' 
                      : 'bg-transparent border-transparent hover:bg-white hover:border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      test.status === 'running' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {test.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{test.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{test.name}</h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-medium">
                    <MousePointer2 className="w-3 h-3" />
                    Цель: {test.goal}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            {selectedTest ? (
              <ABTestResults testId={selectedTest.id} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <BarChart3 className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Выберите эксперимент</h3>
                <p className="text-slate-500 max-w-xs font-medium">Выберите тест из списка слева для просмотра детальной аналитики</p>
              </div>
            )}
          </main>
        </div>
      </motion.div>
    </motion.div>
  );
};
