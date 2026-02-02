import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, Rocket, Star, ShieldCheck } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const plans = [
    {
      name: "Basic",
      price: "0",
      description: "Для личного использования",
      features: ["1 проект", "Базовая AI-генерация", "Экспорт в PNG", "72 часа хранения"],
      icon: <Star className="w-5 h-5 text-slate-400" />,
      buttonText: "Текущий план",
      highlight: false
    },
    {
      name: "Pro",
      price: "20",
      description: "Для малого бизнеса и фриланса",
      features: ["Безлимитные проекты", "Приоритетный AI (GPT-4)", "Удаление фона и ретушь", "Собственные домены", "1 ТБ хранилища"],
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      buttonText: "Выбрать Pro",
      highlight: true
    },
    {
      name: "Brand Kit",
      price: "120",
      description: "Один раз и навсегда",
      features: ["Все функции Pro", "Векторные форматы (SVG/PDF)", "Полные права на бренд", "Гайдбук в PDF", "Пожизненный доступ"],
      icon: <Rocket className="w-5 h-5 text-indigo-600" />,
      buttonText: "Купить Brand Kit",
      highlight: false
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="flex-1 p-8 md:p-16">
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  Тарифные планы
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4">Выберите путь вашего бренда</h2>
                <p className="text-slate-500 max-w-lg">Масштабируйте свой бизнес с помощью профессиональных инструментов ИИ.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div 
                    key={plan.name}
                    className={`relative p-8 rounded-3xl border-2 transition-all flex flex-col ${
                      plan.highlight 
                      ? 'border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-600/5' 
                      : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    {plan.highlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                        Популярный
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-2xl ${plan.highlight ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                        {plan.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-slate-900">${plan.price}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {plan.price === "0" ? "Бесплатно" : plan.name === "Brand Kit" ? "Разово" : "В месяц"}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mb-8 leading-relaxed">{plan.description}</p>

                    <div className="space-y-4 mb-10 flex-1">
                      {plan.features.map(feature => (
                        <div key={feature} className="flex items-start gap-3">
                          <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                            plan.highlight ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                          }`}>
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span className="text-xs font-medium text-slate-600 leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                        plan.highlight 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700' 
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                      } ${plan.price === "0" ? 'opacity-50 cursor-default' : 'active:scale-95'}`}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 pt-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-full">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Безопасная оплата</h4>
                    <p className="text-xs text-slate-500">Поддерживаем российские и зарубежные карты через Stripe и Мир.</p>
                  </div>
                </div>
                <div className="flex gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Mir_logo.svg" className="h-4" alt="Mir" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

