import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor, X, QrCode, ExternalLink, Zap } from 'lucide-react';

export const DevicePreview: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [device, setDevice] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setDevice('mobile')}
              className={`p-3 rounded-lg transition-all ${device === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              <Smartphone className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setDevice('tablet')}
              className={`p-3 rounded-lg transition-all ${device === 'tablet' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              <Tablet className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setDevice('desktop')}
              className={`p-3 rounded-lg transition-all ${device === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              <Monitor className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live Sync: Active
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
            Publish <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 bg-slate-100 overflow-y-auto p-12 flex justify-center items-start">
          <motion.div 
            layout
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className={`bg-white shadow-2xl overflow-hidden relative ${
              device === 'mobile' ? 'w-[375px] h-[667px] rounded-[3rem] border-[8px] border-slate-800' :
              device === 'tablet' ? 'w-[768px] h-[1024px] rounded-2xl border-[4px] border-slate-800' :
              'w-full max-w-5xl h-full rounded-sm'
            }`}
          >
            {/* Mock Site Content */}
            <div className="w-full h-full bg-slate-50 flex flex-col">
              <div className="h-16 bg-white border-b px-8 flex items-center justify-between">
                <div className="w-24 h-4 bg-slate-200 rounded" />
                <div className="flex gap-4">
                  <div className="w-8 h-2 bg-slate-100 rounded" />
                  <div className="w-8 h-2 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="p-20 space-y-8 text-center">
                <div className="w-32 h-32 bg-white rounded-3xl mx-auto shadow-sm" />
                <div className="space-y-4">
                  <div className="w-3/4 h-12 bg-slate-200 rounded-2xl mx-auto" />
                  <div className="w-1/2 h-6 bg-slate-100 rounded-xl mx-auto" />
                </div>
                <div className="w-40 h-12 bg-blue-600/10 rounded-xl mx-auto" />
              </div>
            </div>
          </motion.div>
        </main>

        <aside className="w-80 bg-white border-l border-slate-200 p-8 shrink-0 flex flex-col gap-10">
          <div>
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6">Live Preview QR</h3>
            <div className="bg-slate-50 p-6 rounded-[32px] border-2 border-dashed border-slate-100 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <QrCode className="w-32 h-32 text-slate-800" />
              </div>
              <p className="text-xs font-medium text-slate-400">
                Отсканируйте, чтобы увидеть сайт на своем смартфоне в реальном времени.
              </p>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
               <Zap className="w-5 h-5 text-blue-600" />
               <div className="text-xs font-bold text-blue-700">Мгновенная синхронизация</div>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed px-2">
               Любые изменения в редакторе будут мгновенно отображаться на всех открытых устройствах.
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
