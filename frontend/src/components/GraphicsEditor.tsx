import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize2, Share2, Download, Image as ImageIcon, 
  Layers, Scissors, Sun, Sparkles, X, ChevronRight,
  Instagram, Facebook, Twitter, Youtube, Calendar,
  Grid, RefreshCw, Wand2, Check, Zap, Package
} from 'lucide-react';

interface GraphicsEditorProps {
  brandName: string;
  assets: any;
  onClose: () => void;
}

const SOCIAL_FORMATS = [
  { id: 'ig-post', name: 'Instagram Пост', width: 1080, height: 1080, icon: <Instagram className="w-4 h-4" />, platform: 'instagram' },
  { id: 'ig-story', name: 'Instagram Stories', width: 1080, height: 1920, icon: <Instagram className="w-4 h-4" />, platform: 'instagram' },
  { id: 'ig-reel', name: 'Instagram Reels', width: 1080, height: 1920, icon: <Instagram className="w-4 h-4" />, platform: 'instagram' },
  { id: 'vk-cover', name: 'VK Обложка', width: 1590, height: 530, icon: <Facebook className="w-4 h-4" />, platform: 'vk' },
  { id: 'vk-post', name: 'VK Пост', width: 1200, height: 800, icon: <Facebook className="w-4 h-4" />, platform: 'vk' },
  { id: 'yt-banner', name: 'YouTube Баннер', width: 2560, height: 1440, icon: <Youtube className="w-4 h-4" />, platform: 'youtube' },
  { id: 'yt-thumb', name: 'YouTube Миниатюра', width: 1280, height: 720, icon: <Youtube className="w-4 h-4" />, platform: 'youtube' },
  { id: 'fb-post', name: 'Facebook Пост', width: 1200, height: 630, icon: <Facebook className="w-4 h-4" />, platform: 'facebook' },
  { id: 'twitter-post', name: 'Twitter Пост', width: 1200, height: 675, icon: <Twitter className="w-4 h-4" />, platform: 'twitter' },
];

export const GraphicsEditor: React.FC<GraphicsEditorProps> = ({ brandName, assets, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState(SOCIAL_FORMATS[0]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasBackground, setHasBackground] = useState(true);
  const [hasShadow, setHasShadow] = useState(false);

  const handleMagicAction = (action: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      if (action === 'remove_bg') setHasBackground(false);
      if (action === 'add_shadow') setHasShadow(true);
      setIsProcessing(false);
    }, 1500);
  };

  const handleBulkProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsBulkMode(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handleExportAll = async () => {
    setIsProcessing(true);
    try {
      // TODO: Реализовать экспорт всех форматов в ZIP
      alert('Экспорт всех форматов будет реализован в следующей версии. Сейчас доступен экспорт по одному формату.');
      setIsProcessing(false);
    } catch (error) {
      console.error('Export failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">AI Graphics Designer Pro</h2>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsBulkMode(!isBulkMode)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-2xl transition-all ${
              isBulkMode ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-5 h-5" /> Пакетный режим
          </button>
          <button 
            onClick={handleExportAll}
            disabled={isProcessing}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            <Package className="w-5 h-5" /> Экспорт все ({SOCIAL_FORMATS.length})
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {!isBulkMode && (
          <aside className="w-80 bg-white border-r border-slate-200 p-8 overflow-y-auto shrink-0 space-y-10">
            <div>
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6">Форматы</h3>
              <div className="grid gap-3">
                {SOCIAL_FORMATS.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                      selectedFormat.id === format.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedFormat.id === format.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {format.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{format.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{format.width}x{format.height}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6">AI Обработка</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleMagicAction('remove_bg')}
                  className="w-full p-4 bg-slate-50 rounded-2xl flex items-center gap-4 hover:bg-blue-50 transition-all group"
                >
                  <Scissors className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold text-slate-700">Удалить фон</span>
                  {!hasBackground && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                </button>
                <button 
                  onClick={() => handleMagicAction('add_shadow')}
                  className="w-full p-4 bg-slate-50 rounded-2xl flex items-center gap-4 hover:bg-blue-50 transition-all group"
                >
                  <Sun className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-bold text-slate-700">Умные тени</span>
                  {hasShadow && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                </button>
                <button 
                  onClick={handleBulkProcess}
                  className="w-full p-4 bg-blue-600 text-white rounded-2xl flex items-center gap-4 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  <Wand2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Magic Adapt All</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Canvas */}
        <main className="flex-1 bg-slate-200/50 p-12 overflow-y-auto">
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-xl font-black text-slate-800 tracking-tight">AI творит магию...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isBulkMode ? (
            <div className="h-full flex items-center justify-center">
              <motion.div 
                layout
                className="bg-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-12"
                style={{ 
                  width: selectedFormat.width / 2, 
                  height: selectedFormat.height / 2,
                  maxHeight: '80vh',
                  maxWidth: '80%',
                  backgroundColor: hasBackground ? (assets.palette?.[0] || '#ffffff') : '#ffffff'
                }}
              >
                {/* Logo with Shadow */}
                <div className={`relative transition-all duration-500 ${hasShadow ? 'drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]' : ''}`}>
                  <img src={assets.logo} alt="Logo" className="w-40 h-40 object-contain" />
                </div>
                
                <h2 className="text-4xl font-black mt-8 text-center" style={{ color: assets.palette?.[1], fontFamily: assets.fonts?.[0] }}>
                  {brandName}
                </h2>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {SOCIAL_FORMATS.map(format => (
                <div key={format.id} className="space-y-4">
                  <div className="bg-white shadow-lg rounded-2xl overflow-hidden aspect-[4/5] flex flex-col items-center justify-center p-4 scale-90 hover:scale-100 transition-transform">
                    <img src={assets.logo} alt="Logo" className="w-20 h-20 object-contain mb-4" />
                    <div className="text-center font-bold text-xs" style={{ color: assets.palette?.[1] }}>{brandName}</div>
                  </div>
                  <div className="text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">{format.name}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
