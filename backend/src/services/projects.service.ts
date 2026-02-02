/**
 * Сервис для управления проектами (Prisma Version)
 */

import prisma from '../utils/prisma';
import { Project as PrismaProject, Collaborator as PrismaCollaborator } from '../generated/client';
import { BrandService } from './brand.service';
import { LayoutService } from './layout.service';
import { PresentationService } from './presentation.service';

export class ProjectsService {
  /**
   * Получение всех проектов пользователя
   */
  static async getAll(userId?: string): Promise<PrismaProject[]> {
    const projects = await prisma.project.findMany({
      where: userId ? { ownerId: userId } : undefined,
      include: {
        collaborators: true,
        _count: {
          select: { comments: true, assets: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return projects.map(p => this.parseProject(p));
  }

  /**
   * Получение проекта по ID
   */
  static async getById(id: string): Promise<PrismaProject | null> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        collaborators: true,
        comments: {
          include: { user: { select: { name: true, email: true } } }
        },
        assets: true,
        abTests: {
          include: { variants: true }
        },
        products: {
          include: { category: true }
        }
      }
    });

    return project ? this.parseProject(project) : null;
  }

  /**
   * Создание нового проекта в БД
   */
  static async create(projectData: any, ownerId: string): Promise<PrismaProject> {
    console.log('[ProjectsService] Creating project for owner:', ownerId);
    
    // Генерация начального контента через AI сервисы
    const brandAssets = await BrandService.generate(
      projectData.brandName || 'Brand', 
      projectData.style || 'minimalist'
    );
    console.log('[ProjectsService] Brand assets generated');

    const blocks = LayoutService.generateDefaultLayout(
      projectData.brandName || 'Brand',
      projectData.niche || 'general'
    );
    console.log('[ProjectsService] Layout generated');

    const slides = PresentationService.generate(
      projectData.brandName || 'Brand',
      projectData.niche || 'general'
    );
    console.log('[ProjectsService] Presentation generated');

    const initialHistory = [{
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Создание проекта',
      assets: { ...brandAssets }
    }];

    try {
      const project = await prisma.project.create({
        data: {
          name: projectData.name || projectData.brandName || 'Untitled',
          brandName: projectData.brandName || 'Untitled',
          niche: projectData.niche || '',
          style: projectData.style || 'minimalist',
          brandAssets: JSON.stringify(brandAssets),
          pages: JSON.stringify([{ id: '1', title: 'Home', blocks: blocks }]),
          presentation: JSON.stringify(slides),
          history: JSON.stringify(initialHistory),
          ownerId: ownerId,
          organizationId: projectData.organizationId || null,
          seo: JSON.stringify({
            title: projectData.brandName || 'Untitled Project',
            description: 'Создано с помощью Constructor AI',
            keywords: 'ai, design, website, brand'
          }),
        }
      });
      console.log('[ProjectsService] Project created successfully in DB:', project.id);
      return this.parseProject(project);
    } catch (error) {
      console.error('[ProjectsService] DB Error creating project:', error);
      throw error;
    }
  }

  /**
   * Обновление проекта
   */
  static async update(id: string, updates: any): Promise<PrismaProject | null> {
    const oldProject = await prisma.project.findUnique({ where: { id } });
    if (!oldProject) return null;

    // Ведение истории изменений
    const history = oldProject.history ? JSON.parse(oldProject.history) : [];
    let newHistory = [...history];
    
    if (updates.brandAssets) {
      newHistory = [
        ...newHistory,
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          action: updates.brandAssets.palette ? 'Обновление палитры' : 'Изменение стиля',
          assets: { ...updates.brandAssets }
        }
      ].slice(-10);
    }

    const dataToUpdate: any = { ...updates };
    if (updates.brandAssets) dataToUpdate.brandAssets = JSON.stringify(updates.brandAssets);
    if (updates.pages) dataToUpdate.pages = JSON.stringify(updates.pages);
    if (updates.presentation) dataToUpdate.presentation = JSON.stringify(updates.presentation);
    if (updates.seo) dataToUpdate.seo = JSON.stringify(updates.seo);
    if (updates.brandAssets) dataToUpdate.history = JSON.stringify(newHistory);

    const updated = await prisma.project.update({
      where: { id },
      data: dataToUpdate
    });

    return this.parseProject(updated);
  }

  /**
   * Удаление проекта
   */
  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.project.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Добавление коллаборатора
   */
  static async addCollaborator(projectId: string, userId: string, role: string) {
    return await prisma.collaborator.create({
      data: {
        projectId,
        userId,
        role
      }
    });
  }

  static async getCollaborators(projectId: string) {
    return await prisma.collaborator.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  static async removeCollaborator(projectId: string, userId: string) {
    return await prisma.collaborator.deleteMany({
      where: {
        projectId,
        userId
      }
    });
  }

  static async inviteByEmail(projectId: string, email: string, role: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found. They must register first.');
    }
    return await this.addCollaborator(projectId, user.id, role);
  }

  static async transferOwnership(projectId: string, newOwnerEmail: string) {
    const user = await prisma.user.findUnique({ where: { email: newOwnerEmail } });
    if (!user) {
      throw new Error('User not found.');
    }
    return await prisma.project.update({
      where: { id: projectId },
      data: { ownerId: user.id }
    });
  }

  /**
   * Хелпер для парсинга JSON полей из БД
   */
  private static parseProject(project: any): any {
    return {
      ...project,
      brandAssets: project.brandAssets ? JSON.parse(project.brandAssets) : null,
      pages: project.pages ? JSON.parse(project.pages) : [],
      presentation: project.presentation ? JSON.parse(project.presentation) : [],
      seo: project.seo ? JSON.parse(project.seo) : null,
      history: project.history ? JSON.parse(project.history) : [],
    };
  }
}
