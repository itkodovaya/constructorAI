/**
 * Сервис кэширования с поддержкой Redis
 * Fallback на in-memory кэш если Redis недоступен
 */

import { createClient, RedisClientType } from 'redis';

export interface CacheOptions {
  ttl?: number; // Time to live в секундах
  prefix?: string; // Префикс для ключей
}

class CacheService {
  private redisClient: RedisClientType | null = null;
  private memoryCache: Map<string, { value: any; expiresAt: number }> = new Map();
  private useMemoryFallback = false;
  private prefix = 'constructor:';

  /**
   * Инициализация Redis клиента
   */
  async initialize(): Promise<void> {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redisClient = createClient({ url: redisUrl });

      this.redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.useMemoryFallback = true;
      });

      await this.redisClient.connect();
      console.log('Redis connected successfully');
      this.useMemoryFallback = false;
    } catch (error) {
      console.warn('Redis not available, using memory cache fallback');
      this.useMemoryFallback = true;
    }
  }

  /**
   * Получить значение из кэша
   */
  async get<T>(key: string): Promise<T | null> {
    const fullKey = `${this.prefix}${key}`;

    if (this.useMemoryFallback || !this.redisClient) {
      return this.getFromMemory<T>(fullKey);
    }

    try {
      const value = await this.redisClient.get(fullKey);
      if (!value) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Redis get error:', error);
      return this.getFromMemory<T>(fullKey);
    }
  }

  /**
   * Установить значение в кэш
   */
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    const fullKey = `${this.prefix}${options?.prefix || ''}${key}`;
    const ttl = options?.ttl || 3600; // По умолчанию 1 час

    if (this.useMemoryFallback || !this.redisClient) {
      this.setInMemory(fullKey, value, ttl);
      return;
    }

    try {
      await this.redisClient.setEx(fullKey, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
      this.setInMemory(fullKey, value, ttl);
    }
  }

  /**
   * Удалить значение из кэша
   */
  async delete(key: string): Promise<void> {
    const fullKey = `${this.prefix}${key}`;

    if (this.useMemoryFallback || !this.redisClient) {
      this.memoryCache.delete(fullKey);
      return;
    }

    try {
      await this.redisClient.del(fullKey);
    } catch (error) {
      console.error('Redis delete error:', error);
      this.memoryCache.delete(fullKey);
    }
  }

  /**
   * Удалить все ключи по паттерну
   */
  async deletePattern(pattern: string): Promise<void> {
    const fullPattern = `${this.prefix}${pattern}`;

    if (this.useMemoryFallback || !this.redisClient) {
      // Удаление из памяти по паттерну
      for (const key of this.memoryCache.keys()) {
        if (this.matchPattern(key, fullPattern)) {
          this.memoryCache.delete(key);
        }
      }
      return;
    }

    try {
      const keys = await this.redisClient.keys(fullPattern);
      if (keys.length > 0) {
        await this.redisClient.del(keys);
      }
    } catch (error) {
      console.error('Redis deletePattern error:', error);
    }
  }

  /**
   * Проверить существование ключа
   */
  async exists(key: string): Promise<boolean> {
    const fullKey = `${this.prefix}${key}`;

    if (this.useMemoryFallback || !this.redisClient) {
      const cached = this.memoryCache.get(fullKey);
      return cached ? cached.expiresAt > Date.now() : false;
    }

    try {
      const result = await this.redisClient.exists(fullKey);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  /**
   * Получить значение из памяти
   */
  private getFromMemory<T>(key: string): T | null {
    const cached = this.memoryCache.get(key);
    if (!cached) {
      return null;
    }

    if (cached.expiresAt < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }

    return cached.value as T;
  }

  /**
   * Установить значение в память
   */
  private setInMemory(key: string, value: any, ttl: number): void {
    const expiresAt = Date.now() + ttl * 1000;
    this.memoryCache.set(key, { value, expiresAt });

    // Очистка истекших записей каждые 5 минут
    if (this.memoryCache.size % 100 === 0) {
      this.cleanupMemoryCache();
    }
  }

  /**
   * Очистка истекших записей из памяти
   */
  private cleanupMemoryCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.memoryCache.entries()) {
      if (cached.expiresAt < now) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Проверка соответствия ключа паттерну
   */
  private matchPattern(key: string, pattern: string): boolean {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    );
    return regex.test(key);
  }

  /**
   * Очистить весь кэш
   */
  async flush(): Promise<void> {
    if (this.useMemoryFallback || !this.redisClient) {
      this.memoryCache.clear();
      return;
    }

    try {
      await this.redisClient.flushDb();
    } catch (error) {
      console.error('Redis flush error:', error);
      this.memoryCache.clear();
    }
  }

  /**
   * Получить статистику кэша
   */
  async getStats(): Promise<{
    type: 'redis' | 'memory';
    size: number;
    keys: number;
  }> {
    if (this.useMemoryFallback || !this.redisClient) {
      return {
        type: 'memory',
        size: this.memoryCache.size,
        keys: this.memoryCache.size,
      };
    }

    try {
      const info = await this.redisClient.info('memory');
      const keys = await this.redisClient.dbSize();
      return {
        type: 'redis',
        size: 0, // Размер в Redis сложно получить
        keys,
      };
    } catch (error) {
      return {
        type: 'memory',
        size: this.memoryCache.size,
        keys: this.memoryCache.size,
      };
    }
  }
}

export const cacheService = new CacheService();

