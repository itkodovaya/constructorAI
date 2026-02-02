import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  FileText, 
  MoreVertical, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  Plus, 
  Grid, 
  List,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';

export const AssetLibrary: React.FC<{ assets: any }> = ({ assets }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'images' | 'logos' | 'docs'>('all');

  const items = [
    { id: '1', name: 'Main Logo White.svg', type: 'logos', size: '42 KB', date: 'Сегодня', icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" /> },
    { id: '2', name: 'Brand Background.jpg', type: 'images', size: '2.4 MB', date: 'Вчера', icon: <ImageIcon className="w-3 h-3 text-blue-500" /> },
    { id: '3', name: 'Brand Guide.pdf', type: 'docs', size: '1.2 MB', date: '2 дня назад', icon: <FileText className="w-3 h-3 text-orange-500" /> },
    { id: '4', name: 'Icon Pack.zip', type: 'docs', size: '8.5 MB', date: '5 дней назад', icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" /> },
  ];

  const filteredItems = items.filter(i => filter === 'all' || i.type === filter);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-4 bg-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all shrink-0 ${filter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Все
          </button>
          <button 
            onClick={() => setFilter('logos')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all shrink-0 ${filter === 'logos' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Логотипы
          </button>
          <button 
            onClick={() => setFilter('images')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all shrink-0 ${filter === 'images' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Изображения
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><List className="w-4 h-4" /></button>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
            <UploadCloud className="w-5 h-5" /> Загрузить
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            {filteredItems.map(item => (
              <div key={item.id} className="group bg-white rounded-[24px] sm:rounded-[32px] border border-slate-100 p-3 sm:p-4 hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="aspect-square bg-slate-50 rounded-[16px] sm:rounded-[24px] mb-3 sm:mb-4 flex items-center justify-center relative overflow-hidden">
                  {item.type === 'logos' ? (
                    <img src={assets.logo} alt="Preview" className="w-20 h-20 object-contain group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="text-slate-200"><ImageIcon className="w-12 h-12" /></div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="p-3 bg-white rounded-full text-slate-900 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-800 truncate pr-4">{item.name}</h4>
                    <MoreVertical className="w-4 h-4 text-slate-300 cursor-pointer hover:text-slate-600" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {item.icon} {item.size}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-white rounded-[24px] sm:rounded-[32px] border border-slate-100 overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-50">
                <tr>
                  <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Имя файла</th>
                  <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Тип</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Размер</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Дата</th>
                  <th className="px-8 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredItems.map(item => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">{item.icon}</div>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </td>
                    <td className="px-8 py-4 text-xs font-bold text-slate-400 uppercase">{item.type}</td>
                    <td className="px-8 py-4 text-xs font-bold text-slate-500">{item.size}</td>
                    <td className="px-8 py-4 text-xs font-medium text-slate-400">{item.date}</td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Download className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

