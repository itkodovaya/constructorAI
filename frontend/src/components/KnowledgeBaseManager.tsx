import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, FileText, Plus, Search, Trash2, 
  Upload, Brain, ChevronRight, X, Check,
  Info, Database, Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

export const KnowledgeBaseManager: React.FC<{ organizationId: string }> = ({ organizationId }) => {
  const [kbs, setKbs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKb, setActiveKb] = useState<any>(null);
  const [showAddKb, setShowAddKb] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);
  
  const [newKb, setNewKb] = useState({ name: '', description: '' });
  const [newDoc, setNewDoc] = useState({ name: '', content: '', type: 'txt' });

  const fetchKBs = async () => {
    setLoading(true);
    try {
      const data = await api.getKnowledgeBases(organizationId);
      setKbs(data || []);
      if (data && data.length > 0 && !activeKb) setActiveKb(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKBs();
  }, [organizationId]);

  const handleCreateKb = async () => {
    if (!newKb.name) return;
    try {
      const kb = await api.createKnowledgeBase(organizationId, newKb.name, newKb.description);
      setKbs([...kbs, kb]);
      setActiveKb(kb);
      setShowAddKb(false);
      setNewKb({ name: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDoc = async () => {
    if (!newDoc.name || !newDoc.content || !activeKb) return;
    try {
      await api.addDocument(activeKb.id, newDoc.name, newDoc.type, newDoc.content);
      setShowAddDoc(false);
      setNewDoc({ name: '', content: '', type: 'txt' });
      fetchKBs(); // Refresh to see new doc
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingState message="Загрузка базы знаний..." />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[400px] lg:h-[600px] bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
      {/* Sidebar: Knowledge Bases */}
      <aside className="w-full lg:w-72 border-r-0 lg:border-r border-b lg:border-b-0 border-slate-50 flex flex-col bg-slate-50/30">
        <div className="p-4 sm:p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Brain Hub</h3>
          <button onClick={() => setShowAddKb(true)} className="p-1.5 sm:p-2 hover:bg-white rounded-lg sm:rounded-xl text-blue-600 transition-all">
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {kbs.map(kb => (
            <button 
              key={kb.id} 
              onClick={() => setActiveKb(kb)}
              className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all ${activeKb?.id === kb.id ? 'bg-white shadow-md text-blue-600 font-black' : 'text-slate-400 font-bold hover:bg-white/50'}`}
            >
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate text-xs sm:text-sm">{kb.name}</span>
            </button>
          ))}
          {kbs.length === 0 && !loading && (
            <EmptyState
              iconType="database"
              title="Нет базы знаний"
              description="Создайте базу знаний для обучения AI."
              action={{
                label: "Создать базу знаний",
                onClick: () => setShowAddKb(true),
                variant: 'primary'
              }}
            />
          )}
        </div>
      </aside>

      {/* Main: Documents */}
      <main className="flex-1 flex flex-col">
        {activeKb ? (
          <>
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">{activeKb.name}</h2>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{activeKb.description || 'Global knowledge for AI generation'}</p>
              </div>
              <button 
                onClick={() => setShowAddDoc(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Add Document
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/20">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {activeKb.documents?.map((doc: any) => (
                  <div key={doc.id} className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base text-slate-900 truncate">{doc.name}</div>
                      <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {doc.type} • {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shrink-0">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="text-[9px] sm:text-[10px] font-black uppercase">Indexed</span>
                    </div>
                  </div>
                ))}
                {(!activeKb.documents || activeKb.documents.length === 0) && (
                  <EmptyState
                    iconType="file"
                    title="Нет документов"
                    description="Загрузите руководство по бренду, исследования ниши или текстовые данные для обучения AI."
                    action={{
                      label: "Добавить документ",
                      onClick: () => setShowAddDoc(true),
                      variant: 'primary'
                    }}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <EmptyState
              iconType="database"
              title="Выберите базу знаний"
              description="Выберите существующую базу знаний или создайте новую для начала работы."
              action={{
                label: "Создать базу знаний",
                onClick: () => setShowAddKb(true),
                variant: 'primary'
              }}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showAddKb && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] shadow-2xl p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">New Knowledge Base</h3>
                <button onClick={() => setShowAddKb(false)} className="p-1.5 sm:p-2 hover:bg-slate-50 rounded-lg sm:rounded-xl"><X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" /></button>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <input value={newKb.name} onChange={e => setNewKb({...newKb, name: e.target.value})} className="w-full p-4 sm:p-5 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm" placeholder="KB Name (e.g. Brand Guidelines)" />
                <textarea value={newKb.description} onChange={e => setNewKb({...newKb, description: e.target.value})} className="w-full p-4 sm:p-5 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm h-24 sm:h-32 resize-none" placeholder="What is this knowledge base for?" />
                <button onClick={handleCreateKb} className="w-full py-4 sm:py-5 bg-blue-600 text-white rounded-2xl sm:rounded-3xl font-black text-xs sm:text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Create Hub</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showAddDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] shadow-2xl p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">Upload Knowledge</h3>
                <button onClick={() => setShowAddDoc(false)} className="p-1.5 sm:p-2 hover:bg-slate-50 rounded-lg sm:rounded-xl"><X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" /></button>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} className="w-full p-4 sm:p-5 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm" placeholder="Document Name" />
                  <select value={newDoc.type} onChange={e => setNewDoc({...newDoc, type: e.target.value})} className="w-full p-4 sm:p-5 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm">
                    <option value="txt">Text File</option>
                    <option value="md">Markdown</option>
                  </select>
                </div>
                <textarea value={newDoc.content} onChange={e => setNewDoc({...newDoc, content: e.target.value})} className="w-full p-4 sm:p-5 bg-slate-50 border-none rounded-xl sm:rounded-2xl font-mono text-[10px] sm:text-xs h-48 sm:h-64 resize-none" placeholder="Paste document content here..." />
                <button onClick={handleAddDoc} className="w-full py-4 sm:py-5 bg-slate-900 text-white rounded-2xl sm:rounded-3xl font-black text-xs sm:text-sm shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 sm:gap-3">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /> Start Indexing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

