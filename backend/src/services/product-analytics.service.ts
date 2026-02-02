/**
 * Сервис для сбора анонимных данных об использовании функций
 * Product Analytics для принятия решений о развитии продукта
 */

import { v4 as uuidv4 } from 'uuid';

export interface AnalyticsEvent {
  id: string;
  userId?: string; // Опционально, может быть анонимным
  sessionId: string;
  eventType: string;
  eventName: string;
  properties: Record<string, any>;
  timestamp: Date;
  userAgent?: string;
  ip?: string; // Хэшированный IP для анонимности
  country?: string;
  platform: 'web' | 'mobile' | 'api';
}

export interface FeatureUsage {
  feature: string;
  usageCount: number;
  uniqueUsers: number;
  averageSessionDuration?: number;
  lastUsed?: Date;
}

export interface UserJourney {
  userId: string;
  events: Array<{
    eventName: string;
    timestamp: Date;
    properties?: Record<string, any>;
  }>;
  sessionDuration: number;
  conversionGoal?: string;
  conversionAchieved: boolean;
}

// Хранилище событий (в реальности - БД или аналитическая БД типа ClickHouse)
const events: AnalyticsEvent[] = [];

export class ProductAnalyticsService {
  /**
   * Регистрирует событие
   */
  static trackEvent(
    eventName: string,
    properties: Record<string, any> = {},
    options?: {
      userId?: string;
      sessionId?: string;
      userAgent?: string;
      ip?: string;
      platform?: 'web' | 'mobile' | 'api';
    }
  ): AnalyticsEvent {
    const event: AnalyticsEvent = {
      id: uuidv4(),
      userId: options?.userId,
      sessionId: options?.sessionId || uuidv4(),
      eventType: 'user_action',
      eventName,
      properties: this.sanitizeProperties(properties),
      timestamp: new Date(),
      userAgent: options?.userAgent,
      ip: options?.ip ? this.hashIP(options.ip) : undefined,
      platform: options?.platform || 'web',
    };

    events.push(event);

    // В реальности здесь был бы отправка в аналитическую систему (Amplitude, Mixpanel, etc.)
    console.log(`Analytics event tracked: ${eventName}`);

    return event;
  }

  /**
   * Регистрирует использование функции
   */
  static trackFeatureUsage(
    feature: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    this.trackEvent('feature_used', {
      feature,
      ...metadata,
    }, { userId });
  }

  /**
   * Регистрирует ошибку
   */
  static trackError(
    error: Error,
    context?: Record<string, any>,
    userId?: string
  ): void {
    this.trackEvent('error_occurred', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...context,
    }, { userId });
  }

  /**
   * Регистрирует конверсию (достижение цели)
   */
  static trackConversion(
    goal: string,
    value?: number,
    userId?: string
  ): void {
    this.trackEvent('conversion', {
      goal,
      value,
    }, { userId });
  }

  /**
   * Получает статистику использования функций
   */
  static getFeatureUsageStats(
    startDate?: Date,
    endDate?: Date
  ): FeatureUsage[] {
    let filtered = events;

    if (startDate) {
      filtered = filtered.filter((e) => e.timestamp >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((e) => e.timestamp <= endDate);
    }

    const featureMap = new Map<string, FeatureUsage>();

    filtered.forEach((event) => {
      if (event.eventName === 'feature_used' && event.properties.feature) {
        const feature = event.properties.feature as string;
        const existing = featureMap.get(feature) || {
          feature,
          usageCount: 0,
          uniqueUsers: new Set<string>(),
        };

        existing.usageCount++;
        if (event.userId) {
          (existing.uniqueUsers as any).add(event.userId);
        }

        featureMap.set(feature, existing);
      }
    });

    return Array.from(featureMap.values()).map((usage) => ({
      ...usage,
      uniqueUsers: (usage.uniqueUsers as any).size || 0,
    }));
  }

  /**
   * Получает топ используемых функций
   */
  static getTopFeatures(limit: number = 10): FeatureUsage[] {
    const stats = this.getFeatureUsageStats();
    return stats
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  /**
   * Получает воронку конверсий
   */
  static getConversionFunnel(
    steps: string[],
    startDate?: Date,
    endDate?: Date
  ): Array<{ step: string; count: number; conversionRate: number }> {
    let filtered = events;

    if (startDate) {
      filtered = filtered.filter((e) => e.timestamp >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((e) => e.timestamp <= endDate);
    }

    const stepCounts = new Map<string, number>();
    let previousStepCount = 0;

    steps.forEach((step, index) => {
      const stepEvents = filtered.filter((e) => e.eventName === step);
      const count = stepEvents.length;
      stepCounts.set(step, count);

      if (index === 0) {
        previousStepCount = count;
      }
    });

    return steps.map((step, index) => {
      const count = stepCounts.get(step) || 0;
      const conversionRate =
        index === 0 ? 100 : (count / previousStepCount) * 100;
      previousStepCount = count;

      return { step, count, conversionRate };
    });
  }

  /**
   * Получает retention пользователей
   */
  static getUserRetention(
    cohortDate: Date,
    periods: number = 7
  ): Array<{ period: number; retention: number }> {
    // Упрощенная реализация retention
    // В реальности нужна более сложная логика с группировкой по когортам
    const cohortUsers = new Set(
      events
        .filter((e) => e.userId && e.timestamp >= cohortDate)
        .map((e) => e.userId!)
    );

    const retention: Array<{ period: number; retention: number }> = [];

    for (let i = 0; i < periods; i++) {
      const periodStart = new Date(cohortDate);
      periodStart.setDate(periodStart.getDate() + i);
      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 1);

      const activeUsers = new Set(
        events
          .filter(
            (e) =>
              e.userId &&
              cohortUsers.has(e.userId) &&
              e.timestamp >= periodStart &&
              e.timestamp < periodEnd
          )
          .map((e) => e.userId!)
      );

      const retentionRate = cohortUsers.size > 0
        ? (activeUsers.size / cohortUsers.size) * 100
        : 0;

      retention.push({ period: i + 1, retention: retentionRate });
    }

    return retention;
  }

  /**
   * Очищает свойства от персональных данных
   */
  private static sanitizeProperties(properties: Record<string, any>): Record<string, any> {
    const sanitized = { ...properties };
    
    // Удаляем потенциально чувствительные данные
    delete sanitized.email;
    delete sanitized.password;
    delete sanitized.phone;
    delete sanitized.address;
    delete sanitized.creditCard;

    return sanitized;
  }

  /**
   * Хэширует IP адрес для анонимности
   */
  private static hashIP(ip: string): string {
    // Упрощенное хэширование (в реальности использовать crypto)
    return Buffer.from(ip).toString('base64').substring(0, 16);
  }

  /**
   * Экспортирует данные для анализа
   */
  static exportEvents(
    startDate?: Date,
    endDate?: Date,
    eventTypes?: string[]
  ): AnalyticsEvent[] {
    let filtered = events;

    if (startDate) {
      filtered = filtered.filter((e) => e.timestamp >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((e) => e.timestamp <= endDate);
    }
    if (eventTypes && eventTypes.length > 0) {
      filtered = filtered.filter((e) => eventTypes.includes(e.eventType));
    }

    return filtered;
  }
}

