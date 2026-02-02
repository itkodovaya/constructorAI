import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Command, FileText, Image as ImageIcon, Layout, ArrowRight, X } from 'lucide-react';
import { api } from '../services/api';

export const GlobalSearch: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // В реальности: const data = await api.semanticSearch(query);
      setTimeout(() => {
        setResults([
          { id: '1', name: 'Минималистичный Hero-блок', type: 'block', score: 0.98 },
          { id: '2', name: 'Фото современной кофейни', type: 'image', score: 0.92 },
          { id: '3', name: 'Цветовая палитра "Утренний латте"', type: 'palette', score: 0.85 }
        ]);
        setLoading(false);
      }, 600);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-start justify-center pt-[15vh] p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: -20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-50 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <Search className="w-5 h-5 text-indigo-600" />
          </div>
          <input 
            ref={inputRef}
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Что вы хотите найти? Например: 'современный блок о нас'"
            className="flex-1 text-lg font-medium border-none focus:ring-0 placeholder:text-slate-300"
          />
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400">ESC</kbd>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-4" />
              <p className="text-slate-400 font-medium">AI ищет совпадения...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Результаты семантического поиска</div>
              {results.map((res) => (
                <button 
                  key={res.id}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50/50 group transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {res.type === 'block' ? <Layout className="w-5 h-5 text-indigo-500" /> : 
                       res.type === 'image' ? <ImageIcon className="w-5 h-5 text-emerald-500" /> : 
                       <Sparkles className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{res.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">Сходство: {(res.score * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          ) : query.length > 2 ? (
            <div className="p-12 text-center text-slate-400 font-medium">Ничего не найдено</div>
          ) : (
            <div className="p-8 space-y-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Попробуйте запросы</div>
              <div className="flex flex-wrap gap-2">
                {['Минимализм', 'Темная тема', 'Корпоративный стиль', 'Яркие кнопки', 'Технологии'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
            <Command className="w-3 h-3" /> + K для быстрого вызова
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Powered by Semantic AI</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

