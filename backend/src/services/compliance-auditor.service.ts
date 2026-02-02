/**
 * Compliance Auditor Service
 * Comprehensive compliance checking and reporting
 */

import { ComplianceService } from './compliance.service';
import { SecurityComplianceService } from './security-compliance.service';

export interface ComplianceAudit {
  id: string;
  projectId?: string;
  userId?: string;
  auditType: 'content' | 'data' | 'accessibility' | 'gdpr' | 'full';
  timestamp: Date;
  isCompliant: boolean;
  score: number;
  issues: ComplianceIssue[];
  recommendations: string[];
}

export interface ComplianceIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location?: string;
  suggestion?: string;
}

export interface ComplianceReport {
  auditId: string;
  projectId?: string;
  overallScore: number;
  isCompliant: boolean;
  audits: {
    content: ComplianceAudit;
    data: ComplianceAudit;
    accessibility: ComplianceAudit;
    gdpr: ComplianceAudit;
  };
  summary: {
    totalIssues: number;
    issuesBySeverity: Record<string, number>;
    issuesByType: Record<string, number>;
  };
  trends: {
    scoreHistory: Array<{ date: Date; score: number }>;
    issueTrends: Record<string, number[]>;
  };
}

// In-memory storage for audits
const complianceAudits: ComplianceAudit[] = [];

export class ComplianceAuditorService {
  /**
   * Run a comprehensive compliance audit
   */
  static async runAudit(
    auditType: ComplianceAudit['auditType'],
    options: {
      projectId?: string;
      userId?: string;
      content?: string;
      data?: any;
    }
  ): Promise<ComplianceAudit> {
    const issues: ComplianceIssue[] = [];
    let score = 100;

    // Content audit
    if (auditType === 'content' || auditType === 'full') {
      if (options.content) {
        const contentAudit = await ComplianceService.auditContent(options.content);
        if (!contentAudit.isCompliant) {
          contentAudit.issues.forEach((issue) => {
            issues.push({
              type: issue.type,
              severity: issue.severity === 'high' ? 'high' : 'medium',
              message: issue.message,
              suggestion: `Review content for ${issue.type} compliance`,
            });
            score -= issue.severity === 'high' ? 20 : 10;
          });
        }
      }
    }

    // Data/GDPR audit
    if (auditType === 'data' || auditType === 'gdpr' || auditType === 'full') {
      if (options.userId) {
        // Check GDPR compliance
        const gdprCheck = SecurityComplianceService.checkGDPRCompliance(
          options.userId
        );
        if (!gdprCheck.compliant) {
          gdprCheck.issues.forEach((issue) => {
            issues.push({
              type: 'GDPR',
              severity: 'high',
              message: issue,
              suggestion: 'Ensure all required consents are obtained',
            });
            score -= 15;
          });
        }

        // Check FZ-152 compliance (Russian data protection law)
        const fz152Check = SecurityComplianceService.checkFZ152Compliance(
          options.userId
        );
        if (!fz152Check.compliant) {
          fz152Check.issues.forEach((issue) => {
            issues.push({
              type: 'FZ-152',
              severity: 'high',
              message: issue,
              suggestion: 'Ensure compliance with Russian data protection law',
            });
            score -= 15;
          });
        }
      }
    }

    // Accessibility audit
    if (auditType === 'accessibility' || auditType === 'full') {
      if (options.content) {
        // Check for accessibility issues
        const accessibilityIssues = this.checkAccessibility(options.content);
        accessibilityIssues.forEach((issue) => {
          issues.push(issue);
          score -= issue.severity === 'high' ? 15 : issue.severity === 'medium' ? 10 : 5;
        });
      }
    }

    // Additional checks
    if (auditType === 'full') {
      // Check for sensitive data
      if (options.content) {
        const sensitiveDataIssues = this.checkSensitiveData(options.content);
        sensitiveDataIssues.forEach((issue) => {
          issues.push(issue);
          score -= 10;
        });
      }
    }

    score = Math.max(0, Math.min(100, score));

    const audit: ComplianceAudit = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      projectId: options.projectId,
      userId: options.userId,
      auditType,
      timestamp: new Date(),
      isCompliant: score >= 80 && issues.filter((i) => i.severity === 'critical' || i.severity === 'high').length === 0,
      score,
      issues,
      recommendations: this.generateRecommendations(issues),
    };

