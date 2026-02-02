import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Image as ImageIcon, Download, RefreshCw, X, Check } from 'lucide-react';

interface BrandPanelProps {
  brandName: string;
  assets: {
    logo?: string;
    palette?: string[];
    fonts?: string[];
  };
  onClose: () => void;
  onUpdate: (newAssets: any) => void;
}

export const BrandPanel: React.FC<BrandPanelProps> = ({ brandName, assets, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'logo'>('colors');

  const handleColorChange = (index: number, color: string) => {
    const newPalette = [...(assets.palette || [])];
    newPalette[index] = color;
    onUpdate({ palette: newPalette });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100"
    >
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Бренд-кит</h2>
          <p className="text-slate-500 text-sm font-medium">{brandName}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <div className="flex border-b border-slate-50">
        {[
          { id: 'colors', icon: <Palette className="w-4 h-4" />, label: 'Цвета' },
          { id: 'fonts', icon: <Type className="w-4 h-4" />, label: 'Шрифты' },
          { id: 'logo', icon: <ImageIcon className="w-4 h-4" />, label: 'Логотип' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Основная палитра</h3>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                <RefreshCw className="w-3 h-3" /> Регенерировать
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {assets.palette?.map((color, i) => (
                <div key={i} className="space-y-2">
                  <div 
                    className="h-20 rounded-2xl shadow-inner border border-slate-100 relative group cursor-pointer"
                    style={{ backgroundColor: color }}
                  >
                    <input 
                      type="color" 
                      value={color}
                      onChange={(e) => handleColorChange(i, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 p-1.5 rounded-lg shadow-sm">
                        <Check className="w-4 h-4 text-slate-800" />
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 text-center uppercase">{color}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fonts' && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-800">Типографика</h3>
            {assets.fonts?.map((font, i) => (
              <div key={i} className="p-6 rounded-2xl border-2 border-slate-50 hover:border-blue-100 transition-all cursor-pointer group">
                <div className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">
                  {i === 0 ? 'Заголовок' : 'Основной текст'}
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: font }}>{font}</div>
                <div className="text-slate-400 text-sm">The quick brown fox jumps over the lazy dog</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Ваш логотип</h3>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                <Download className="w-3 h-3" /> Скачать SVG
              </button>
            </div>
            <div className="aspect-square bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex items-center justify-center p-12 group hover:border-blue-200 transition-all cursor-pointer overflow-hidden">
              {assets.logo ? (
                <img src={assets.logo} alt="Logo" className="max-w-full max-h-full group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="text-slate-300 font-bold">Нет логотипа</div>
              )}
            </div>
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              <RefreshCw className="w-4 h-4" /> Сгенерировать новый вариант
            </button>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-50 bg-slate-50/30">
        <button 
          onClick={onClose}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          Применить изменения
        </button>
      </div>
    </motion.div>
  );
};

