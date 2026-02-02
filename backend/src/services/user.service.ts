/**
 * Сервис для управления пользователями и аутентификацией (Prisma Version)
 */

import * as crypto from 'crypto';
import prisma from '../utils/prisma';
import { User as PrismaUser } from '../generated/client';

export type UserPlan = 'free' | 'pro' | 'business' | 'enterprise';

export class UserService {
  /**
   * Создает нового пользователя в БД
   */
  static async createUser(email: string, password: string, name: string): Promise<PrismaUser> {
    const passwordHash = this.hashPassword(password);

    return await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        plan: 'free',
      }
    });
  }

  /**
   * Аутентификация пользователя через БД
   */
  static async authenticate(email: string, password: string): Promise<{ user: Partial<PrismaUser>; token: string } | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !this.verifyPassword(password, user.passwordHash)) {
      return null;
    }

    // В реальности здесь была бы генерация JWT
    const token = this.generateToken();

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Получение пользователя по ID из БД
   */
  static async getUserById(userId: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { id: userId }
    });
  }

  /**
   * Получение пользователя по токену
   */
  static async getUserByToken(token: string): Promise<PrismaUser | null> {
    // В реальности мы бы искали сессию по токену в БД или декодировали JWT
    // Для демо режима мы поддерживаем фиксированные токены или просто возвращаем первого пользователя
    if (token === 'demo-token') {
      return await prisma.user.findFirst() || await this.createDemoUser();
    }
    
    // Пытаемся найти пользователя с таким ID (упрощенно используем ID как токен для демо)
    return await prisma.user.findUnique({ where: { id: token } });
  }

  private static async createDemoUser() {
    return await this.createUser('demo@constructor.ai', 'password', 'Demo User');
  }

  /**
   * Обновление плана пользователя
   */
  static async updatePlan(userId: string, plan: UserPlan): Promise<PrismaUser> {
    return await prisma.user.update({
      where: { id: userId },
      data: { plan }
    });
  }

  /**
   * Увеличение счетчика использования ресурсов
   */
  static async incrementUsage(userId: string, action: 'project' | 'ai_generation') {
    // В текущей схеме нет счетчиков, мы просто проверяем лимиты по количеству записей
    // Но для AI генераций можно было бы добавить поле или таблицу логов
    console.log(`[UserService] Incrementing usage for ${userId}: ${action}`);
    return true;
  }

  /**
   * Проверка лимитов пользователя (через БД)
   */
  static async checkLimits(userId: string, action: 'project' | 'ai_generation'): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { projects: true }
        }
      }
    });

    if (!user) return false;

    const limits = this.getPlanLimits(user.plan as UserPlan);

    switch (action) {
      case 'project':
        return limits.projectsLimit === -1 || user._count.projects < limits.projectsLimit;
      case 'ai_generation':
        // В БД нужно будет добавить счетчик AI генераций или отдельную таблицу логов
        return true; 
      default:
        return false;
    }
  }

  /**
   * Получение лимитов плана
   */
  static getPlanLimits(plan: UserPlan): {
    projectsLimit: number;
    aiGenerationsLimit: number;
    features: string[];
  } {
    const limits = {
      free: {
        projectsLimit: 100, // Увеличиваем лимит для тестирования
        aiGenerationsLimit: 1000,
        features: ['Базовые блоки', 'Экспорт HTML', 'Предпросмотр']
      },
      pro: {
        projectsLimit: 50,
        aiGenerationsLimit: 500,
        features: ['Все блоки', 'AI генерация', 'Экспорт PDF/ZIP', 'Приоритетная поддержка']
      },
      business: {
        projectsLimit: -1, // Безлимит
        aiGenerationsLimit: -1, // Безлимит
        features: ['Все функции Pro', 'Безлимит проектов', 'Безлимит AI', 'Персональный менеджер']
      },
      enterprise: {
        projectsLimit: -1,
        aiGenerationsLimit: -1,
        features: ['Все функции Business', 'Multi-tenancy', 'Sovereign AI Node', 'White Label']
      }
    };

    return limits[plan] || limits.free;
  }

  private static hashPassword(password: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(password + 'constructor_salt_2024'); 
    return hash.digest('hex');
  }

  private static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  private static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static async getAllUsers(): Promise<Partial<PrismaUser>[]> {
    const users = await prisma.user.findMany();
    return users.map(({ passwordHash, ...u }) => u);
  }
}
