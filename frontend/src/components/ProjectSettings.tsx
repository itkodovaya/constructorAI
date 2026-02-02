import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Shield, Lock, Bell, Trash2, Save, ExternalLink, Zap } from 'lucide-react';

interface ProjectSettingsProps {
  project: any;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project, onUpdate, onDelete }) => {
  const [domain, setDomain] = useState(`${project.brandName.toLowerCase().replace(/\s+/g, '-')}.constructor.ai`);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate({ domain });
      setIsSaving(false);
      alert('Настройки успешно сохранены!');
    }, 1000);
  };

  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8 lg:space-y-10 pb-12 sm:pb-16 lg:pb-20">
      {/* General Settings */}
      <section className="bg-white p-4 sm:p-6 lg:p-10 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border border-slate-100 shadow-sm space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Основные настройки</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Управление мета-данными проекта</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="space-y-2 sm:space-y-3">
            <label className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-widest px-1">Название бренда</label>
            <input 
              type="text" 
              defaultValue={project.brandName}
              className="w-full p-3 sm:p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl sm:rounded-2xl outline-none transition-all font-bold text-xs sm:text-sm text-slate-700"
            />
          </div>
          <div className="space-y-2 sm:space-y-3">
            <label className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-widest px-1">Ниша бизнеса</label>
            <input 
              type="text" 
              defaultValue={project.niche}
              className="w-full p-3 sm:p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl sm:rounded-2xl outline-none transition-all font-bold text-xs sm:text-sm text-slate-700"
            />
          </div>
        </div>
      </section>

      {/* Domain Settings */}
      <section className="bg-white p-4 sm:p-6 lg:p-10 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border border-slate-100 shadow-sm space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-xl sm:rounded-2xl flex items-center justify-center">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Домен и публикация</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Настройте адрес вашего сайта</p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <label className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-widest px-1">Ваш поддомен</label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input 
                type="text" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1 p-3 sm:p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-xl sm:rounded-2xl outline-none transition-all font-bold text-xs sm:text-sm text-slate-700"
              />
              <button className="px-4 sm:px-6 py-3 sm:py-3.5 bg-slate-100 text-slate-600 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Проверить
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-indigo-50 rounded-2xl sm:rounded-3xl border border-indigo-100 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 shrink-0 mt-0.5 sm:mt-1" />
            <div className="flex-1">
              <div className="text-xs sm:text-sm font-bold text-indigo-900 mb-1">Собственный домен</div>
              <p className="text-[10px] sm:text-xs text-indigo-700/70 leading-relaxed font-medium">
                Вы можете подключить собственный домен (например, www.mybrand.com) в рамках тарифа **Pro**. 
                Это повысит доверие клиентов и SEO-показатели.
              </p>
              <button className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                Подключить домен
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-50/50 p-4 sm:p-6 lg:p-10 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border border-red-100 shadow-sm space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-red-900">Опасная зона</h3>
            <p className="text-xs sm:text-sm text-red-600/70 font-medium">Действия, которые невозможно отменить</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="text-sm sm:text-base font-bold text-slate-800">Удалить этот проект</div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1">Вся информация, сайты и презентации будут стерты навсегда.</p>
          </div>
          <button 
            onClick={onDelete}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-red-100 text-red-500 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-red-500 hover:text-white transition-all"
          >
            Удалить проект
          </button>
        </div>
      </section>

      <div className="fixed bottom-4 sm:bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-md sm:max-w-none sm:w-auto">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Save className="w-4 h-4 sm:w-5 sm:h-5" />}
          Сохранить изменения
        </button>
      </div>
    </div>
  );
};

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
);

