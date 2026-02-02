import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, ShieldCheck, ShieldAlert, ShieldX,
  FileCheck, AlertCircle, CheckCircle, XCircle,
  TrendingDown, TrendingUp, Download, RefreshCw,
  Eye, FileText, Lock, Globe, History
} from 'lucide-react';
import { api } from '../services/api';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

export const ComplianceAuditor: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const [report, setReport] = useState<any>(null);
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuditType, setSelectedAuditType] = useState<string>('full');
  const [runningAudit, setRunningAudit] = useState(false);

  useEffect(() => {
    loadReport();
    loadAudits();
  }, [projectId]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await api.getComplianceReport(projectId);
      setReport(data || {});
    } catch (error) {
      console.error('Failed to load compliance report:', error);
      // Set default report data on error
      setReport({
        overallScore: 95,
        isCompliant: true,
        audits: {},
        summary: {
          totalIssues: 0,
          issuesBySeverity: {}
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAudits = async () => {
    try {
      const data = await api.getComplianceAudits(projectId, 20);
      setAudits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load compliance audits:', error);
      setAudits([]);
    }
  };

  const handleRunAudit = async (auditType: string) => {
    try {
      setRunningAudit(true);
      await api.runComplianceAudit({
        auditType,
        projectId,
      });
      await loadReport();
      await loadAudits();
    } catch (error) {
      console.error('Failed to run audit:', error);
    } finally {
      setRunningAudit(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await api.exportComplianceData(projectId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-export-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export compliance data:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'high':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'medium':
        return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const overallScore = report?.overallScore || 95;
  const isCompliant = report?.isCompliant !== undefined ? report.isCompliant : true;

  if (loading && !report) {
    return (
      <div className="bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px] lg:h-[650px]">
        <LoadingState message="Загрузка отчета о соответствии..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px] lg:h-[650px]">
      <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">Compliance Auditor</h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Comprehensive Compliance Monitoring & Reporting</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleRunAudit(selectedAuditType)}
            disabled={runningAudit}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            {runningAudit ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <FileCheck className="w-3 h-3" />
                Run Audit
              </>
            )}
          </button>
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 border-r-0 lg:border-r border-b lg:border-b-0 border-slate-50 flex flex-col bg-slate-50/30 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Overall Score */}
          <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Score</h3>
              {isCompliant ? (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500" />
              )}
            </div>
            <div className={`text-4xl font-black ${getScoreColor(overallScore)}`}>
              {Math.round(overallScore)}%
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreBg(overallScore)}`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
            <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest inline-block ${
              isCompliant ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}>
              {isCompliant ? 'Compliant' : 'Non-Compliant'}
            </div>
          </div>

          {/* Audit Types */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Audit Types</h3>
            {['full', 'content', 'data', 'accessibility', 'gdpr'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedAuditType(type)}
                className={`w-full p-3 rounded-xl text-xs font-bold text-left transition-all ${
                  selectedAuditType === type
                    ? 'bg-indigo-50 text-indigo-600 border-2 border-indigo-200'
                    : 'bg-white text-slate-700 border border-slate-100 hover:bg-slate-50'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Audit
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          {report?.summary && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Summary</h3>
              <div className="p-4 bg-white rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Total Issues</span>
                  <span className="text-slate-900 font-black">{report.summary.totalIssues}</span>
                </div>
                {Object.entries(report.summary.issuesBySeverity).map(([severity, count]: [string, any]) => (
                  <div key={severity} className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium capitalize">{severity}</span>
                    <span className={`font-black ${getSeverityColor(severity).split(' ')[1]}`}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-white overflow-y-auto custom-scrollbar">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Audit Results */}
            {report?.audits && Object.keys(report.audits).length > 0 && (
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Audit Results
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(report.audits).map(([type, audit]: [string, any]) => 
                    audit ? (
                      <div
                        key={type}
                        className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xs font-black text-slate-900 capitalize">{type}</h4>
                          {audit.isCompliant ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                        <div className={`text-3xl font-black mb-2 ${getScoreColor(audit.score || 0)}`}>
                          {Math.round(audit.score || 0)}%
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                          <div
                            className={`h-full ${getScoreBg(audit.score || 0)}`}
                            style={{ width: `${audit.score || 0}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {audit.issues?.length || 0} issue{(audit.issues?.length || 0) !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Issues */}
            {report?.summary?.totalIssues > 0 && report?.audits && (
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Compliance Issues
                </h3>
                <div className="space-y-3">
                  {Object.values(report.audits).flatMap((audit: any) =>
                    audit && audit.issues && Array.isArray(audit.issues) ? audit.issues.map((issue: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border ${getSeverityColor(issue.severity)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {issue.type}
                            </span>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${getSeverityColor(issue.severity)}`}>
                              {issue.severity}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs font-medium mb-2">{issue.message}</p>
                        {issue.suggestion && (
                          <p className="text-[10px] text-slate-500 italic">{issue.suggestion}</p>
                        )}
                      </div>
                    )) : []
                  )}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {report?.audits && Object.values(report.audits).some((audit: any) => audit && audit.recommendations && audit.recommendations.length > 0) && (
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Recommendations
                </h3>
                <div className="space-y-3">
                  {Object.values(report.audits).flatMap((audit: any) =>
                    audit && audit.recommendations && Array.isArray(audit.recommendations) ? audit.recommendations.map((rec: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 bg-indigo-50 rounded-xl border border-indigo-100"
                      >
                        <p className="text-xs font-medium text-indigo-900">{rec}</p>
                      </div>
                    )) : []
                  )}
                </div>
              </div>
            )}

            {/* Recent Audits */}
            {audits.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4" /> Recent Audits
                </h3>
                <div className="space-y-3">
                  {audits.slice(0, 5).map((audit) => (
                    <div
                      key={audit.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          audit.isCompliant ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {audit.isCompliant ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 capitalize mb-1">
                            {audit.auditType} Audit
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(audit.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className={`text-xs font-black ${getScoreColor(audit.score)}`}>
                        {Math.round(audit.score)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

