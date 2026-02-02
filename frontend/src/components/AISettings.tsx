import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Zap, Shield, Settings, 
  CheckCircle2, AlertCircle, Info,
  Layers, Palette, Type, Sliders
} from 'lucide-react';

export const AISettings: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<any>('openai');
  const [models, setModels] = useState({
    text: 'gpt-4-turbo',
    image: 'dalle-3'
  });

  const providers = [
    { id: 'openai', name: 'OpenAI', icon: <Zap className="w-4 h-4" />, status: 'active', desc: 'Лучшее понимание контекста' },
    { id: 'anthropic', name: 'Anthropic', icon: <Shield className="w-4 h-4" />, status: 'active', desc: 'Безопасность и большие тексты' },
    { id: 'stability', name: 'Stability AI', icon: <Palette className="w-4 h-4" />, status: 'active', desc: 'Профессиональные изображения' },
    { id: 'cohere', name: 'Cohere', icon: <Type className="w-4 h-4" />, status: 'beta', desc: 'Оптимизировано для бизнеса' }
  ];

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">AI Конфигурация</h3>
          <p className="text-slate-500 text-sm font-medium">Настройте модели для генерации контента</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button className="px-4 py-1.5 rounded-xl text-xs font-black bg-white text-slate-900 shadow-sm">Cloud AI</button>
          <button className="px-4 py-1.5 rounded-xl text-xs font-black text-slate-400 hover:text-slate-600">Local Edge (Soon)</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Выбор провайдера */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Основные провайдеры</h4>
          <div className="space-y-2">
            {providers.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProvider(p.id)}
                className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all ${
                  selectedProvider === p.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-lg shadow-indigo-50' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedProvider === p.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                    {p.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{p.desc}</div>
                  </div>
                </div>
                {p.status === 'beta' && <span className="text-[8px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full uppercase">Beta</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Настройки моделей */}
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm h-fit">
          <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" /> Настройки {selectedProvider.toUpperCase()}
          </h4>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Текстовая модель</label>
              <select 
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600"
                value={models.text}
                onChange={e => setModels({...models, text: e.target.value})}
              >
                <option value="gpt-4-turbo">GPT-4 Turbo (Balanced)</option>
                <option value="gpt-4o">GPT-4o (Fastest)</option>
                <option value="claude-3-opus">Claude 3 Opus (Creative)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Генератор изображений</label>
              <select 
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-600"
                value={models.image}
                onChange={e => setModels({...models, image: e.target.value})}
              >
                <option value="dalle-3">DALL-E 3 (Intuitive)</option>
                <option value="sd-xl">Stable Diffusion XL (Realistic)</option>
              </select>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-indigo-600 shrink-0" />
                <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                  Провайдер {selectedProvider} используется для всех автоматических операций генерации страниц и маркетинговых материалов.
                </p>
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

