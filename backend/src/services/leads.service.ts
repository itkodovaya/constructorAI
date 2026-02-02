import prisma from '../utils/prisma';
import { IntegrationService } from './integration.service';

export interface LeadData {
  projectId: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  data?: any;
}

export class LeadsService {
  /**
   * Создание нового лида
   */
  static async createLead(data: LeadData) {
    const { projectId, name, email, phone, message, ...extraData } = data;
    const finalData = { 
      ...(typeof extraData.data === 'string' ? JSON.parse(extraData.data) : (extraData.data || {})),
      ...extraData 
    };
    delete finalData.data;

    const lead = await prisma.lead.create({
      data: {
        projectId,
        name: name || finalData.name,
        email: email || finalData.email,
        phone: phone || finalData.phone,
        message: message || finalData.message,
        data: Object.keys(finalData).length > 0 ? JSON.stringify(finalData) : null,
      },
    });

    // Trigger Integrations
    IntegrationService.triggerEvent(projectId, 'lead.created', lead);

    return lead;
  }

  /**
   * Получение всех лидов проекта
   */
  static async getProjectLeads(projectId: string) {
    const leads = await prisma.lead.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return leads.map(lead => ({
      ...lead,
      data: lead.data ? JSON.parse(lead.data) : null,
    }));
  }

  /**
   * Обновление статуса лида
   */
  static async updateLeadStatus(id: string, status: string) {
    return await prisma.lead.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Обновление лида (теги, заметки)
   */
  static async updateLead(id: string, data: { tags?: string, notes?: string, status?: string }) {
    return await prisma.lead.update({
      where: { id },
      data,
    });
  }

  /**
   * Удаление лида
   */
  static async deleteLead(id: string) {
    return await prisma.lead.delete({
      where: { id },
    });
  }
}

