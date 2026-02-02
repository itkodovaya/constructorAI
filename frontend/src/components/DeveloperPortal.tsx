import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, Terminal, Book, Globe, 
  Plus, Key, Eye, EyeOff, 
  Copy, ExternalLink, MessageSquare, 
  Cpu, Box, ShieldCheck, Zap
} from 'lucide-react';

export const DeveloperPortal: React.FC = () => {
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production App', key: 'sk_live_847...291', scopes: ['read', 'write'], date: '2024-01-15' },
    { id: '2', name: 'Staging Environment', key: 'sk_test_123...456', scopes: ['read'], date: '2024-01-20' }
  ]);
  const [showKey, setShowKey] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Портал разработчика</h3>
          <p className="text-slate-500 font-medium">Создавайте плагины и интегрируйте ConstructorAI в свои приложения</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-100">
            <Plus className="w-4 h-4" /> Создать приложение
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* API Keys */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-600" /> API Ключи
              </h4>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REST & GraphQL</span>
            </div>
            
            <div className="space-y-4">
              {apiKeys.map(key => (
                <div key={key.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{key.name}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-600 flex items-center justify-between">
                      {showKey === key.id ? key.key : '••••••••••••••••••••••••'}
                      <button onClick={() => setShowKey(showKey === key.id ? null : key.id)}>
                        {showKey === key.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {key.scopes.map(s => (
                      <span key={s} className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Документация и SDK */}
          <div className="grid grid-cols-2 gap-6">
            <DocCard 
              icon={<Book className="w-6 h-6 text-emerald-600" />}
              title="API Reference"
              desc="Полное описание всех эндпоинтов и схем данных."
              color="emerald"
            />
            <DocCard 
              icon={<Code2 className="w-6 h-6 text-indigo-600" />}
              title="Plugin SDK"
              desc="Библиотеки для создания кастомных блоков и плагинов."
              color="indigo"
            />
          </div>
        </div>

        {/* Сообщество и поддержка */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white">
            <h4 className="text-xl font-bold mb-6">Сообщество</h4>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#5865F2] rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">Discord Server</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">Forum</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </button>
            </div>
            <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold">Certification</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Станьте сертифицированным разработчиком ConstructorAI и получите доступ к эксклюзивным API.
              </p>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-[40px] p-8 border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-4">Plugin Marketplace</h4>
            <p className="text-indigo-900/60 text-xs font-medium leading-relaxed mb-6">
              Опубликуйте свой плагин и начните зарабатывать на каждой установке в проектах пользователей.
            </p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all">
              Подать заявку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocCard = ({ icon, title, desc, color }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
    <div className={`w-14 h-14 bg-${color}-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h5 className="font-bold text-slate-900 mb-2">{title}</h5>
    <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

