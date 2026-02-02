import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, RefreshCw, ChevronRight, Clock, ShieldCheck, Database } from 'lucide-react';

interface HistoryItem {
  id: string;
  timestamp: string;
  action: string;
  assets: any;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  onClose: () => void;
  onRestore: (assets: any) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onClose, onRestore }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-[60] flex flex-col border-l border-slate-100"
    >
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <History className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">История версий</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Безопасное облако</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
              <Database className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-medium">История изменений пока пуста. Каждое сохранение создаст новую версию здесь.</p>
          </div>
        ) : (
          history.slice().reverse().map((item, index) => (
            <div 
              key={item.id}
              className="group p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-lg transition-all relative overflow-hidden cursor-pointer"
              onClick={() => onRestore(item.assets)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-bold text-slate-400">{item.timestamp}</span>
                </div>
                {index === 0 && (
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Текущая</span>
                )}
              </div>
              
              <h4 className="text-sm font-bold text-slate-800 mb-4">{item.action}</h4>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  {item.assets.palette?.slice(0, 3).map((color: string, i: number) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Восстановить версию <RefreshCw className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 border-t border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
          <ShieldCheck className="w-8 h-8 text-indigo-600 shrink-0" />
          <p className="text-[10px] font-medium text-indigo-700 leading-relaxed">
            Ваши данные защищены сквозным шифрованием. Вы можете откатиться к любому состоянию за последние 30 дней.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
