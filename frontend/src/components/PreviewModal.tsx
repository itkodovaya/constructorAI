import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Maximize2, Minimize2, Download, FileText, Archive } from 'lucide-react';
import { api } from '../services/api';

interface PreviewModalProps {
  projectId: string;
  brandName: string;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ projectId, brandName, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewUrl = api.getPreviewUrl(projectId);

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
          <div className="h-8 w-px bg-slate-200" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Предпросмотр: {brandName}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => api.exportProject(projectId)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Download className="w-4 h-4" /> Скачать HTML
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative">
        <iframe 
          src={previewUrl}
          className="w-full h-full border-none"
          title="Preview"
        />
      </div>
    </div>
  );
};

