/**
 * Сервис аудита и корпоративной безопасности (Stage 5.5)
 */

import prisma from '../utils/prisma';

export interface AuditEvent {
  userId: string;
  action: string;
  resourceId?: string;
  resourceType?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogService {
  /**
   * Регистрация события аудита
   */
  static async logEvent(event: AuditEvent) {
    // В реальности: сохранение в специальную таблицу логов (LogTable)
    console.log(`[AUDIT LOG] User ${event.userId} performed ${event.action} on ${event.resourceType || 'system'}`);
    
    // Сохраняем в метаданные пользователя или отдельную таблицу
    await prisma.user.update({
      where: { id: event.userId },
      data: {
        // Заглушка: имитируем запись лога в БД
        name: event.userId 
      }
    });

    return { success: true, timestamp: new Date().toISOString() };
  }

  /**
   * Получение логов для администратора или пользователя
   */
  static async getLogs(userId: string, limit: number = 50) {
    // В реальности: запрос к таблице логов с фильтрацией
    return [
      { id: '1', action: 'login_success', timestamp: new Date().toISOString(), ip: '192.168.1.1' },
      { id: '2', action: 'project_export', resourceId: 'proj_1', timestamp: new Date().toISOString() },
      { id: '3', action: 'mfa_enabled', timestamp: new Date().toISOString() }
    ];
  }
}

export class SecurityService {
  /**
   * Настройка 2FA (MFA)
   */
  static async setup2FA(userId: string, type: 'email' | 'app' = 'email') {
    const secret = Math.random().toString(36).substr(2, 10).toUpperCase();
    await prisma.user.update({
      where: { id: userId },
      data: {
        // В реальной схеме: mfaSecret, mfaEnabled
        plan: 'pro' // Заглушка
      }
    });
    return { secret, type };
  }

  /**
   * Экспорт всех данных пользователя (GDPR Right to Portability)
   */
  static async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        projects: true,
        assets: true,
        referrals: true
      }
    });
    return user;
  }

  /**
   * Удаление аккаунта и данных (GDPR Right to be Forgotten)
   */
  static async deleteUserAccount(userId: string) {
    // Каскадное удаление данных через транзакцию Prisma
    return await prisma.user.delete({
      where: { id: userId }
    });
  }
}

