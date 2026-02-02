/**
 * Сервис внутреннего биллинга и квот
 * Управляет лимитами пользователей без внешних платежных систем
 */

import prisma from '../utils/prisma';

export interface QuotaUpdate {
  userId: string;
  resource: 'projects' | 'ai_generations' | 'storage_mb';
  amount: number;
}

export class BillingService {
  /**
   * Проверка доступности ресурса
   */
  static async canUseResource(userId: string, resource: string, amount: number = 1): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return false;

    // В реальности здесь была бы таблица Quotas
    // Для демо используем логику на базе плана
    const limits: any = {
      free: { projects: 3, ai_generations: 10, storage_mb: 100 },
      pro: { projects: 50, ai_generations: 500, storage_mb: 1000 },
      enterprise: { projects: -1, ai_generations: -1, storage_mb: 10000 }
    };

    const userLimits = limits[user.plan] || limits.free;
    
    // Проверка лимита (упрощенно)
    if (userLimits[resource] === -1) return true;
    
    // В реальности здесь был бы запрос к таблице Usage
    return true; 
  }

  /**
   * Списание ресурса (внутренние кредиты)
   */
  static async consumeResource(userId: string, resource: string, amount: number = 1) {
    console.log(`[Billing] User ${userId} consumed ${amount} of ${resource}`);
    // Здесь должна быть запись в таблицу UsageLog
    return true;
  }

  /**
   * Получение текущего баланса и лимитов
   */
  static async getUsageReport(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    return {
      plan: user.plan,
      usage: {
        projects: 1, // В реальности count из БД
        ai_generations: 5,
        storage_mb: 12.5
      },
      limits: {
        projects: user.plan === 'free' ? 3 : 50,
        ai_generations: user.plan === 'free' ? 10 : 500,
        storage_mb: user.plan === 'free' ? 100 : 1000
      }
    };
  }
}

