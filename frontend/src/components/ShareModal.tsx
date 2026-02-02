import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, X, Mail, Link2, Users, Shield, Globe } from 'lucide-react';
import { api } from '../services/api';

interface ShareModalProps {
  onClose: () => void;
  brandName: string;
  projectId: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose, brandName, projectId }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    generateLink();
  }, []);

  const generateLink = async () => {
    setLoading(true);
    try {
      const data = await api.shareProject(projectId);
      setShareUrl(data.shareUrl);
    } catch (error) {
      console.error('Failed to generate link');
      setShareUrl(`https://constructor.ai/s/${projectId}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative"
      >
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Поделиться проектом</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-300 uppercase tracking-widest">Настройки доступа</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setAccess('view')}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${access === 'view' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 hover:border-slate-100'}`}
              >
                <Globe className={`w-5 h-5 ${access === 'view' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className={`text-sm font-bold ${access === 'view' ? 'text-slate-900' : 'text-slate-500'}`}>Только просмотр</div>
                  <div className="text-[10px] text-slate-400">Публичная ссылка</div>
                </div>
              </button>
              <button 
                onClick={() => setAccess('edit')}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${access === 'edit' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 hover:border-slate-100'}`}
              >
                <Users className={`w-5 h-5 ${access === 'edit' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className={`text-sm font-bold ${access === 'edit' ? 'text-slate-900' : 'text-slate-500'}`}>Редактирование</div>
                  <div className="text-[10px] text-slate-400">Для команды</div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-300 uppercase tracking-widest">Ссылка</label>
            <div className="relative">
              <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 pr-16 truncate">
                {loading ? 'Генерация...' : shareUrl}
              </div>
              <button 
                onClick={copyToClipboard}
                className="absolute right-2 top-2 w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Link2 className="w-5 h-5 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              <Mail className="w-5 h-5" /> Пригласить по почте
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
