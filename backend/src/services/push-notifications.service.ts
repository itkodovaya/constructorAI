/**
 * Сервис для push-уведомлений
 * Поддерживает уведомления для приглашений, AI генерации, дедлайнов
 */

import { v4 as uuidv4 } from 'uuid';

export interface PushNotification {
  id: string;
  userId: string;
  type: 'invitation' | 'ai_generation' | 'deadline' | 'comment' | 'collaboration' | 'system';
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  types: {
    invitation: boolean;
    ai_generation: boolean;
    deadline: boolean;
    comment: boolean;
    collaboration: boolean;
    system: boolean;
  };
}

// Хранилище уведомлений (в реальности - БД)
const notifications: PushNotification[] = [];
const preferences: Map<string, NotificationPreferences> = new Map();

export class PushNotificationsService {
  /**
   * Отправляет уведомление пользователю
   */
  static async sendNotification(
    userId: string,
    type: PushNotification['type'],
    title: string,
    body: string,
    data?: Record<string, any>,
    expiresInHours?: number
  ): Promise<PushNotification> {
    const notification: PushNotification = {
      id: uuidv4(),
      userId,
      type,
      title,
      body,
      data,
      read: false,
      createdAt: new Date(),
      expiresAt: expiresInHours
        ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
        : undefined,
    };

    notifications.push(notification);

    // В реальности здесь был бы вызов Firebase Cloud Messaging или другого сервиса
    console.log(`Push notification sent to user ${userId}: ${title}`);

    return notification;
  }

  /**
   * Отправляет уведомление о приглашении в проект
   */
  static async sendInvitationNotification(
    userId: string,
    projectId: string,
    projectName: string,
    inviterName: string
  ): Promise<PushNotification> {
    return this.sendNotification(
      userId,
      'invitation',
      'Новое приглашение в проект',
      `${inviterName} пригласил вас в проект "${projectName}"`,
      {
        projectId,
        projectName,
        inviterName,
        action: 'view_invitation',
      },
      168 // 7 дней
    );
  }

  /**
   * Отправляет уведомление о завершении AI генерации
   */
  static async sendAIGenerationNotification(
    userId: string,
    projectId: string,
    generationType: string,
    status: 'completed' | 'failed'
  ): Promise<PushNotification> {
    const title =
      status === 'completed'
        ? 'AI генерация завершена'
        : 'Ошибка AI генерации';
    const body =
      status === 'completed'
        ? `Ваша ${generationType} готова к просмотру`
        : `Не удалось сгенерировать ${generationType}`;

    return this.sendNotification(
      userId,
      'ai_generation',
      title,
      body,
      {
        projectId,
        generationType,
        status,
        action: status === 'completed' ? 'view_result' : 'retry',
      },
      24 // 24 часа
    );
  }

  /**
   * Отправляет уведомление о приближающемся дедлайне
   */
  static async sendDeadlineNotification(
    userId: string,
    projectId: string,
    projectName: string,
    deadline: Date,
    hoursUntilDeadline: number
  ): Promise<PushNotification> {
    const title = 'Приближается дедлайн';
    const body = `До дедлайна проекта "${projectName}" осталось ${hoursUntilDeadline} часов`;

    return this.sendNotification(
      userId,
      'deadline',
      title,
      body,
      {
        projectId,
        projectName,
        deadline: deadline.toISOString(),
        hoursUntilDeadline,
        action: 'view_project',
      },
      hoursUntilDeadline
    );
  }

  /**
   * Отправляет уведомление о новом комментарии
   */
  static async sendCommentNotification(
    userId: string,
    projectId: string,
    commenterName: string,
    elementType: string
  ): Promise<PushNotification> {
    return this.sendNotification(
      userId,
      'comment',
      'Новый комментарий',
      `${commenterName} оставил комментарий на ${elementType}`,
      {
        projectId,
        commenterName,
        elementType,
        action: 'view_comment',
      },
      72 // 3 дня
    );
  }

  /**
   * Получает уведомления пользователя
   */
  static getUserNotifications(
    userId: string,
    options?: {
      unreadOnly?: boolean;
      type?: PushNotification['type'];
      limit?: number;
    }
  ): PushNotification[] {
    let filtered = notifications.filter((n) => n.userId === userId);

    // Фильтр по прочитанности
    if (options?.unreadOnly) {
      filtered = filtered.filter((n) => !n.read);
    }

    // Фильтр по типу
    if (options?.type) {
      filtered = filtered.filter((n) => n.type === options.type);
    }

    // Удаляем истекшие уведомления
    filtered = filtered.filter(
      (n) => !n.expiresAt || n.expiresAt > new Date()
    );

    // Сортировка по дате (новые первыми)
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Лимит
    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  /**
   * Отмечает уведомление как прочитанное
   */
  static markAsRead(notificationId: string, userId: string): boolean {
    const notification = notifications.find(
      (n) => n.id === notificationId && n.userId === userId
    );

    if (!notification) {
      return false;
    }

    notification.read = true;
    return true;
  }

  /**
   * Отмечает все уведомления пользователя как прочитанные
   */
  static markAllAsRead(userId: string): number {
    const userNotifications = notifications.filter((n) => n.userId === userId && !n.read);
    userNotifications.forEach((n) => (n.read = true));
    return userNotifications.length;
  }

  /**
   * Удаляет уведомление
   */
  static deleteNotification(notificationId: string, userId: string): boolean {
    const index = notifications.findIndex(
      (n) => n.id === notificationId && n.userId === userId
    );

    if (index === -1) {
      return false;
    }

    notifications.splice(index, 1);
    return true;
  }

  /**
   * Получает настройки уведомлений пользователя
   */
  static getPreferences(userId: string): NotificationPreferences {
    return (
      preferences.get(userId) || {
        userId,
        email: true,
        push: true,
        sms: false,
        types: {
          invitation: true,
          ai_generation: true,
          deadline: true,
          comment: true,
          collaboration: true,
          system: true,
        },
      }
    );
  }

  /**
   * Обновляет настройки уведомлений
   */
  static updatePreferences(
    userId: string,
    updates: Partial<NotificationPreferences>
  ): NotificationPreferences {
    const current = this.getPreferences(userId);
    const updated = { ...current, ...updates };
    preferences.set(userId, updated);
    return updated;
  }

  /**
   * Получает количество непрочитанных уведомлений
   */
  static getUnreadCount(userId: string): number {
    return this.getUserNotifications(userId, { unreadOnly: true }).length;
  }

  /**
   * Очищает старые уведомления (старше 30 дней)
   */
  static cleanupOldNotifications(): number {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const initialLength = notifications.length;
    const filtered = notifications.filter(
      (n) => n.createdAt > thirtyDaysAgo && (!n.expiresAt || n.expiresAt > new Date())
    );
    notifications.splice(0, notifications.length, ...filtered);
    return initialLength - notifications.length;
  }
}

// Периодическая очистка старых уведомлений (каждый час)
setInterval(() => {
  const deleted = PushNotificationsService.cleanupOldNotifications();
  if (deleted > 0) {
    console.log(`Cleaned up ${deleted} old notifications`);
  }
}, 60 * 60 * 1000);

