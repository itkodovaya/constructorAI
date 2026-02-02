/**
 * Внутренний сервис CRM и управления лидами
 */

import prisma from '../utils/prisma';

export interface Lead {
  id: string;
  projectId: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'negotiating' | 'closed_won' | 'closed_lost';
  source: string; // например, 'landing_page'
  notes?: string;
  createdAt: Date;
}

export class CRMService {
  static async addLead(projectId: string, leadData: Omit<Lead, 'id' | 'projectId' | 'createdAt'>) {
    return await (prisma as any).lead.create({
      data: {
        ...leadData,
        projectId,
      }
    });
  }

  static async getLeads(projectId: string) {
    return await (prisma as any).lead.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateLeadStatus(leadId: string, status: Lead['status']) {
    return await (prisma as any).lead.update({
      where: { id: leadId },
      data: { status }
    });
  }
}

/**
 * Внутренний сервис управления задачами (Task Manager)
 */
export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  dueDate?: Date;
}

export class TaskService {
  static async createTask(projectId: string, taskData: Omit<ProjectTask, 'id' | 'projectId'>) {
    return await (prisma as any).projectTask.create({
      data: {
        ...taskData,
        projectId
      }
    });
  }

  static async getTasks(projectId: string) {
    return await (prisma as any).projectTask.findMany({
      where: { projectId },
      orderBy: { dueDate: 'asc' }
    });
  }

  static async updateTaskStatus(taskId: string, status: ProjectTask['status']) {
    return await (prisma as any).projectTask.update({
      where: { id: taskId },
      data: { status }
    });
  }
}

