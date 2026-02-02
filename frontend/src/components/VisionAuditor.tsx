import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, AlertTriangle, CheckCircle, Search, 
  Layout, Smartphone, Monitor, RefreshCw,
  Zap, Shield, Target, MousePointer2,
  TrendingUp, BarChart3, Camera
} from 'lucide-react';
import { api } from '../services/api';

export const VisionAuditor: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [activeView, setActiveTab] = useState<'issues' | 'heatmap'>('issues');

  const runAudit = async () => {
    setIsAnalyzing(true);
    try {
      // In a real app, we'd take a screenshot of the SiteBuilder iframe/container
      const mockImageData = "data:image/png;base64,..."; 
      const result = await api.runVisionAudit(mockImageData);
      setAuditResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Cognitive Vision Auditor</h2>
            <p className="text-xs text-slate-400 font-medium">AI-powered UI/UX & Accessibility analysis</p>
          </div>
        </div>
        <button 
          onClick={runAudit}
          disabled={isAnalyzing}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          Capture & Analyze
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Results Sidebar */}
        <aside className="w-80 border-r border-slate-50 flex flex-col bg-slate-50/30">
          <div className="flex border-b border-slate-50">
            <button onClick={() => setActiveTab('issues')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'issues' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-400'}`}>Issues</button>
            <button onClick={() => setActiveTab('heatmap')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'heatmap' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-400'}`}>Heatmap</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {auditResult ? (
              activeView === 'issues' ? (
                <>
                  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center space-y-2">
                    <div className="text-3xl font-black text-slate-900">{auditResult.score}/100</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Design Health Score</div>
                  </div>
                  <div className="space-y-3">
                    {auditResult.issues.map((issue: any, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2 group hover:border-indigo-200 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${
                            issue.severity === 'high' ? 'bg-rose-50 text-rose-600' : 
                            issue.severity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {issue.severity}
                          </span>
                          <span className="text-[8px] font-black text-slate-300 uppercase">{issue.type}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{issue.message}</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-indigo-600 rounded-3xl text-white space-y-2 shadow-lg shadow-indigo-100">
                    <h4 className="font-black text-sm">Attention Prediction</h4>
                    <p className="text-[10px] text-indigo-100 leading-relaxed">Neural model predicts where 90% of users will focus in the first 3 seconds.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase px-2">
                      <span>Visual Hierarchy</span>
                      <span className="text-emerald-500">Optimized</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[85%]" />
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40">
                <Zap className="w-10 h-10 text-slate-300 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No audit data</p>
              </div>
            )}
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 bg-slate-50/50 p-10 flex items-center justify-center relative">
          {isAnalyzing && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Neural Scan in Progress...</p>
            </div>
          )}

          <div className="w-full max-w-2xl aspect-video bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden relative group">
            {auditResult?.heatmap && activeView === 'heatmap' ? (
              <img src={auditResult.heatmap} className="w-full h-full object-cover animate-in fade-in duration-700" alt="Heatmap" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                <Layout className="w-20 h-20 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Live Preview</p>
              </div>
            )}
            
            {/* Overlay Issues on Preview */}
            {auditResult && activeView === 'issues' && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-32 h-10 border-2 border-rose-500 rounded-lg bg-rose-500/10 animate-pulse" />
                <div className="absolute top-[60%] right-[15%] w-20 h-20 border-2 border-amber-500 rounded-full bg-amber-500/10 animate-pulse" />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

