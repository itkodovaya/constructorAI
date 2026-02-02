import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Star, Bug, Lightbulb, Send, CheckCircle2 } from 'lucide-react';

export const FeedbackModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [type, setType] = useState<'bug' | 'idea' | 'praise'>('praise');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Имитация отправки
    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-xl transition-all">
          <X className="w-6 h-6 text-slate-400" />
        </button>

        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div 
              key="form"
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Обратная связь</h2>
                  <p className="text-slate-500 text-sm font-medium">Помогите нам стать лучше</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-2">
                  {[
                    { id: 'bug', icon: <Bug className="w-4 h-4" />, label: 'Баг' },
                    { id: 'idea', icon: <Lightbulb className="w-4 h-4" />, label: 'Идея' },
                    { id: 'praise', icon: <Star className="w-4 h-4" />, label: 'Отзыв' }
                  ].map(btn => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setType(btn.id as any)}
                      className={`flex-1 py-3 px-2 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        type === btn.id 
                          ? 'border-blue-600 bg-blue-50 text-blue-600' 
                          : 'border-slate-50 text-slate-400 hover:border-slate-100'
                      }`}
                    >
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-widest">Оценка сервиса</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 transition-all ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                      >
                        <Star className={`w-8 h-8 ${rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-widest">Ваш комментарий</label>
                  <textarea
                    required
                    className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500/20 h-32 outline-none"
                    placeholder="Что мы можем улучшить?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  Отправить <Send className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-16 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">Спасибо!</h3>
                <p className="text-slate-500 font-medium">Ваш отзыв очень важен для нашей AI-команды.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
