/**
 * Audit Log Service - Система тотального логирования административных действий
 * Обеспечивает соответствие требованиям безопасности Enterprise сегмента
 */

import prisma from '../utils/prisma';

export class AuditLogService {
  /**
   * Запись нового события в лог аудита
   */
  static async log(userId: string, action: string, resource: string, resourceId?: string, details?: any, req?: any) {
    return await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        details: details ? JSON.stringify(details) : null,
        ip: req?.ip,
        userAgent: req?.headers['user-agent']
      }
    });
  }

  /**
   * Получение логов организации
   */
  static async getOrganizationLogs(organizationId: string, limit: number = 100) {
    const logs = await prisma.auditLog.findMany({
      where: {
        user: { organizationId }
      },
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return logs.map(log => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null
    }));
  }
}
