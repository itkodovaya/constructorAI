/**
 * AI Governance Service
 * Tracks AI decisions, usage patterns, and provides governance dashboard data
 */

import prisma from '../utils/prisma';
import { ComplianceService } from './compliance.service';

export interface AIDecision {
  id: string;
  projectId?: string;
  userId: string;
  action: string;
  model?: string;
  prompt?: string;
  response?: string;
  reasoning?: string;
  confidence?: number;
  timestamp: Date;
  metadata?: any;
}

export interface AIUsageStats {
  totalDecisions: number;
  decisionsByModel: Record<string, number>;
  decisionsByAction: Record<string, number>;
  averageConfidence: number;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recentDecisions: AIDecision[];
}

export interface GovernanceReport {
  period: { start: Date; end: Date };
  usage: AIUsageStats;
  compliance: {
    totalAudits: number;
    compliant: number;
    nonCompliant: number;
    issues: Array<{ type: string; severity: string; count: number }>;
  };
  risks: Array<{ type: string; description: string; severity: string }>;
  recommendations: string[];
}

// In-memory storage for AI decisions (in production, use database)
const aiDecisions: AIDecision[] = [];

export class AIGovernanceService {
  /**
   * Log an AI decision for governance tracking
   */
  static async logDecision(
    userId: string,
    action: string,
    options: {
      projectId?: string;
      model?: string;
      prompt?: string;
      response?: string;
      reasoning?: string;
      confidence?: number;
      metadata?: any;
    }
  ): Promise<AIDecision> {
    const decision: AIDecision = {
      id: `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      projectId: options.projectId,
      model: options.model || 'default',
      prompt: options.prompt,
      response: options.response,
      reasoning: options.reasoning,
      confidence: options.confidence,
      timestamp: new Date(),
      metadata: options.metadata,
    };

    aiDecisions.push(decision);

    // Also log to compliance service
    if (options.projectId) {
      await ComplianceService.logDecision(
        options.projectId,
        action,
        options.reasoning || 'AI decision'
      );
    }

    // In production, save to database
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action: `ai_${action}`,
          resource: 'ai_decision',
          resourceId: decision.id,
          details: JSON.stringify({
            model: options.model,
            confidence: options.confidence,
            reasoning: options.reasoning,
          }),
        },
      });
    } catch (error) {
      console.error('Failed to save AI decision to audit log:', error);
    }

    return decision;
  }

  /**
   * Get AI usage statistics
   */
  static getUsageStats(
    userId?: string,
    projectId?: string,
    startDate?: Date,
    endDate?: Date
  ): AIUsageStats {
    let filtered = aiDecisions;

    if (userId) {
      filtered = filtered.filter((d) => d.userId === userId);
    }
    if (projectId) {
      filtered = filtered.filter((d) => d.projectId === projectId);
    }
    if (startDate) {
      filtered = filtered.filter((d) => d.timestamp >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((d) => d.timestamp <= endDate);
    }

    const decisionsByModel: Record<string, number> = {};
    const decisionsByAction: Record<string, number> = {};
    let totalConfidence = 0;
    let confidenceCount = 0;

    filtered.forEach((decision) => {
      decisionsByModel[decision.model || 'unknown'] =
        (decisionsByModel[decision.model || 'unknown'] || 0) + 1;
      decisionsByAction[decision.action] =
        (decisionsByAction[decision.action] || 0) + 1;
      if (decision.confidence !== undefined) {
        totalConfidence += decision.confidence;
        confidenceCount++;
      }
    });

    const averageConfidence =
      confidenceCount > 0 ? totalConfidence / confidenceCount : 0;

    // Calculate compliance score (mock - in production, check actual compliance)
    const complianceScore = Math.min(100, 100 - filtered.length * 0.1);

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (filtered.length > 1000) riskLevel = 'high';
    else if (filtered.length > 500) riskLevel = 'medium';

    const recentDecisions = filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalDecisions: filtered.length,
      decisionsByModel,
      decisionsByAction,
      averageConfidence,
      complianceScore,
      riskLevel,
      recentDecisions,
    };
  }

  /**
   * Get governance dashboard data
   */
  static async getDashboardData(
    userId?: string,
    organizationId?: string,
    period?: { start: Date; end: Date }
  ): Promise<GovernanceReport> {
    const startDate = period?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = period?.end || new Date();

    const usage = this.getUsageStats(userId, undefined, startDate, endDate);

    // Get compliance data
    const complianceIssues: Array<{ type: string; severity: string; count: number }> = [];
    const issuesByType: Record<string, { severity: string; count: number }> = {};

    // Mock compliance audit (in production, query actual compliance audits)
    const mockIssues = [
      { type: 'GDPR', severity: 'high', count: 2 },
      { type: 'Accessibility', severity: 'medium', count: 5 },
      { type: 'Content Policy', severity: 'low', count: 1 },
    ];

    mockIssues.forEach((issue) => {
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = { severity: issue.severity, count: 0 };
      }
      issuesByType[issue.type].count += issue.count;
    });

    Object.entries(issuesByType).forEach(([type, data]) => {
      complianceIssues.push({ type, ...data });
    });

    const totalAudits = usage.totalDecisions;
    const nonCompliant = complianceIssues.reduce((sum, issue) => sum + issue.count, 0);
    const compliant = totalAudits - nonCompliant;

    // Identify risks
    const risks: Array<{ type: string; description: string; severity: string }> = [];
    if (usage.riskLevel === 'high') {
      risks.push({
        type: 'Usage Volume',
        description: 'High volume of AI decisions detected. Monitor for compliance.',
        severity: 'medium',
      });
    }
    if (usage.averageConfidence < 0.5) {
      risks.push({
        type: 'Low Confidence',
        description: 'AI decisions show low confidence scores. Review model performance.',
        severity: 'high',
      });
    }
    if (nonCompliant > totalAudits * 0.1) {
      risks.push({
        type: 'Compliance',
        description: 'High number of compliance issues detected.',
        severity: 'high',
      });
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (usage.riskLevel === 'high') {
      recommendations.push('Consider implementing rate limiting for AI operations');
    }
    if (usage.averageConfidence < 0.6) {
      recommendations.push('Review and improve AI model prompts for better confidence');
    }
    if (nonCompliant > 0) {
      recommendations.push('Address compliance issues to maintain regulatory compliance');
    }
    if (recommendations.length === 0) {
      recommendations.push('AI governance metrics are within acceptable ranges');
    }

    return {
      period: { start: startDate, end: endDate },
      usage,
      compliance: {
        totalAudits,
        compliant,
        nonCompliant,
        issues: complianceIssues,
      },
      risks,
      recommendations,
    };
  }

  /**
   * Get AI decisions for a project
   */
  static getProjectDecisions(
    projectId: string,
    limit: number = 50
  ): AIDecision[] {
    return aiDecisions
      .filter((d) => d.projectId === projectId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get AI decisions for a user
   */
  static getUserDecisions(userId: string, limit: number = 50): AIDecision[] {
    return aiDecisions
      .filter((d) => d.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Export governance data for compliance reporting
   */
  static async exportGovernanceData(
    userId?: string,
    organizationId?: string,
    period?: { start: Date; end: Date }
  ): Promise<any> {
    const dashboard = await this.getDashboardData(userId, organizationId, period);
    const decisions = userId
      ? this.getUserDecisions(userId, 1000)
      : aiDecisions.slice(0, 1000);

    return {
      exportDate: new Date().toISOString(),
      period: dashboard.period,
      summary: {
        totalDecisions: dashboard.usage.totalDecisions,
        complianceScore: dashboard.usage.complianceScore,
        riskLevel: dashboard.usage.riskLevel,
      },
      compliance: dashboard.compliance,
      risks: dashboard.risks,
      decisions: decisions.map((d) => ({
        id: d.id,
        action: d.action,
        model: d.model,
        timestamp: d.timestamp.toISOString(),
        confidence: d.confidence,
      })),
    };
  }
}

