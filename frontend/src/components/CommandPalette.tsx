import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Layout, Palette, Share2, Download, Zap, X, Globe, Smartphone } from 'lucide-react';

interface CommandPaletteProps {
  onClose: () => void;
  actions: {
    label: string;
    icon: React.ReactNode;
    shortcut?: string;
    onClick: () => void;
    category: string;
  }[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose, actions }) => {
  const [search, setSearch] = useState('');

  const filteredActions = actions.filter(a => 
    a.label.toLowerCase().includes(search.toLowerCase()) || 
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleDown);
    return () => window.removeEventListener('keydown', handleDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden"
      >
        <div className="relative p-6 border-b border-slate-50">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
          <input 
            autoFocus
            type="text" 
            placeholder="Что вы хотите сделать? (Например: Экспорт или Сайт)"
            className="w-full pl-12 pr-4 py-2 text-xl font-medium text-slate-800 outline-none placeholder:text-slate-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black text-slate-400">
            ESC
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 space-y-6">
          {filteredActions.length > 0 ? (
            <div className="space-y-2">
              {filteredActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => { action.onClick(); onClose(); }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all text-slate-400 group-hover:text-blue-600">
                      {action.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-slate-700">{action.label}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{action.category}</div>
                    </div>
                  </div>
                  {action.shortcut && (
                    <div className="text-[10px] font-black text-slate-300 bg-slate-50 px-2 py-1 rounded-md">
                      {action.shortcut}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 font-medium">
              Ничего не найдено для "{search}"
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
            <span className="flex items-center gap-1"><Command className="w-3 h-3" /> Перемещение</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Выбор</span>
          </div>
          <div className="text-[10px] font-bold text-blue-600">Constructor AI v1.0</div>
        </div>
      </motion.div>
    </div>
  );
};