    complianceAudits.push(audit);
    return audit;
  }

  /**
   * Check accessibility compliance
   */
  private static checkAccessibility(content: string): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];

    // Check for alt text in images (mock - would need HTML parsing)
    if (content.includes('<img') && !content.includes('alt=')) {
      issues.push({
        type: 'Accessibility',
        severity: 'medium',
        message: 'Images without alt text detected',
        suggestion: 'Add descriptive alt text to all images',
      });
    }

    // Check for heading structure
    const headingCount = (content.match(/<h[1-6]/g) || []).length;
    if (headingCount === 0 && content.length > 500) {
      issues.push({
        type: 'Accessibility',
        severity: 'low',
        message: 'Long content without heading structure',
        suggestion: 'Add headings to improve content structure',
      });
    }

    // Check for color contrast (mock)
    if (content.includes('color:') && !content.includes('background')) {
      issues.push({
        type: 'Accessibility',
        severity: 'medium',
        message: 'Potential color contrast issues',
        suggestion: 'Ensure sufficient color contrast for readability',
      });
    }

    return issues;
  }

  /**
   * Check for sensitive data
   */
  private static checkSensitiveData(content: string): ComplianceIssue[] {
    const issues: ComplianceIssue[] = [];

    // Check for email patterns
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = content.match(emailRegex);
    if (emails && emails.length > 0) {
      issues.push({
        type: 'Data Privacy',
        severity: 'medium',
        message: `Potential email addresses detected: ${emails.length}`,
        suggestion: 'Ensure email addresses are properly handled per privacy policy',
      });
    }

    // Check for phone patterns (simple)
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    const phones = content.match(phoneRegex);
    if (phones && phones.length > 0) {
      issues.push({
        type: 'Data Privacy',
        severity: 'medium',
        message: `Potential phone numbers detected: ${phones.length}`,
        suggestion: 'Review phone number handling for privacy compliance',
      });
    }

    return issues;
  }

  /**
   * Generate recommendations based on issues
   */
  private static generateRecommendations(issues: ComplianceIssue[]): string[] {
    const recommendations: string[] = [];
    const issueTypes = new Set(issues.map((i) => i.type));
    const highSeverityIssues = issues.filter(
      (i) => i.severity === 'high' || i.severity === 'critical'
    );

    if (highSeverityIssues.length > 0) {
      recommendations.push(
        `Address ${highSeverityIssues.length} high-severity compliance issue(s) immediately`
      );
    }

    if (issueTypes.has('GDPR')) {
      recommendations.push('Review and update GDPR consent mechanisms');
    }

    if (issueTypes.has('Accessibility')) {
      recommendations.push('Improve accessibility features for better WCAG compliance');
    }

    if (issueTypes.has('Data Privacy')) {
      recommendations.push('Review data handling practices for privacy compliance');
    }

    if (recommendations.length === 0) {
      recommendations.push('No critical issues detected. Continue monitoring compliance.');
    }

    return recommendations;
  }

  /**
   * Get comprehensive compliance report
   */
  static async getComplianceReport(
    projectId?: string,
    userId?: string,
    period?: { start: Date; end: Date }
  ): Promise<ComplianceReport> {
    const startDate = period?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = period?.end || new Date();

    let filteredAudits = complianceAudits.filter(
      (a) => a.timestamp >= startDate && a.timestamp <= endDate
    );

    if (projectId) {
      filteredAudits = filteredAudits.filter((a) => a.projectId === projectId);
    }
    if (userId) {
      filteredAudits = filteredAudits.filter((a) => a.userId === userId);
    }

    // Run fresh audits for each type
    const contentAudit = await this.runAudit('content', { projectId, userId });
    const dataAudit = await this.runAudit('data', { projectId, userId });
    const accessibilityAudit = await this.runAudit('accessibility', {
      projectId,
      userId,
    });
    const gdprAudit = await this.runAudit('gdpr', { projectId, userId });

    // Calculate overall score
    const scores = [
      contentAudit.score,
      dataAudit.score,
      accessibilityAudit.score,
      gdprAudit.score,
    ];
    const overallScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

    // Aggregate all issues
    const allIssues = [
      ...contentAudit.issues,
      ...dataAudit.issues,
      ...accessibilityAudit.issues,
      ...gdprAudit.issues,
    ];

    const issuesBySeverity: Record<string, number> = {};
    const issuesByType: Record<string, number> = {};

    allIssues.forEach((issue) => {
      issuesBySeverity[issue.severity] =
        (issuesBySeverity[issue.severity] || 0) + 1;
      issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
    });

    // Generate score history (mock - in production, use historical data)
    const scoreHistory = filteredAudits
      .map((a) => ({
        date: a.timestamp,
        score: a.score,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const issueTrends: Record<string, number[]> = {};
    Object.keys(issuesByType).forEach((type) => {
      issueTrends[type] = filteredAudits
        .map((a) => a.issues.filter((i) => i.type === type).length)
        .slice(-10);
    });

    return {
      auditId: `report-${Date.now()}`,
      projectId,
      overallScore,
      isCompliant: overallScore >= 80,
      audits: {
        content: contentAudit,
        data: dataAudit,
        accessibility: accessibilityAudit,
        gdpr: gdprAudit,
      },
      summary: {
        totalIssues: allIssues.length,
        issuesBySeverity,
        issuesByType,
      },
      trends: {
        scoreHistory,
        issueTrends,
      },
    };
  }

  /**
   * Get audit history
   */
  static getAuditHistory(
    projectId?: string,
    userId?: string,
    limit: number = 50
  ): ComplianceAudit[] {
    let filtered = complianceAudits;

    if (projectId) {
      filtered = filtered.filter((a) => a.projectId === projectId);
    }
    if (userId) {
      filtered = filtered.filter((a) => a.userId === userId);
    }

    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Export compliance data
   */
  static async exportComplianceData(
    projectId?: string,
    userId?: string
  ): Promise<any> {
    const report = await this.getComplianceReport(projectId, userId);
    const history = this.getAuditHistory(projectId, userId, 100);

    return {
      exportDate: new Date().toISOString(),
      report,
      auditHistory: history.map((a) => ({
        id: a.id,
        auditType: a.auditType,
        timestamp: a.timestamp.toISOString(),
        isCompliant: a.isCompliant,
        score: a.score,
        issueCount: a.issues.length,
      })),
    };
  }
}

