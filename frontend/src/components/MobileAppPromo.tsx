import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Apple, PlayCircle, QrCode, X, Zap, CheckCircle2 } from 'lucide-react';

export const MobileAppPromo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl flex relative"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-xl transition-all z-10">
          <X className="w-6 h-6 text-slate-400" />
        </button>

        <div className="flex-1 p-16 space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3 h-3" /> Скоро в App Store & Google Play
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Ваш бренд <br /> <span className="text-blue-600">всегда в кармане</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-md">
              Управляйте контентом, отвечайте на отзывы и редактируйте сайт прямо с телефона.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Мгновенные уведомления о заявках',
              'AI-генерация сторис в один тап',
              'Синхронизация всех проектов в реальном времени'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <Apple className="w-6 h-6" />
              <div className="text-left">
                <div className="text-[10px] font-medium opacity-50 leading-none">Download on the</div>
                <div className="text-base leading-none">App Store</div>
              </div>
            </button>
            <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <PlayCircle className="w-6 h-6" />
              <div className="text-left">
                <div className="text-[10px] font-medium opacity-50 leading-none">Get it on</div>
                <div className="text-base leading-none">Google Play</div>
              </div>
            </button>
          </div>
        </div>

        <div className="hidden lg:flex w-[40%] bg-blue-600 relative overflow-hidden items-center justify-center p-12">
          {/* Mock Mobile UI */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative w-64 aspect-[9/19] bg-slate-900 rounded-[3rem] border-[6px] border-slate-800 shadow-2xl p-4 overflow-hidden">
            <div className="w-20 h-5 bg-slate-800 rounded-b-xl mx-auto mb-4" />
            <div className="space-y-4">
              <div className="w-full h-24 bg-blue-500 rounded-2xl" />
              <div className="space-y-2">
                <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                <div className="w-1/2 h-2 bg-white/10 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-4">
                <div className="aspect-square bg-white/5 rounded-xl" />
                <div className="aspect-square bg-white/5 rounded-xl" />
                <div className="aspect-square bg-white/5 rounded-xl" />
                <div className="aspect-square bg-white/5 rounded-xl" />
              </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-10">
              <div className="w-4 h-4 bg-white/20 rounded-full" />
              <div className="w-4 h-4 bg-white/20 rounded-full" />
              <div className="w-4 h-4 bg-white/20 rounded-full" />
            </div>
          </div>

          <div className="absolute bottom-8 right-8 p-4 bg-white rounded-2xl shadow-2xl flex items-center gap-4">
            <QrCode className="w-12 h-12 text-slate-900" />
            <div className="text-[10px] font-black uppercase tracking-widest leading-tight text-slate-400">
              Scan to join <br /> <span className="text-slate-900">Beta Program</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
