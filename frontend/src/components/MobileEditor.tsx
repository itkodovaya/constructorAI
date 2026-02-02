import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Menu, X, Plus, Settings, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileEditorProps {
  blocks: any[];
  onUpdateBlocks: (blocks: any[]) => void;
  onClose: () => void;
}

export const MobileEditor: React.FC<MobileEditorProps> = ({ blocks, onUpdateBlocks, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'add'>('preview');

  return (
    <div className="fixed inset-0 bg-white z-[2000] flex flex-col font-sans md:hidden">
      {/* Mobile Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <Smartphone className="w-4 h-4" />
          </div>
          <h2 className="font-black text-slate-900 uppercase tracking-tight text-sm">Mobile Editor</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-50 rounded-xl text-slate-400">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <AnimatePresence mode="wait">
          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4"
            >
              <div className="w-[375px] mx-auto bg-white shadow-2xl rounded-[40px] border-[8px] border-slate-900 overflow-hidden min-h-[667px]">
                {/* Mock Phone UI */}
                <div className="h-6 bg-slate-900 flex justify-center items-center">
                  <div className="w-20 h-4 bg-slate-800 rounded-full" />
                </div>
                <div className="h-[640px] overflow-y-auto custom-scrollbar">
                  {blocks.map((block, i) => (
                    <div key={block.id} className="border-b border-slate-50 last:border-none">
                      {/* Simplified block preview */}
                      <div className="p-4 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">{block.type}</p>
                        <div className="h-20 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                          Preview of {block.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'edit' && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-4"
            >
              <h3 className="text-xl font-black text-slate-900">Manage Blocks</h3>
              {blocks.map((block, i) => (
                <div key={block.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <Menu className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{block.type}</p>
                      <p className="text-[10px] font-bold text-slate-400">Block #{i + 1}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Settings className="w-4 h-4" /></button>
                    <button className="p-2 text-rose-500 bg-rose-50 rounded-lg"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Navigation */}
      <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-around sticky bottom-0 z-10">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'preview' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Preview</span>
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'edit' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'add' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-100 -mt-8 border-4 border-white">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest mt-1">Add</span>
        </button>
      </div>
    </div>
  );
};
