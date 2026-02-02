import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MapPin, Smartphone, MousePointer2, 
  Plus, Trash2, Zap, Layout, Settings,
  CheckCircle2, AlertCircle, Sparkles, Filter,
  ArrowRight, Globe, Target
} from 'lucide-react';

export const PersonalizationManager: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [rules, setRules] = useState<any[]>([
    { id: '1', name: 'Трафик из Instagram', condition: 'UTM: social', active: true, impact: '+12% CR' },
    { id: '2', name: 'Посетители из Москвы', condition: 'GEO: Moscow', active: true, impact: '+8% CR' }
  ]);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-900">Персонализация</h3>
          <p className="text-slate-500 font-medium">Динамическая подстройка контента под каждого посетителя</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          <Plus className="w-4 h-4" /> Создать правило
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Список правил */}
        <div className="col-span-2 space-y-4">
          {rules.map(rule => (
            <div key={rule.id} className="bg-white border border-slate-100 p-6 rounded-[32px] hover:shadow-xl hover:shadow-slate-50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{rule.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <Filter className="w-3 h-3" /> {rule.condition}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-500">{rule.impact}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</div>
                  </div>
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${rule.active ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${rule.active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase">Hero Section</span>
                  <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase">Headline Change</span>
                </div>
                <button className="text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Инфо-панель */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Target className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-4">Умные сегменты</h4>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
                ConstructorAI автоматически выделяет группы пользователей для точечного воздействия.
              </p>
              <div className="space-y-4">
                <SegmentItem label="Мобильные устройства" count="45%" color="indigo" />
                <SegmentItem label="Прямые заходы" count="28%" color="emerald" />
                <SegmentItem label="Новые посетители" count="12%" color="amber" />
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-[40px] p-8 border border-indigo-100">
            <div className="flex items-center gap-3 mb-4 text-indigo-600">
              <Sparkles className="w-6 h-6" />
              <h4 className="font-bold">AI Suggestion</h4>
            </div>
            <p className="text-indigo-900/60 text-xs font-medium leading-relaxed mb-6">
              Мы заметили, что пользователи из Германии чаще просматривают блок с гарантией. Рекомендуем создать правило персонализации для региона "DE".
            </p>
            <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-bold text-xs shadow-sm hover:shadow-md transition-all">
              Применить рекомендацию
            </button>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[270] flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-2xl overflow-hidden">
            <h4 className="text-2xl font-black mb-8">Новое правило</h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Если посетитель...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center gap-3 text-indigo-600">
                    <Globe className="w-5 h-5" /> <span className="font-bold text-xs">Из страны/города</span>
                  </button>
                  <button className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 text-slate-400 hover:bg-indigo-50 transition-colors">
                    <Smartphone className="w-5 h-5" /> <span className="font-bold text-xs">С мобильного</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">...тогда изменить блок</label>
                <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600">
                  <option>Hero Section (Заголовок)</option>
                  <option>Pricing (Скрыть скидки)</option>
                  <option>Testimonials (Только локальные)</option>
                </select>
              </div>
              <div className="pt-6 flex gap-4">
                <button 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-indigo-600 text-white py-5 rounded-3xl font-bold shadow-xl hover:bg-indigo-700 transition-all"
                >
                  Активировать правило
                </button>
                <button onClick={() => setShowAdd(false)} className="px-8 text-slate-400 font-bold">Отмена</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const SegmentItem = ({ label, count, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase">
      <span className="text-slate-400">{label}</span>
      <span className={`text-${color}-400`}>{count}</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full bg-${color}-500 w-[${count}]`} />
    </div>
  </div>
);

