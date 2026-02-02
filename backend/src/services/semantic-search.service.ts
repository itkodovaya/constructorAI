import prisma from '../utils/prisma';

export class SemanticSearchService {
  /**
   * Search across projects, leads, posts, and tasks using semantic intent
   */
  static async globalSearch(projectId: string, query: string) {
    const q = query.toLowerCase();
    
    // In a real app, this would use vector search (embeddings)
    // Mocking semantic results based on common keywords
    const results = [];

    // Search Leads
    const leads = await prisma.lead.findMany({ where: { projectId } });
    for (const lead of leads) {
      if (lead.email?.includes(q) || lead.name?.toLowerCase().includes(q) || lead.data?.toLowerCase().includes(q)) {
        results.push({ type: 'lead', id: lead.id, title: lead.name || lead.email, detail: 'CRM Lead' });
      }
    }

    // Search Blog Posts
    const posts = await prisma.blogPost.findMany({ where: { projectId } });
    for (const post of posts) {
      if (post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q)) {
        results.push({ type: 'post', id: post.id, title: post.title, detail: 'Blog Article' });
      }
    }

    // Search Tasks
    const tasks = await prisma.task.findMany({ where: { projectId } });
    for (const task of tasks) {
      if (task.title.toLowerCase().includes(q) || task.description?.toLowerCase().includes(q)) {
        results.push({ type: 'task', id: task.id, title: task.title, detail: 'AI Task' });
      }
    }

    return results;
  }

  /**
   * Parse Omni-Command intent
   */
  static async parseOmniCommand(projectId: string, prompt: string) {
    const p = prompt.toLowerCase();
    
    if (p.includes('coupon') || p.includes('discount')) {
      return { action: 'create_coupon', data: { amount: '20%', code: 'AI-SAVE-20' }, message: 'AI is preparing a 20% discount coupon for your store.' };
    }
    
    if (p.includes('notify') && p.includes('leads')) {
      return { action: 'notify_leads', data: { segment: 'qualified' }, message: 'AI will trigger a webhook notification for all qualified leads.' };
    }

    return { action: 'chat', message: `I understand you want to: "${prompt}". I'll process this across your project ecosystem.` };
  }
}
