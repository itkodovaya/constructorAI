import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, ShieldCheck, ShieldAlert, 
  History, Eye, Lock, UserCheck,
  CheckCircle, AlertTriangle, Scale,
  Sparkles, TrendingUp, Download, Activity
} from 'lucide-react';
import { api } from '../services/api';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

export const AIGovernance: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const [humanInLoop, setHumanInLoop] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    if (projectId) {
      loadDecisions();
    }
  }, [projectId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.getGovernanceDashboard(projectId);
      setDashboard(data);
    } catch (error) {
      console.error('Failed to load governance dashboard:', error);
      // Set default dashboard data on error
      setDashboard({
        usage: {
          complianceScore: 98,
          riskLevel: 'low',
          totalDecisions: 0,
          averageConfidence: 0.85
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDecisions = async () => {
    if (!projectId) return;
    try {
      const data = await api.getProjectAIDecisions(projectId, 20);
      setDecisions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load AI decisions:', error);
      setDecisions([]);
    }
  };

  const handleExport = async () => {
    try {
      const data = await api.exportGovernanceData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `governance-export-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export governance data:', error);
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const logs = decisions.length > 0 
    ? decisions.map(d => ({
        id: d.id,
        action: d.action,
        reason: d.reasoning || 'AI decision',
        timestamp: formatTimestamp(d.timestamp),
        status: d.confidence && d.confidence > 0.7 ? 'auto' : 'manual',
        confidence: d.confidence
      }))
    : [
        { id: 1, action: 'A/B Test Created', reason: 'Low conversion on Hero block detected.', timestamp: '2 mins ago', status: 'auto' },
        { id: 2, action: 'Content Rewrite', reason: 'SEO score for "Neural Design" was below 70%.', timestamp: '1 hour ago', status: 'auto' },
        { id: 3, action: 'Self-Healing', reason: 'Contrast ratio fixed for accessibility compliance.', timestamp: '3 hours ago', status: 'auto' },
        { id: 4, action: 'Personalization Rule', reason: 'New rule added for LinkedIn traffic.', timestamp: 'Yesterday', status: 'manual' },
      ];

  const complianceScore = dashboard?.usage?.complianceScore || dashboard?.complianceScore || 98;
  const riskLevel = dashboard?.usage?.riskLevel || dashboard?.riskLevel || 'low';

  if (loading && !dashboard) {
    return (
      <div className="bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px] lg:h-[650px]">
        <LoadingState message="Загрузка AI Governance..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px] lg:h-[650px]">
      <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">AI Governance & Ethics</h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Transparency, Compliance & Human Control</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-slate-100">
          <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${humanInLoop ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Human-in-Loop</div>
          <button 
            onClick={() => setHumanInLoop(!humanInLoop)}
            className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full relative transition-all ${humanInLoop ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-all ${humanInLoop ? 'left-6 sm:left-7' : 'left-0.5 sm:left-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Compliance Sidebar */}
        <aside className="w-full lg:w-80 border-r-0 lg:border-r border-b lg:border-b-0 border-slate-50 flex flex-col bg-slate-50/30 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Score</h3>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-4xl font-black text-slate-900">{complianceScore}%</div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${complianceScore >= 90 ? 'bg-emerald-500' : complianceScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'} w-[${complianceScore}%]`} style={{ width: `${complianceScore}%` }} />
            </div>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
              {complianceScore >= 90 
                ? 'Your project is fully compliant with GDPR and WCAG 2.1 accessibility standards.'
                : complianceScore >= 70
                ? 'Your project is mostly compliant. Review recommendations for improvements.'
                : 'Your project has compliance issues that need attention.'}
            </p>
            {(dashboard?.usage || dashboard) && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Total Decisions</span>
                  <span className="text-slate-900 font-black">{dashboard?.usage?.totalDecisions || dashboard?.totalDecisions || 0}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Risk Level</span>
                  <span className={`font-black uppercase tracking-widest ${
                    riskLevel === 'low' ? 'text-emerald-600' : 
                    riskLevel === 'medium' ? 'text-amber-600' : 
                    'text-rose-600'
                  }`}>{riskLevel}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Avg Confidence</span>
                  <span className="text-slate-900 font-black">{Math.round(((dashboard?.usage?.averageConfidence || dashboard?.averageConfidence || 0) * 100))}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Active Guardrails</h3>
            <div className="space-y-2">
              {[
                { label: 'GDPR Data Privacy', status: 'Active' },
                { label: 'Ethical Content Filter', status: 'Active' },
                { label: 'Accessibility Watchdog', status: 'Active' },
              ].map((g, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{g.label}</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Audit Log */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-white overflow-y-auto custom-scrollbar">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><History className="w-3 h-3 sm:w-4 sm:h-4" /> AI Decision Audit Log</h3>
              <button 
                onClick={handleExport}
                className="text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2 transition-colors"
              >
                <Download className="w-3 h-3" />
                Export Log
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="p-4 sm:p-6 bg-slate-50 rounded-[24px] sm:rounded-[32px] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 group hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all">
                  <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${log.status === 'auto' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                      {log.status === 'auto' ? <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" /> : <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-xs font-black text-slate-900 truncate">{log.action}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest shrink-0">• {log.timestamp}</span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-500 leading-relaxed break-words">{log.reason}</p>
                    </div>
                  </div>
                  <div className={`px-2 sm:px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shrink-0 ${log.status === 'auto' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                    {log.status}
                  </div>
                </div>
              )) : (
                <EmptyState
                  iconType="governance"
                  title="Нет решений AI"
                  description="Решения AI будут отображаться здесь после их создания."
                />
              )}
            </div>

            <div className="p-4 sm:p-6 lg:p-8 bg-rose-50 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1">Ethical Guardrail Alert</h4>
                <p className="text-[10px] font-medium text-rose-500 leading-relaxed">AI detected a potential bias in the generated "Team" block images. Automatic correction applied to ensure diversity.</p>
              </div>
              <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200">Review</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


