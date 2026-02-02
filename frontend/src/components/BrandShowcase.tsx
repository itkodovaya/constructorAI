import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, CreditCard, ShoppingBag, Box, Layout } from 'lucide-react';

interface BrandShowcaseProps {
  brandName: string;
  assets: any;
}

export const BrandShowcase: React.FC<BrandShowcaseProps> = ({ brandName, assets }) => {
  const mockups = [
    { 
      title: 'Визитные карточки', 
      icon: <CreditCard className="w-5 h-5" />, 
      render: (
        <div className="relative w-full aspect-video perspective-1000">
          <motion.div 
            whileHover={{ rotateY: 20, rotateX: -10 }}
            className="w-full h-full bg-white rounded-xl shadow-xl border border-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between"
            style={{ borderLeft: `8px solid ${assets.palette?.[1] || '#000'}` }}
          >
            <img src={assets.logo} alt="Logo" className="w-12 h-12 object-contain" />
            <div>
              <div className="font-bold text-slate-800 text-sm">{brandName}</div>
              <div className="text-[8px] text-slate-400 uppercase tracking-widest mt-1">Premium Identity</div>
            </div>
          </motion.div>
        </div>
      )
    },
    { 
      title: 'Мобильное приложение', 
      icon: <Smartphone className="w-5 h-5" />, 
      render: (
        <div className="w-full aspect-video flex items-center justify-center">
          <div className="w-24 h-48 bg-slate-900 rounded-[2rem] border-[4px] border-slate-800 shadow-2xl relative overflow-hidden p-2">
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden" style={{ backgroundColor: assets.palette?.[0] || '#fff' }}>
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <img src={assets.logo} alt="Logo" className="w-8 h-8 object-contain" />
                <div className="w-12 h-1 bg-slate-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      title: 'Упаковка / Мерч', 
      icon: <Box className="w-5 h-5" />, 
      render: (
        <div className="w-full aspect-video flex items-center justify-center p-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-32 h-40 shadow-2xl rounded-lg relative overflow-hidden"
            style={{ backgroundColor: assets.palette?.[1] || '#000' }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <img src={assets.logo} alt="Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-[8px] font-bold text-white/50 tracking-widest uppercase">
              Limited Edition
            </div>
          </motion.div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {mockups.map((m, i) => (
          <div key={i} className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 text-slate-400">
              {React.cloneElement(m.icon, { className: 'w-4 h-4 sm:w-5 sm:h-5' })}
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">{m.title}</span>
            </div>
            <div className="bg-slate-50/50 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] p-4 sm:p-6 lg:p-10 border border-slate-100 flex items-center justify-center min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]">
              {m.render}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 sm:p-8 lg:p-12 rounded-[32px] sm:rounded-[40px] lg:rounded-[48px] text-white flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl -mr-24 sm:-mr-32 -mt-24 sm:-mt-32" />
        <div className="relative z-10 space-y-4 sm:space-y-6 max-w-xl">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">Ваш бренд готов к реальному миру</h3>
          <p className="text-sm sm:text-base lg:text-lg text-white/80 font-medium">
            Мы подготовили все необходимые файлы в высоком разрешении для печати и веба.
          </p>
          <div className="flex gap-3 sm:gap-4">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" /> Заказать печать мерча
            </button>
          </div>
        </div>
        <div className="relative z-10 w-full lg:w-72 aspect-square bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 p-6 sm:p-8 flex items-center justify-center">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="text-4xl sm:text-5xl lg:text-6xl">✨</div>
            <div className="text-xs sm:text-sm font-bold">100% Brand Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

