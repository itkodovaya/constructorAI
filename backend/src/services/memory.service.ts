import prisma from '../utils/prisma';

export class MemoryService {
  /**
   * Save a user preference or fact to agent memory
   */
  static async saveMemory(agentType: string, key: string, value: any, organizationId?: string) {
    return await prisma.agentMemory.upsert({
      where: {
        agentType_key_organizationId: {
          agentType,
          key,
          organizationId: organizationId || 'global'
        }
      },
      update: { value: JSON.stringify(value) },
      create: {
        agentType,
        key,
        value: JSON.stringify(value),
        organizationId: organizationId || 'global'
      }
    });
  }

  /**
   * Get memory for context injection
   */
  static async getMemory(agentType: string, organizationId?: string) {
    return await prisma.agentMemory.findMany({
      where: {
        agentType,
        OR: [
          { organizationId: organizationId || 'global' },
          { organizationId: 'global' }
        ]
      }
    });
  }

  /**
   * Track a manual correction by the user to learn from it
   */
  static async trackCorrection(projectId: string, blockType: string, originalContent: any, newContent: any) {
    // In a real app, this would feed into a fine-tuning dataset or a "Negative Constraints" memory
    console.log(`[AI LEARNING] User corrected ${blockType} in project ${projectId}.`);
    
    // Save to memory as a "preference"
    const prefKey = `pref_${blockType}_style`;
    await this.saveMemory('designer', prefKey, { lastCorrection: new Date(), styleHint: 'user preferred this manual edit' });
  }
}

