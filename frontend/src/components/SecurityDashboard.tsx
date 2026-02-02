import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Key, Eye, 
  Download, Trash2, ShieldCheck, AlertCircle,
  Smartphone, Mail, History, FileText,
  ChevronRight, ShieldAlert
} from 'lucide-react';

export const SecurityDashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [logs, setLogs] = useState([
    { id: '1', action: 'Успешный вход', date: '2024-01-29 14:20', device: 'Chrome / Windows', ip: '185.12.44.10' },
    { id: '2', action: 'Экспорт проекта "SaaS Landing"', date: '2024-01-28 11:05', device: 'Safari / macOS', ip: '185.12.44.10' },
    { id: '3', action: 'Смена пароля', date: '2024-01-25 09:15', device: 'Chrome / Windows', ip: '92.14.122.5' }
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Безопасность и данные</h3>
          <p className="text-slate-500 font-medium">Управляйте защитой вашего аккаунта и приватностью</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-100">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest">Защита активна</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Двухфакторная аутентификация */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Двухфакторная аутентификация (2FA)</h4>
                  <p className="text-xs text-slate-400 font-medium">Дополнительный уровень защиты вашего входа</p>
                </div>
              </div>
              <button 
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
                  mfaEnabled ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mfaEnabled ? 'Включено' : 'Настроить'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-6 rounded-3xl border transition-all ${mfaEnabled ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-50 bg-slate-50/50 opacity-50'}`}>
                <Smartphone className="w-6 h-6 text-indigo-600 mb-4" />
                <h5 className="font-bold text-slate-900 mb-1">Приложение (TOTP)</h5>
                <p className="text-[10px] text-slate-500 font-medium mb-4">Google Authenticator или Authy</p>
                <button disabled={!mfaEnabled} className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                  Изменить <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="p-6 rounded-3xl border border-slate-50 bg-slate-50/50 opacity-50">
                <Mail className="w-6 h-6 text-slate-400 mb-4" />
                <h5 className="font-bold text-slate-900 mb-1">Email-код</h5>
                <p className="text-[10px] text-slate-500 font-medium mb-4">Код подтверждения на почту</p>
                <button disabled className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  Подключить <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Журнал аудита */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" /> Последние действия
            </h4>
            <div className="space-y-4">
              {logs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <Eye className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{log.action}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{log.device} • {log.ip}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.date}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
              Показать всю историю
            </button>
          </div>
        </div>

        {/* Управление данными (GDPR) */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <FileText className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-4">Ваши данные</h4>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
                Согласно GDPR и ФЗ-152, вы имеете право на экспорт и удаление ваших персональных данных.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-white/10">
                  <Download className="w-4 h-4" /> Экспортировать (JSON)
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-white/10">
                  <Download className="w-4 h-4" /> Скачать архив ассетов
                </button>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 rounded-[40px] p-8 border border-rose-100">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <ShieldAlert className="w-6 h-6" />
              <h4 className="font-bold">Опасная зона</h4>
            </div>
            <p className="text-rose-900/60 text-xs font-medium leading-relaxed mb-6">
              Удаление аккаунта приведет к безвозвратной потере всех проектов, ассетов и настроек.
            </p>
            <button className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-200">
              <Trash2 className="w-4 h-4" /> Удалить аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

