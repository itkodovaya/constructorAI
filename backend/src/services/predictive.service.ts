import prisma from '../utils/prisma';

export class PredictiveService {
  /**
   * Forecast leads and revenue for the next 30 days
   */
  static async getForecast(projectId: string): Promise<any> {
    const leads = await prisma.lead.findMany({ where: { projectId } });
    
    // Simple mock forecasting logic
    const currentLeadVolume = leads.length;
    const growthRate = 1.15; // 10% month-over-month growth
    
    const dailyForecast = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      expectedLeads: Math.round((currentLeadVolume / 30 || 1) * growthRate * (1 + Math.sin(i / 5) * 0.2)),
      confidence: 85 + Math.random() * 10
    }));

    return {
      summary: {
        predictedLeads: Math.round(currentLeadVolume * growthRate) || 50,
        uplift: '+15%',
        anomalies: 0
      },
      chartData: dailyForecast
    };
  }
}

