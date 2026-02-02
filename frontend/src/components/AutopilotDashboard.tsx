import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Settings, Shield, Activity, 
  BarChart3, RefreshCw, CheckCircle2, AlertCircle,
  Play, Pause, TrendingUp, Sparkles, Brain,
  FileText, ShoppingBag, Wand2, ArrowRight,
  Plus, Check
} from 'lucide-react';
import { api } from '../services/api';

export const AutopilotDashboard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [isActive, setIsActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'bulk-content' | 'copywriter'>('status');

  // Bulk Content State
  const [niche, setNiche] = useState('Sustainable Tech');
  const [postCount, setPostCount] = useState(5);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);

  // Product Copy State
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [generatedCopy, setGeneratedCopy] = useState('');

  const [recentActions, setRecentActions] = useState([
    { id: '1', action: 'CRO optimization', detail: 'Button CTA changed to "Start Now"', date: '2 hours ago' },
    { id: '2', action: 'Performance Boost', detail: 'Images optimized for faster loading', date: 'Yesterday' }
  ]);

  const handleBulkGenerate = async () => {
    setIsGenerating(true);
    try {
      const posts = await api.bulkGeneratePosts(projectId, niche, postCount);
      setGeneratedPosts(posts);
      setRecentActions([{ id: Date.now().toString(), action: 'Mass Content', detail: `Generated ${posts.length} articles`, date: 'Just now' }, ...recentActions]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCopy = async () => {
    setIsGenerating(true);
    try {
      const copy = await api.generateProductCopy(productName, features.split(',').map(f => f.trim()));
      setGeneratedCopy(copy);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-2 pb-20">
      <div className="flex items-center justify-between bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Brain className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Autonomous Business Logic</span>
          </div>
          <h2 className="text-4xl font-black max-w-lg leading-tight">AI Autopilot Studio</h2>
          <div className="flex bg-white/10 p-1.5 rounded-2xl w-fit">
            <button onClick={() => setActiveTab('status')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'status' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}>Status</button>
            <button onClick={() => setActiveTab('bulk-content')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'bulk-content' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}>Bulk Writer</button>
            <button onClick={() => setActiveTab('copywriter')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'copywriter' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}>Copy Pro</button>
          </div>
        </div>

        <div className="relative z-10">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-4 rounded-[24px] font-black text-sm transition-all flex items-center gap-3 ${
              isActive ? 'bg-rose-500 text-white shadow-xl shadow-rose-900/20' : 'bg-blue-600 text-white shadow-xl shadow-blue-900/20 hover:scale-105'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive ? 'Stop Autopilot' : 'Resume Autopilot'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'status' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-8 flex items-center gap-2"><Settings className="w-5 h-5 text-indigo-600" /> Strategic Configuration</h4>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Goal</label>
                      <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold">
                        <option>Maximize Conversion</option>
                        <option>Engagement Focus</option>
                        <option>Retention Loop</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intensity</label>
                      <div className="flex bg-slate-50 p-1 rounded-2xl">
                        {['Conservative', 'Aggressive'].map(i => (
                          <button key={i} className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${i === 'Aggressive' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>{i}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100 flex flex-col justify-center text-center">
                    <Sparkles className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
                    <p className="text-xs text-indigo-800 font-bold leading-relaxed">AI predicts +18% growth under aggressive mode within 14 days.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-8 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-500" /> Autonomous Activity Log</h4>
                <div className="space-y-4">
                  {recentActions.map(action => (
                    <div key={action.id} className="flex items-center justify-between p-5 rounded-[24px] bg-slate-50 border border-slate-100/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600"><Zap className="w-5 h-5" /></div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{action.action}</div>
                          <div className="text-xs text-slate-500 font-medium">{action.detail}</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{action.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-blue-600 rounded-[40px] p-8 text-white shadow-xl shadow-blue-100">
                <TrendingUp className="w-10 h-10 mb-6" />
                <div className="text-4xl font-black mb-2">+12.4%</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-6">Avg Conversion Uplift</div>
                <div className="pt-6 border-t border-white/20">
                  <div className="flex justify-between items-center text-xs font-bold"><span>Tests Completed</span><span>152</span></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <h4 className="font-black text-slate-900">Safety Shields</h4>
                <div className="space-y-4">
                  <div className="flex gap-3"><Shield className="w-5 h-5 text-indigo-600" /><p className="text-[10px] text-slate-500 font-medium leading-relaxed">No price changes without human approval.</p></div>
                  <div className="flex gap-3"><RefreshCw className="w-5 h-5 text-emerald-500" /><p className="text-[10px] text-slate-500 font-medium leading-relaxed">One-click rollback for all AI design edits.</p></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bulk-content' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><FileText className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Bulk Article Writer</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Generate SEO content at scale</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Content Niche/Topic</label>
                  <input value={niche} onChange={e => setNiche(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-amber-500/20" placeholder="e.g. Vegan Nutrition" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Articles Count</label>
                  <div className="flex bg-slate-50 p-2 rounded-2xl">
                    {[3, 5, 10].map(c => (
                      <button key={c} onClick={() => setPostCount(c)} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${postCount === c ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{c} Posts</button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleBulkGenerate} 
                  disabled={isGenerating}
                  className="w-full py-5 bg-amber-500 text-white rounded-3xl font-black shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isGenerating ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                  Generate Articles Now
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Generated Preview</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {generatedPosts.map((post, i) => (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex gap-4 group hover:border-amber-200 transition-all">
                    <img src={post.imageUrl} className="w-16 h-16 rounded-xl object-cover" alt="" />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-black text-slate-900 text-sm">{post.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  </motion.div>
                ))}
                {generatedPosts.length === 0 && !isGenerating && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-20 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200">
                    <FileText className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No articles generated yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'copywriter' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl mx-auto bg-white rounded-[48px] p-12 border border-slate-100 shadow-sm space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><ShoppingBag className="w-6 h-6" /></div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Product Description Pro</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sales-driven product copy</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Product Name</label>
                <input value={productName} onChange={e => setProductName(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-blue-500/20" placeholder="e.g. Wireless Noise-Cancelling Headphones" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Key Features (comma separated)</label>
                <textarea value={features} onChange={e => setFeatures(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-blue-500/20 h-24 resize-none" placeholder="e.g. 40h battery, High fidelity, Comfortable" />
              </div>
              
              <button 
                onClick={handleGenerateCopy} 
                disabled={isGenerating || !productName}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                {isGenerating ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                Generate Sales Copy
              </button>
            </div>

            {generatedCopy && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 bg-blue-50 rounded-3xl border border-blue-100 relative space-y-4">
                <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Generated Output:</h5>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{generatedCopy}</p>
                <button onClick={() => { navigator.clipboard.writeText(generatedCopy); alert('Copied!'); }} className="absolute top-6 right-6 p-2 bg-white rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all"><CopyIcon className="w-4 h-4" /></button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
);
