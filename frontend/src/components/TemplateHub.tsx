import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Bookmark, Plus, Trash2, Layout, 
  Copy, Check, Sparkles, Box, FileText,
  ChevronRight, Search, Filter
} from 'lucide-react';
import { api } from '../services/api';

export const TemplateHub: React.FC<{ 
  projectId: string;
  onSelect: (content: any, type: 'block' | 'page') => void;
  onClose: () => void;
}> = ({ projectId, onSelect, onClose }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveTab] = useState<'block' | 'page'>('block');
  const [search, setSearch] = useState('');

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await api.getTemplates(projectId);
      setTemplates(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [projectId]);

  const filtered = templates.filter(t => 
    t.type === activeType && 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Template Hub</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Reusable Snapshots</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search designs..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 ring-indigo-500/20" 
              />
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-50 p-6 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('block')} 
              className={`w-full p-4 rounded-[24px] flex items-center gap-3 transition-all ${activeType === 'block' ? 'bg-indigo-50 text-indigo-600 font-black' : 'text-slate-400 font-bold hover:bg-slate-50'}`}
            >
              <Box className="w-5 h-5" /> Saved Blocks
            </button>
            <button 
              onClick={() => setActiveTab('page')} 
              className={`w-full p-4 rounded-[24px] flex items-center gap-3 transition-all ${activeType === 'page' ? 'bg-indigo-50 text-indigo-600 font-black' : 'text-slate-400 font-bold hover:bg-slate-50'}`}
            >
              <Layout className="w-5 h-5" /> Page Snapshots
            </button>
          </aside>

          {/* Main Grid */}
          <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold">Scanning hub...</div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {filtered.map((t) => (
                  <motion.div 
                    key={t.id}
                    layoutId={t.id}
                    className="group bg-white rounded-[32px] border border-slate-100 p-6 space-y-4 hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer relative"
                    onClick={() => onSelect(JSON.parse(t.content), t.type)}
                  >
                    <div className="aspect-[16/10] bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 relative group-hover:scale-[1.02] transition-transform">
                      {t.preview ? (
                        <img src={t.preview} className="w-full h-full object-cover" />
                      ) : (
                        <Sparkles className="w-12 h-12 text-slate-200" />
                      )}
                      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{t.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.category || 'Custom'}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete template?')) api.deleteTemplate(t.id).then(fetchTemplates);
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-300">
                  {activeType === 'block' ? <Box className="w-10 h-10" /> : <Layout className="w-10 h-10" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">No {activeType}s saved</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Save your best designs as templates to reuse them across your projects.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </motion.div>
  );
};

