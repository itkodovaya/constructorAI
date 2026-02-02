import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, Type, Contrast, 
  Wind, MousePointer2, Check,
  Eye, EyeOff, ZapOff, Sun, Moon
} from 'lucide-react';

export const AccessibilityHub: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    dyslexicFont: false,
    highlightLinks: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    const newVal = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newVal }));
    
    // Применяем классы к body для глобального эффекта
    if (newVal) {
      document.body.classList.add(`a11y-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`);
    } else {
      document.body.classList.remove(`a11y-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`);
    }
  };

  return (
    <div className="fixed bottom-24 left-8 z-[500]">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 w-80 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Accessibility className="w-32 h-32" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-black text-slate-900 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-indigo-600" />
              Доступность
            </h4>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest">Закрыть</button>
          </div>

          <div className="space-y-2">
            <A11yToggle 
              icon={<Contrast className="w-4 h-4" />}
              label="Высокий контраст"
              active={settings.highContrast}
              onClick={() => toggleSetting('highContrast')}
            />
            <A11yToggle 
              icon={<Type className="w-4 h-4" />}
              label="Увеличенный шрифт"
              active={settings.largeText}
              onClick={() => toggleSetting('largeText')}
            />
            <A11yToggle 
              icon={<ZapOff className="w-4 h-4" />}
              label="Без анимаций"
              active={settings.reducedMotion}
              onClick={() => toggleSetting('reducedMotion')}
            />
            <A11yToggle 
              icon={<Eye className="w-4 h-4" />}
              label="Шрифт для дислексиков"
              active={settings.dyslexicFont}
              onClick={() => toggleSetting('dyslexicFont')}
            />
            <A11yToggle 
              icon={<MousePointer2 className="w-4 h-4" />}
              label="Подсветка ссылок"
              active={settings.highlightLinks}
              onClick={() => toggleSetting('highlightLinks')}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              Ваши настройки сохраняются локально и будут применяться при каждом визите.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const A11yToggle = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
      active ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 border-slate-50 text-slate-600 hover:bg-slate-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`${active ? 'text-white' : 'text-indigo-600'}`}>
        {icon}
      </div>
      <span className="text-xs font-bold">{label}</span>
    </div>
    {active && <Check className="w-4 h-4" />}
  </button>
);

