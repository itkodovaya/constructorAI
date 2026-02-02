import prisma from '../utils/prisma';
import axios from 'axios';

export class IntegrationService {
  static async createIntegration(projectId: string, data: { name: string, type: string, config: any, events: string[] }) {
    return await prisma.integration.create({
      data: {
        projectId,
        name: data.name,
        type: data.type,
        config: JSON.stringify(data.config),
        events: data.events.join(','),
        isActive: true
      }
    });
  }

  static async getProjectIntegrations(projectId: string) {
    return await prisma.integration.findMany({
      where: { projectId }
    });
  }

  static async deleteIntegration(id: string) {
    return await prisma.integration.delete({
      where: { id }
    });
  }

  /**
   * Trigger webhooks for a specific event
   */
  static async triggerEvent(projectId: string, event: string, payload: any) {
    const integrations = await prisma.integration.findMany({
      where: { 
        projectId,
        isActive: true,
        type: 'webhook',
        events: { contains: event }
      }
    });

    for (const integration of integrations) {
      try {
        const config = JSON.parse(integration.config);
        if (config.url) {
          console.log(`[WEBHOOK] Triggering ${event} for ${projectId} to ${config.url}`);
          // Send non-blocking
          axios.post(config.url, {
            event,
            projectId,
            timestamp: new Date().toISOString(),
            data: payload
          }, { timeout: 5000 }).catch(err => console.error(`Webhook fail: ${err.message}`));
        }
      } catch (err) {
        console.error(`Integration process fail:`, err);
      }
    }
  }
}
