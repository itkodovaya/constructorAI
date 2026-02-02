/**
 * Сервис для управления шаблонами в маркетплейсе (Prisma Version)
 */

import prisma from '../utils/prisma';
import { Template as PrismaTemplate, TemplateReview as PrismaReview } from '../generated/client';

export class TemplateMarketplaceService {
  /**
   * Создает новый шаблон
   */
  static async createTemplate(data: any): Promise<PrismaTemplate> {
    console.log('[TemplateService] Creating template:', data.name);
    try {
      const template = await prisma.template.create({
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          thumbnail: data.thumbnail,
          previewImages: JSON.stringify(data.previewImages || []),
          authorId: data.authorId || 'system',
          price: data.price || 0,
          tags: JSON.stringify(data.tags || []),
          featured: data.featured || false,
          data: JSON.stringify(data.data || {})
        }
      });
      return this.parseTemplate(template);
    } catch (error) {
      console.error('[TemplateService] Error creating template:', error);
      throw error;
    }
  }

  /**
   * Получает все шаблоны с фильтрацией
   */
  static async getTemplates(filters?: {
    category?: string;
    search?: string;
    minRating?: number;
    maxPrice?: number;
    featured?: boolean;
    tags?: string[];
  }): Promise<PrismaTemplate[]> {
    const templates = await prisma.template.findMany({
      where: {
        category: filters?.category,
        price: filters?.maxPrice ? { lte: filters.maxPrice } : undefined,
        rating: filters?.minRating ? { gte: filters.minRating } : undefined,
        featured: filters?.featured,
        // Упрощенный поиск по тегам для SQLite
        tags: filters?.tags ? { contains: JSON.stringify(filters.tags) } : undefined,
        OR: filters?.search ? [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ] : undefined
      },
      orderBy: { downloadsCount: 'desc' }
    });
    return templates.map(t => this.parseTemplate(t));
  }

  /**
   * Получает шаблон по ID
   */
  static async getTemplateById(id: string): Promise<PrismaTemplate | null> {
    const template = await prisma.template.findUnique({
      where: { id },
      include: { reviews: true }
    });
    return template ? this.parseTemplate(template) : null;
  }

  /**
   * Скачивает шаблон (увеличивает счетчик)
   */
  static async downloadTemplate(templateId: string, userId: string): Promise<PrismaTemplate | null> {
    const updated = await prisma.template.update({
      where: { id: templateId },
      data: { downloadsCount: { increment: 1 } }
    });
    return this.parseTemplate(updated);
  }

  /**
   * Добавляет отзыв к шаблону
   */
  static async addReview(
    templateId: string,
    userId: string,
    userName: string,
    rating: number,
    comment: string
  ): Promise<PrismaReview> {
    const review = await prisma.templateReview.create({
      data: {
        templateId,
        userId,
        userName,
        rating,
        comment
      }
    });

    // Обновляем средний рейтинг шаблона
    const reviews = await prisma.templateReview.findMany({
      where: { templateId }
    });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.template.update({
      where: { id: templateId },
      data: {
        rating: avgRating,
        reviewsCount: reviews.length
      }
    });

    return review;
  }

  /**
   * Получает отзывы шаблона
   */
  static async getTemplateReviews(templateId: string): Promise<PrismaReview[]> {
    return await prisma.templateReview.findMany({
      where: { templateId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Получает категории шаблонов
   */
  static async getCategories(): Promise<Array<{ id: string; name: string; count: number }>> {
    const categories = ['website', 'presentation', 'social', 'brandkit'];
    const results = await Promise.all(categories.map(async (cat) => {
      const count = await prisma.template.count({ where: { category: cat } });
      return {
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        count
      };
    }));
    return results;
  }

  /**
   * Получает популярные шаблоны
   */
  static async getPopularTemplates(limit: number = 10): Promise<PrismaTemplate[]> {
    const templates = await prisma.template.findMany({
      orderBy: { downloadsCount: 'desc' },
      take: limit
    });
    return templates.map(t => this.parseTemplate(t));
  }

  /**
   * Получает рекомендуемые шаблоны
   */
  static async getRecommendedTemplates(limit: number = 10): Promise<PrismaTemplate[]> {
    const templates = await prisma.template.findMany({
      where: {
        OR: [
          { featured: true },
          { rating: { gte: 4 } }
        ]
      },
      orderBy: { rating: 'desc' },
      take: limit
    });
    return templates.map(t => this.parseTemplate(t));
  }

  /**
   * Инициализирует демо-шаблоны
   */
  static async initializeDemoTemplates() {
    try {
      const count = await prisma.template.count();
      if (count > 0) return;

      const demoCategories = [
        { category: 'website', name: 'Modern Business', description: 'Современный корпоративный сайт' },
        { category: 'presentation', name: 'Startup Pitch', description: 'Презентация для стартапа' },
        { category: 'social', name: 'Instagram Pack', description: 'Набор постов для Instagram' },
        { category: 'website', name: 'E-commerce Store', description: 'Интернет-магазин' },
        { category: 'presentation', name: 'Product Launch', description: 'Запуск продукта' },
        { category: 'brandkit', name: 'Minimalist Brand', description: 'Минималистичный бренд-кит' },
      ];

      for (const [index, demo] of demoCategories.entries()) {
        await this.createTemplate({
          ...demo,
          thumbnail: `https://via.placeholder.com/400x300?text=${encodeURIComponent(demo.name)}`,
          price: index < 2 ? 0 : (index < 5 ? 9 : 29),
          tags: [demo.category, 'popular', 'trending'],
          featured: index < 3,
          data: {}
        });
      }
    } catch (error) {
      console.error('[TemplateService] Failed to initialize demo templates:', error);
    }
  }

  /**
   * Хелпер для парсинга JSON полей
   */
  private static parseTemplate(template: any): any {
    return {
      ...template,
      previewImages: template.previewImages ? JSON.parse(template.previewImages) : [],
      tags: template.tags ? JSON.parse(template.tags) : [],
      data: template.data ? JSON.parse(template.data) : {}
    };
  }
}
