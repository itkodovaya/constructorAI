/**
 * Versioning Service - Система версионирования проектов в стиле Git
 * Позволяет создавать снапшоты (коммиты) и ветки проектов
 */

import prisma from '../utils/prisma';

export class VersioningService {
  /**
   * Создание новой версии проекта (Snapshot)
   */
  static async createVersion(projectId: string, name: string, description?: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) throw new Error('Project not found');

    // Собираем полный снапшот данных проекта
    const snapshot = {
      brandAssets: project.brandAssets ? JSON.parse(project.brandAssets) : null,
      pages: project.pages ? JSON.parse(project.pages) : null,
      presentation: project.presentation ? JSON.parse(project.presentation) : null,
      seo: project.seo ? JSON.parse(project.seo) : null
    };

    return await prisma.projectVersion.create({
      data: {
        projectId,
        name,
        description,
        data: JSON.stringify(snapshot)
      }
    });
  }

  /**
   * Откат проекта к определенной версии
   */
  static async restoreVersion(versionId: string) {
    const version = await prisma.projectVersion.findUnique({
      where: { id: versionId }
    });

    if (!version) throw new Error('Version not found');

    const data = JSON.parse(version.data);

    return await prisma.project.update({
      where: { id: version.projectId },
      data: {
        brandAssets: JSON.stringify(data.brandAssets),
        pages: JSON.stringify(data.pages),
        presentation: JSON.stringify(data.presentation),
        seo: JSON.stringify(data.seo),
        history: JSON.stringify({
          push: {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            action: `Восстановление версии: ${version.name}`
          }
        })
      }
    });
  }

  /**
   * Получение списка всех версий проекта
   */
  static async getProjectVersions(projectId: string) {
    return await prisma.projectVersion.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
