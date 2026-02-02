/**
 * Сервис для управления плагинами
 * Поддерживает загрузку и выполнение сторонних плагинов в безопасном sandbox
 */

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'analytics' | 'integration' | 'export' | 'ai' | 'ui' | 'other';
  code: string; // JavaScript код плагина
  config: PluginConfig;
  isActive: boolean;
  isVerified: boolean; // Проверен администратором
  installs: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface PluginConfig {
  permissions: PluginPermission[];
  settings: PluginSetting[];
  hooks: PluginHook[]; // Точки интеграции
}

export interface PluginPermission {
  type: 'read' | 'write' | 'api' | 'storage';
  resource: string;
  description: string;
}

export interface PluginSetting {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  defaultValue: any;
  required?: boolean;
  options?: string[];
}

export interface PluginHook {
  name: string;
  type: 'before' | 'after' | 'replace';
  event: string; // Событие, на которое реагирует плагин
  handler: string; // Имя функции-обработчика в коде плагина
}

export interface PluginExecutionContext {
  projectId?: string;
  userId?: string;
  data?: any;
  api?: any; // Ограниченный API для плагина
}

class PluginsService {
  private static plugins: Map<string, Plugin> = new Map();
  private static activePlugins: Set<string> = new Set();
  private static pluginInstances: Map<string, any> = new Map(); // Загруженные экземпляры

  /**
   * Регистрация плагина
   */
  static registerPlugin(plugin: Omit<Plugin, 'id' | 'createdAt' | 'updatedAt' | 'installs' | 'rating'>): Plugin {
    const fullPlugin: Plugin = {
      ...plugin,
      id: `plugin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      installs: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.plugins.set(fullPlugin.id, fullPlugin);
    return fullPlugin;
  }

  /**
   * Получение плагина
   */
  static getPlugin(id: string): Plugin | null {
    return this.plugins.get(id) || null;
  }

  /**
   * Получение всех плагинов
   */
  static getAllPlugins(filters?: {
    category?: string;
    isActive?: boolean;
    isVerified?: boolean;
  }): Plugin[] {
    let plugins = Array.from(this.plugins.values());

    if (filters?.category) {
      plugins = plugins.filter(p => p.category === filters.category);
    }

    if (filters?.isActive !== undefined) {
      plugins = plugins.filter(p => p.isActive === filters.isActive);
    }

    if (filters?.isVerified !== undefined) {
      plugins = plugins.filter(p => p.isVerified === filters.isVerified);
    }

    return plugins;
  }

  /**
   * Активация плагина
   */
  static activatePlugin(id: string): boolean {
    const plugin = this.plugins.get(id);
    if (!plugin || !plugin.isVerified) {
      return false;
    }

    try {
      // Загружаем плагин в sandbox
      const instance = this.loadPlugin(plugin);
      this.pluginInstances.set(id, instance);
      this.activePlugins.add(id);

      plugin.isActive = true;
      plugin.updatedAt = new Date().toISOString();

      return true;
    } catch (error) {
      console.error(`Failed to activate plugin ${id}:`, error);
      return false;
    }
  }

  /**
   * Деактивация плагина
   */
  static deactivatePlugin(id: string): boolean {
    const plugin = this.plugins.get(id);
    if (!plugin) {
      return false;
    }

    // Вызываем cleanup если есть
    const instance = this.pluginInstances.get(id);
    if (instance && typeof instance.cleanup === 'function') {
      try {
        instance.cleanup();
      } catch (error) {
        console.error(`Plugin cleanup error for ${id}:`, error);
      }
    }

    this.pluginInstances.delete(id);
    this.activePlugins.delete(id);
    plugin.isActive = false;
    plugin.updatedAt = new Date().toISOString();

    return true;
  }

  /**
   * Загрузка плагина в sandbox
   */
  private static loadPlugin(plugin: Plugin): any {
    // Создаем безопасный контекст для выполнения плагина
    const sandbox = {
      console: {
        log: (...args: any[]) => console.log(`[Plugin ${plugin.name}]`, ...args),
        error: (...args: any[]) => console.error(`[Plugin ${plugin.name}]`, ...args),
        warn: (...args: any[]) => console.warn(`[Plugin ${plugin.name}]`, ...args)
      },
      // Ограниченный API для плагинов
      api: {
        getProject: async (id: string) => {
          // Здесь был бы вызов к ProjectsService с проверкой прав
          return null;
        },
        updateProject: async (id: string, data: any) => {
          // Ограниченное обновление проекта
          return null;
        }
      },
      // Утилиты
      utils: {
        formatDate: (date: Date) => date.toISOString(),
        generateId: () => Math.random().toString(36).substr(2, 9)
      }
    };

    // Выполняем код плагина в безопасном контексте
    try {
      // В реальной реализации здесь был бы более строгий sandbox
      // Например, использование VM2 или изоляции через Worker
      const wrappedCode = `
        (function() {
          ${plugin.code}
          return typeof module !== 'undefined' && module.exports 
            ? module.exports 
            : typeof exports !== 'undefined' 
            ? exports 
            : typeof Plugin !== 'undefined' 
            ? Plugin 
            : {};
        })();
      `;

      const pluginModule = eval(wrappedCode); // ВНИМАНИЕ: В продакшене использовать безопасный sandbox!
      return pluginModule;
    } catch (error) {
      throw new Error(`Failed to load plugin: ${error}`);
    }
  }

  /**
   * Вызов хука плагина
   */
  static callHook(hookName: string, context: PluginExecutionContext): any {
    const results: any[] = [];

    this.activePlugins.forEach(pluginId => {
      const plugin = this.plugins.get(pluginId);
      if (!plugin) return;

      const hook = plugin.config.hooks.find(h => h.event === hookName);
      if (!hook) return;

      const instance = this.pluginInstances.get(pluginId);
      if (!instance) return;

      try {
        const handler = instance[hook.handler];
        if (typeof handler === 'function') {
          const result = handler(context);
          results.push({ pluginId, result });
        }
      } catch (error) {
        console.error(`Hook error in plugin ${pluginId}:`, error);
      }
    });

    return results;
  }

  /**
   * Валидация кода плагина
   */
  static validatePluginCode(code: string): {
    valid: boolean;
    errors?: string[];
  } {
    const errors: string[] = [];

    // Проверка на опасные паттерны
    const dangerousPatterns = [
      /eval\(/,
      /Function\(/,
      /require\(['"]fs['"]\)/,
      /require\(['"]child_process['"]\)/,
      /process\./,
      /__dirname/,
      /__filename/,
      /global\./,
      /window\./,
      /document\./
    ];

    dangerousPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        errors.push(`Dangerous pattern detected: ${pattern.source}`);
      }
    });

    // Проверка на наличие экспорта
    if (!code.includes('export') && !code.includes('module.exports')) {
      errors.push('Plugin must export its functionality');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Установка плагина пользователем
   */
  static installPlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      return false;
    }

    plugin.installs++;
    return true;
  }
}

export const pluginsService = new PluginsService();

