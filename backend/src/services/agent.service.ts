import prisma from '../utils/prisma';

export class AgentService {
  /**
   * Registry of available agent types
   */
  static async getAvailableAgents() {
    return await prisma.agent.findMany();
  }

  /**
   * Create a new task for an agent
   */
  static async createTask(data: {
    projectId: string;
    title: string;
    description: string;
    priority?: number;
    assignedAgentId?: string;
    inputData?: any;
  }) {
    return await prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        priority: data.priority || 0,
        assignedAgentId: data.assignedAgentId,
        inputData: data.inputData ? JSON.stringify(data.inputData) : null,
        status: 'pending'
      }
    });
  }

  /**
   * Get all tasks for a project
   */
  static async getProjectTasks(projectId: string) {
    return await prisma.task.findMany({
      where: { projectId },
      include: { 
        agent: true,
        messages: { orderBy: { createdAt: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Add a message to a task (Agent or User)
   */
  static async addTaskMessage(taskId: string, senderId: string, content: string, type: 'text' | 'result' | 'error' | 'swarm' = 'text') {
    return await prisma.agentMessage.create({
      data: {
        taskId,
        senderId,
        content,
        type
      }
    });
  }

  /**
   * Simulate a swarm collaboration for a complex task
   */
  static async initiateSwarm(taskId: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { agent: true } });
    if (!task) return;

    // Simulate specialized agents joining the conversation
    const collaborators = [
      { id: 'seo-guru', name: 'SEO Guru' },
      { id: 'creative-director', name: 'Creative Director' }
    ];

    for (const collab of collaborators) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.addTaskMessage(taskId, collab.id, `[Swarm] ${collab.name} joined. I'll contribute my expertise to the "${task.title}" objective.`, 'swarm');
    }

    // Lead agent coordinates
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.addTaskMessage(taskId, task.assignedAgentId || 'system', `Collaborators, let's divide the work. SEO Guru, focus on keywords. Creative Director, align the visual vibe.`, 'swarm');
  }

  static async updateAgent(id: string, data: { personality?: any, skills?: string[] }) {
    return await prisma.agent.update({
      where: { id },
      data: {
        personality: data.personality ? JSON.stringify(data.personality) : undefined,
        skills: data.skills ? JSON.stringify(data.skills) : undefined
      }
    });
  }

  /**
   * Initialize default agents if they don't exist
   */
  static async initDefaultAgents() {
    const defaults = [
      { name: 'Creative Director', type: 'design', role: 'system', capabilities: 'Design analysis, Palette generation, Layout critique' },
      { name: 'SEO Guru', type: 'marketing', role: 'system', capabilities: 'Keyword research, Meta-tag optimization, Sitemap strategy' },
      { name: 'Conversion Expert', type: 'sales', role: 'system', capabilities: 'A/B test design, Heatmap analysis, CTA optimization' }
    ];

    for (const def of defaults) {
      await prisma.agent.upsert({
        where: { id: def.name }, // Use name as ID for mock simplicity or generated UUID
        update: {},
        create: {
          id: def.name.toLowerCase().replace(/\s/g, '-'),
          ...def
        }
      });
    }
  }
}
