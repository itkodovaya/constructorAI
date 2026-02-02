import prisma from '../utils/prisma';

export class TemplateService {
  static async saveTemplate(data: {
    name: string;
    type: 'block' | 'page';
    content: any;
    projectId?: string;
    category?: string;
    preview?: string;
  }) {
    return await prisma.projectSnapshot.create({
      data: {
        name: data.name,
        type: data.type,
        content: JSON.stringify(data.content),
        projectId: data.projectId,
        category: data.category,
        preview: data.preview,
        isPublic: false
      }
    });
  }

  static async getTemplates(projectId?: string, type?: string) {
    return await prisma.projectSnapshot.findMany({
      where: {
        OR: [
          { projectId },
          { isPublic: true }
        ],
        ...(type ? { type } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async deleteTemplate(id: string) {
    return await prisma.projectSnapshot.delete({
      where: { id }
    });
  }
}

