import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Terminal, Sparkles, Command, 
  ChevronRight, Box, Users, FileText,
  Zap, Shield, Target, Wand2, X
} from 'lucide-react';
import { api } from '../services/api';

export const OmniSearch: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [omniReply, setOmniReply] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length > 2) {
        setIsSearching(true);
        try {
          const data = await api.semanticSearch(projectId, query);
          setResults(data || []);
        } catch (err) { console.error(err); }
        finally { setIsSearching(false); }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, projectId]);

  const handleOmniCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSearching(true);
    try {
      const result = await api.sendOmniCommand(projectId, query);
      setOmniReply(result.message);
      setQuery('');
      setTimeout(() => setOmniReply(null), 5000);
    } catch (err) { console.error(err); }
    finally { setIsSearching(false); }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleOmniCommand} className="relative group">
        <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden px-6 py-4">
          <Command className="w-5 h-5 text-slate-400 mr-4" />
          <input 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search leads, posts, or type a command (e.g. 'Create coupon')" 
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300"
          />
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-50 text-[8px] font-black text-slate-400 rounded border border-slate-100 uppercase">Cmd + K</span>
            </div>
          )}
        </div>
      </form>

      <AnimatePresence>
        {omniReply && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-4 p-6 bg-slate-900 rounded-[24px] text-white shadow-2xl z-50 border border-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-relaxed">{omniReply}</p>
                <div className="mt-3 flex gap-2">
                  <div className="px-3 py-1 bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-blue-400">Command Executed</div>
                </div>
              </div>
              <button onClick={() => setOmniReply(null)} className="p-1 hover:bg-white/10 rounded-lg transition-all"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
          </motion.div>
        )}

        {results.length > 0 && !omniReply && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[32px] border border-slate-100 shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Semantic Results</span>
              <span className="text-[10px] font-black text-blue-600 uppercase">{results.length} found</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {results.map((r, i) => (
                <button 
                  key={i}
                  className="w-full p-4 rounded-2xl flex items-center gap-4 hover:bg-slate-50 transition-all group text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    r.type === 'lead' ? 'bg-blue-50 text-blue-600' :
                    r.type === 'post' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {r.type === 'lead' ? <Users className="w-5 h-5" /> : r.type === 'post' ? <FileText className="w-5 h-5" /> : <Box className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{r.title}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.detail}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-all" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

