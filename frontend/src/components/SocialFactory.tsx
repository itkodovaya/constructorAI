import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Instagram, MessageCircle, Share2, Sparkles, 
  Download, Copy, Check, Image as ImageIcon, 
  Type, Palette, Layout, Hash
} from 'lucide-react';
import { api } from '../services/api';

export const SocialFactory: React.FC<{ 
  projectId: string;
  brandName: string;
  brandAssets: any;
  onClose: () => void;
}> = ({ projectId, brandName, brandAssets, onClose }) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'captions'>('banners');
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [bannerType, setBannerType] = useState<'sale' | 'new' | 'welcome'>('sale');

  const colors = brandAssets.palette || ['#2563eb', '#1e40af', '#ffffff', '#f8fafc'];
  const font = brandAssets.fonts?.[0] || 'Inter';

  const handleGenerateCaptions = async () => {
    setIsGenerating(true);
    try {
      // Use existing AI service to generate captions based on brand and niche
      // For now we'll simulate with relevant text
      setTimeout(() => {
        setCaptions([
          `🚀 Excited to announce our new project for ${brandName}! Check it out now. #innovation #brand`,
          `✨ Quality meets design. See what's cooking at ${brandName}. #design #excellence`,
          `🔥 Limited time offer! Don't miss out on what ${brandName} has to offer today. #sale #offer`,
          `💡 Transforming ideas into reality with ${brandName}. Your journey starts here. #startup #vision`,
          `🌟 We believe in making a difference. Join the ${brandName} community. #impact #community`
        ]);
        setIsGenerating(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shadow-sm">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Social Factory</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Marketing Assets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-50 p-6 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('banners')} 
              className={`w-full p-4 rounded-[24px] flex items-center gap-3 transition-all ${activeTab === 'banners' ? 'bg-pink-50 text-pink-600 font-black' : 'text-slate-400 font-bold hover:bg-slate-50'}`}
            >
              <Layout className="w-5 h-5" /> Banner Gen
            </button>
            <button 
              onClick={() => setActiveTab('captions')} 
              className={`w-full p-4 rounded-[24px] flex items-center gap-3 transition-all ${activeTab === 'captions' ? 'bg-pink-50 text-pink-600 font-black' : 'text-slate-400 font-bold hover:bg-slate-50'}`}
            >
              <Hash className="w-5 h-5" /> AI Captions
            </button>
          </aside>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
            {activeTab === 'banners' ? (
              <div className="space-y-10">
                <div className="grid grid-cols-3 gap-4">
                  {(['sale', 'new', 'welcome'] as const).map(type => (
                    <button 
                      key={type} 
                      onClick={() => setBannerType(type)}
                      className={`p-4 rounded-2xl border-2 transition-all capitalize font-black text-sm ${bannerType === type ? 'border-pink-500 bg-white text-pink-600 shadow-xl shadow-pink-100' : 'border-slate-100 bg-white text-slate-400 hover:border-pink-200'}`}
                    >
                      {type} Post
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <div className="w-[400px] aspect-square rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col items-center justify-center p-12 text-center" style={{ backgroundColor: colors[0], fontFamily: font }}>
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${colors[2]} 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                    <div className="relative z-10 space-y-6">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl border border-white/30">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                      <h3 className="text-4xl font-black text-white leading-tight uppercase tracking-tighter italic">
                        {bannerType === 'sale' ? 'Flash Sale' : bannerType === 'new' ? 'New Arrival' : 'Welcome'}
                      </h3>
                      <div className="h-1 w-20 bg-white/50 mx-auto rounded-full" />
                      <p className="text-white/90 text-xl font-bold">{brandName}</p>
                      <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase shadow-xl hover:scale-105 transition-all">Check it out</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all shadow-xl">
                    <Download className="w-4 h-4" /> Download PNG
                  </button>
                  <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all shadow-sm">
                    <Share2 className="w-4 h-4" /> Share to VK
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 space-y-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">AI Copywriter</h3>
                      <p className="text-slate-400 text-xs font-bold">Generate social media posts instantly</p>
                    </div>
                    <button 
                      onClick={handleGenerateCaptions} 
                      disabled={isGenerating}
                      className="px-6 py-3 bg-pink-500 text-white rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-pink-600 transition-all shadow-lg shadow-pink-100"
                    >
                      {isGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {captions.length > 0 ? 'Regenerate' : 'Generate'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {captions.map((caption, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="group bg-white p-6 rounded-[32px] border border-slate-100 hover:border-pink-200 transition-all shadow-sm flex flex-col gap-4"
                    >
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">{caption}</p>
                      <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => copyToClipboard(caption, i)} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-400 transition-all">
                          {copiedIndex === i ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Text</>}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {!isGenerating && captions.length === 0 && (
                    <div className="py-20 text-center text-slate-300">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="font-bold">No captions generated yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </motion.div>
  );
};

