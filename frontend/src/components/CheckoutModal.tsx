import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ShieldCheck, Lock, CheckCircle2, 
  ArrowRight, Landmark, Zap, Star 
} from 'lucide-react';

export const CheckoutModal: React.FC<{ 
  item: any; 
  onClose: () => void; 
  onSuccess: () => void;
}> = ({ item, onClose, onSuccess }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(onSuccess, 2000);
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl"
      >
        {step === 'details' && (
          <div className="p-10">
            <div className="flex justify-between items-start mb-10">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-indigo-600" />
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl">
                <Zap className="w-6 h-6 text-slate-300" />
              </button>
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-2">Оформление покупки</h2>
            <p className="text-slate-500 font-medium mb-8">Вы приобретаете: <span className="text-indigo-600">{item.name}</span></p>

            <div className="bg-slate-50 rounded-3xl p-6 mb-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Стоимость</span>
                <span className="text-xl font-black text-slate-900">${item.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Лицензия</span>
                <span className="text-slate-900 font-bold">Commercial (Lifetime)</span>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">Итого к оплате</span>
                <span className="text-2xl font-black text-indigo-600">${item.price}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handlePay}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Оплатить картой <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure SSL</div>
                <div className="flex items-center gap-1"><Lock className="w-3 h-3" /> PCI DSS</div>
                <div className="flex items-center gap-1"><Star className="w-3 h-3" /> Verified Author</div>
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-20 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mb-8" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Обработка платежа</h3>
            <p className="text-slate-500 font-medium">Это займет всего несколько секунд...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-20 text-center bg-emerald-50/30">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-black text-emerald-600 mb-2">Оплата прошла!</h3>
            <p className="text-slate-600 font-medium">Товар добавлен в вашу библиотеку.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

