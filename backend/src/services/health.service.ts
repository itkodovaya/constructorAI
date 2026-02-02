/**
 * Health check service для мониторинга состояния системы
 */

import fs from 'fs/promises';
import path from 'path';

export class HealthService {
  static async checkDatabase(): Promise<{ healthy: boolean; message: string }> {
    try {
      const dbPath = path.join(process.cwd(), 'data', 'projects.json');
      await fs.access(dbPath);
      return { healthy: true, message: 'Database accessible' };
    } catch (error) {
      return { healthy: false, message: 'Database not accessible' };
    }
  }

  static async checkDiskSpace(): Promise<{ healthy: boolean; freeSpace: number }> {
    try {
      // Упрощенная проверка (в реальности используйте системные утилиты)
      return { healthy: true, freeSpace: 1000000000 }; // 1GB
    } catch (error) {
      return { healthy: false, freeSpace: 0 };
    }
  }

  static async getSystemInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };
  }
}

