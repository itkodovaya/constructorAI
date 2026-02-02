import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, Sparkles, RefreshCw, 
  Download, Palette, Type, Layout, Check,
  X, Grid, Wand2, Layers
} from 'lucide-react';
import { api } from '../services/api';

export const AIVisualEvolution: React.FC<{ brandName: string }> = ({ brandName }) => {
  const [activeTab, setActiveTab] = useState<'images' | 'logo' | 'assets'>('images');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [variants, setVariants] = useState<string[]>([]);
  const [personality, setPersonality] = useState('minimalist and tech-focused');
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
  
  // Assets State
  const [vibe, setVibe] = useState('geometric patterns');
  const [iconPrompt, setIconPrompt] = useState('rocket ship');
  const [generatedSVG, setGeneratedSVG] = useState<string | null>(null);
  const [generatedIcon, setGeneratedIcon] = useState<string | null>(null);

  const handleGenerateVariants = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const data = await api.generateImageVariants(prompt);
      setVariants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateLogo = async () => {
    setIsGenerating(true);
    try {
      const url = await api.generateLogo(brandName, personality);
      setGeneratedLogo(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="flex border-b border-slate-50">
        <button onClick={() => setActiveTab('images')} className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'images' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Image Variants</button>
        <button onClick={() => setActiveTab('logo')} className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'logo' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Logo Designer</button>
        <button onClick={() => setActiveTab('assets')} className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'assets' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Asset Factory</button>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        {activeTab === 'images' && (
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><ImageIcon className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Visual Variant Engine</h3>
                <p className="text-xs text-slate-400 font-medium">Generate 4 artistic variations of any image prompt.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <input 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe image variation (e.g. 'Cyberpunk city with blue neon')" 
                className="flex-1 p-5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-blue-500/20" 
              />
              <button 
                onClick={handleGenerateVariants}
                disabled={isGenerating || !prompt}
                className="px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Evolve
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {variants.map((v, i) => (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={i} className="group relative aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
                  <img src={v} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="p-3 bg-white text-blue-600 rounded-xl hover:scale-110 transition-all"><Download className="w-5 h-5" /></button>
                    <button className="p-3 bg-blue-600 text-white rounded-xl hover:scale-110 transition-all"><Check className="w-5 h-5" /></button>
                  </div>
                </motion.div>
              ))}
              {variants.length === 0 && !isGenerating && (
                <div className="col-span-2 py-20 text-center border-2 border-dashed border-slate-100 rounded-[48px]">
                  <Grid className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest leading-relaxed">Enter a prompt to see visual evolutions.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="space-y-10 max-w-xl mx-auto text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-[32px] flex items-center justify-center text-indigo-600 mx-auto"><Palette className="w-10 h-10" /></div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Neural Logo Lab</h3>
              <p className="text-slate-400 text-sm mt-2">Generate high-res logos based on your brand's personality.</p>
            </div>

            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Brand Name</label>
                <input readOnly value={brandName} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-slate-400 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Brand Personality</label>
                <input value={personality} onChange={e => setPersonality(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="e.g. Friendly, Modern, Trustworthy" />
              </div>
              <button 
                onClick={handleGenerateLogo}
                disabled={isGenerating}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                Generate Identity
              </button>
            </div>

            {generatedLogo && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-slate-50 rounded-[48px] border border-slate-100 inline-block relative group">
                <img src={generatedLogo} className="w-48 h-48 object-contain" alt="Logo Preview" />
                <button className="absolute top-4 right-4 p-3 bg-white shadow-xl rounded-xl text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"><Download className="w-5 h-5" /></button>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="grid grid-cols-2 gap-10">
            {/* SVG Pattern Gen */}
            <div className="space-y-6 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Layers className="w-5 h-5" /></div>
                <h4 className="font-black text-slate-900">SVG Pattern Gen</h4>
              </div>
              <div className="space-y-4">
                <input value={vibe} onChange={e => setVibe(e.target.value)} className="w-full p-4 bg-white border-none rounded-xl text-xs font-bold" placeholder="Pattern vibe (e.g. dots, mesh)" />
                <button 
                  onClick={async () => {
                    setIsGenerating(true);
                    try {
                      const svg = await api.generateSVGPattern(vibe);
                      setGeneratedSVG(svg);
                    } catch (err) { console.error(err); } finally { setIsGenerating(false); }
                  }}
                  disabled={isGenerating}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Synthesize Pattern
                </button>
              </div>
              {generatedSVG && (
                <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-100 aspect-video flex items-center justify-center overflow-hidden">
                  <div dangerouslySetInnerHTML={{ __html: generatedSVG }} className="w-full h-full" />
                </div>
              )}
            </div>

            {/* Icon Synthesizer */}
            <div className="space-y-6 p-8 bg-indigo-50 rounded-[32px] border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><Wand2 className="w-5 h-5" /></div>
                <h4 className="font-black text-slate-900">Icon Synthesizer</h4>
              </div>
              <div className="space-y-4">
                <input value={iconPrompt} onChange={e => setIconPrompt(e.target.value)} className="w-full p-4 bg-white border-none rounded-xl text-xs font-bold" placeholder="Icon for (e.g. checkmark, cloud)" />
                <button 
                  onClick={async () => {
                    setIsGenerating(true);
                    try {
                      const svg = await api.generateCustomIcon(iconPrompt);
                      setGeneratedIcon(svg);
                    } catch (err) { console.error(err); } finally { setIsGenerating(false); }
                  }}
                  disabled={isGenerating}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Generate Icon
                </button>
              </div>
              {generatedIcon && (
                <div className="mt-4 p-4 bg-white rounded-2xl border border-indigo-100 aspect-square w-24 mx-auto flex items-center justify-center">
                  <div dangerouslySetInnerHTML={{ __html: generatedIcon }} className="w-full h-full text-indigo-600" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

