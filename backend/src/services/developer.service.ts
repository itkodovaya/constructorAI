/**
 * Сервис для разработчиков и открытого API (Stage 5.7)
 */

import prisma from '../utils/prisma';
import { v4 as uuidv4 } from 'uuid';

export interface ApiKeyConfig {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  createdAt: string;
}

export class DeveloperApiService {
  /**
   * Генерация нового API-ключа
   */
  static async generateKey(userId: string, name: string, scopes: string[] = ['read', 'write']) {
    const key = `sk_live_${uuidv4().replace(/-/g, '')}`;
    const keyConfig: ApiKeyConfig = {
      id: `key_${Date.now()}`,
      name,
      key,
      scopes,
      createdAt: new Date().toISOString()
    };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const keys = (user?.plan === 'business' ? (user as any).apiKeys : []) || [];

    await prisma.user.update({
      where: { id: userId },
      data: {
        // Заглушка: имитируем сохранение ключа в метаданных пользователя
        name: userId 
      }
    });

    return keyConfig;
  }

  /**
   * Валидация API-ключа (Middleware)
   */
  static async validateKey(key: string) {
    // В реальности: поиск ключа в БД
    return key.startsWith('sk_live_');
  }
}

export class PluginMarketplaceService {
  /**
   * Отправка плагина на модерацию
   */
  static async submitPlugin(userId: string, pluginData: any) {
    return await prisma.customComponent.create({
      data: {
        authorId: userId,
        name: pluginData.name,
        description: pluginData.description,
        category: 'plugin',
        code: pluginData.code,
        isPublic: false, // Ожидает проверки безопасности
        props: {
          version: pluginData.version,
          permissions: pluginData.permissions,
          status: 'under_review'
        } as any
      }
    });
  }
}

