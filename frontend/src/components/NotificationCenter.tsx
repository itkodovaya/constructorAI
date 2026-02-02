import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sparkles, CheckCircle2, Download, AlertCircle, X, Zap } from 'lucide-react';

interface Notification {
  id: string;
  type: 'ai' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'ai',
      title: 'AI Отчет по сайту',
      message: 'Я проанализировал вашу нишу и подготовил 4 новых блока контента. Проверьте в редакторе.',
      timestamp: '2 мин назад',
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: 'Экспорт завершен',
      message: 'HTML-код вашего сайта успешно сгенерирован и скачан.',
      timestamp: '15 мин назад',
      read: true
    },
    {
      id: '3',
      type: 'info',
      title: 'Новая функция',
      message: 'Теперь вы можете настраивать SEO-метаданные прямо в конструкторе.',
      timestamp: '1 час назад',
      read: true
    }
  ];

  return (
    <div className="fixed inset-0 z-[90] flex justify-end p-6 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col pointer-events-auto overflow-hidden"
      >
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Уведомления</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => (
            <div 
              key={n.id}
              className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                n.read ? 'border-slate-50 bg-slate-50/30' : 'border-blue-50 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'ai' ? 'bg-indigo-50 text-indigo-600' :
                  n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {n.type === 'ai' ? <Sparkles className="w-5 h-5" /> :
                   n.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                    {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{n.message}</p>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-2">
                    {n.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all shadow-sm">
            Пометить все как прочитанные
          </button>
        </div>
      </motion.div>
    </div>
  );
};
