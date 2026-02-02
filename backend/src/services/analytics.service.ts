/**
 * Сервис углублённой аналитики и сбора метрик (Stage 5)
 */

import prisma from '../utils/prisma';

export class AnalyticsService {
  /**
   * Сбор общей статистики для пользователя/админа
   */
  static async getPlatformStats() {
    const projectsCount = await prisma.project.count();
    const usersCount = await prisma.user.count();
    const assetsCount = await prisma.asset.count();
    const totalRevenue = await prisma.purchase.aggregate({
      _sum: { amount: true }
    });

    return {
      projectsCount,
      usersCount,
      assetsCount,
      revenue: totalRevenue._sum.amount || 0,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Аналитика конкретного проекта (конверсии, активность)
   */
  static async getProjectPerformance(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        abTests: { include: { variants: true } },
        _count: { select: { comments: true, collaborators: true } }
      }
    });

    if (!project) throw new Error('Project not found');

    // Расчет средней конверсии по всем тестам
    const totalVisitors = project.abTests.reduce((acc, test) => 
      acc + test.variants.reduce((vAcc, v) => vAcc + v.visitors, 0), 0);
    const totalConversions = project.abTests.reduce((acc, test) => 
      acc + test.variants.reduce((vAcc, v) => vAcc + v.conversions, 0), 0);

    return {
      projectId: project.id,
      name: project.name,
      metrics: {
        visitors: totalVisitors,
        conversions: totalConversions,
        conversionRate: totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0,
        commentsCount: project._count.comments,
        teamSize: project._count.collaborators
      },
      abTests: project.abTests
    };
  }
}

/**
 * AI-советник по дизайну (Heuristics & Design Patterns)
 */
export class DesignAdvisorService {
  static async analyzeLayout(projectId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return [];

    const pages = (project.pages as any) || [];
    const recommendations = [];

    // Базовый эвристический анализ структуры
    for (const page of pages) {
      const blocks = page.blocks || [];
      
      // 1. Проверка на наличие Hero-секции
      if (!blocks.find((b: any) => b.type === 'hero')) {
        recommendations.push({
          type: 'structure',
          priority: 'high',
          message: 'На странице отсутствует Hero-секция. Добавьте главный блок для удержания внимания.',
          action: 'add_block_hero'
        });
      }

      // 2. Анализ призывов к действию (CTA)
      const ctaCount = blocks.filter((b: any) => b.content?.buttonText).length;
      if (ctaCount === 0) {
        recommendations.push({
          type: 'conversion',
          priority: 'critical',
          message: 'Не найдено ни одного призыва к действию (CTA). Добавьте кнопки для улучшения конверсии.',
          action: 'add_button'
        });
      }

      // 3. Анализ контента (SEO/Readability)
      const textBlocks = blocks.filter((b: any) => b.content?.text);
      for (const block of textBlocks) {
        if (block.content.text.length > 500) {
          recommendations.push({
            type: 'readability',
            priority: 'medium',
            message: `Блок "${block.type}" содержит слишком длинный текст. AI рекомендует разбить его на абзацы или добавить иконки.`,
            action: 'shorten_text'
          });
        }
      }
    }

    return recommendations;
  }
}

