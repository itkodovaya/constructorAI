import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Heart, AlertTriangle, 
  Send, X, Sparkles, Smile, Frown, Meh
} from 'lucide-react';

export const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'rating' | 'text' | 'success'>('rating');
  const [type, setType] = useState<'love' | 'bug' | 'idea' | null>(null);

  return (
    <div className="fixed bottom-8 left-8 z-[500]">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-indigo-700 hover:scale-110 transition-all group"
          >
            <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 w-96 overflow-hidden relative"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            {step === 'rating' && (
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">Как вам ConstructorAI?</h4>
                  <p className="text-slate-500 text-xs font-medium">Ваш отзыв помогает нам расти.</p>
                </div>
                
                <div className="flex justify-between items-center px-4">
                  <RatingBtn icon={<Smile className="w-8 h-8" />} label="Обожаю" color="emerald" onClick={() => { setType('love'); setStep('text'); }} />
                  <RatingBtn icon={<Meh className="w-8 h-8" />} label="Нормально" color="amber" onClick={() => { setType('idea'); setStep('text'); }} />
                  <RatingBtn icon={<Frown className="w-8 h-8" />} label="Есть проблемы" color="rose" onClick={() => { setType('bug'); setStep('text'); }} />
                </div>
              </div>
            )}

            {step === 'text' && (
              <div className="space-y-6">
                <h4 className="text-xl font-black text-slate-900">Расскажите подробнее</h4>
                <textarea 
                  placeholder="Что именно вам понравилось или что нужно исправить?"
                  className="w-full h-32 bg-slate-50 border-none rounded-3xl p-5 text-sm focus:ring-2 focus:ring-indigo-600 shadow-inner"
                />
                <button 
                  onClick={() => setStep('success')}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-900/10 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Отправить отзыв
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Спасибо!</h4>
                <p className="text-slate-500 text-xs font-medium px-8">Мы получили ваш отзыв. Команда ConstructorAI уже работает над этим.</p>
                <button onClick={() => setIsOpen(false)} className="text-indigo-600 font-black text-xs uppercase tracking-widest pt-4">Закрыть</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RatingBtn = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`p-4 bg-${color}-50 text-${color}-400 rounded-3xl group-hover:bg-${color}-500 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 transition-all`}>
      {icon}
    </div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
  </button>
);

