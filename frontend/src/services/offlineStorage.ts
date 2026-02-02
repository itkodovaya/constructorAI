/**
 * Офлайн хранилище для работы без интернета
 * Использует IndexedDB для локального сохранения данных
 */

interface OfflineChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string; // 'project' | 'block' | 'comment' | etc.
  entityId: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

class OfflineStorage {
  private dbName = 'ConstructorAI';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private changesStore = 'changes';
  private projectsStore = 'projects';
  private isOnline = navigator.onLine;

  /**
   * Инициализация IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.setupOnlineListeners();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store для изменений
        if (!db.objectStoreNames.contains(this.changesStore)) {
          const changesStore = db.createObjectStore(this.changesStore, { keyPath: 'id' });
          changesStore.createIndex('synced', 'synced', { unique: false });
          changesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store для проектов
        if (!db.objectStoreNames.contains(this.projectsStore)) {
          db.createObjectStore(this.projectsStore, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Настройка слушателей онлайн/офлайн статуса
   */
  private setupOnlineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncChanges();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Сохранение проекта локально
   */
  async saveProject(project: any): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.projectsStore], 'readwrite');
      const store = transaction.objectStore(this.projectsStore);
      const request = store.put({ ...project, savedAt: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save project'));
    });
  }

  /**
   * Получение проекта из локального хранилища
   */
  async getProject(projectId: string): Promise<any | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.projectsStore], 'readonly');
      const store = transaction.objectStore(this.projectsStore);
      const request = store.get(projectId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(new Error('Failed to get project'));
    });
  }

  /**
   * Получение всех локальных проектов
   */
  async getAllProjects(): Promise<any[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.projectsStore], 'readonly');
      const store = transaction.objectStore(this.projectsStore);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => reject(new Error('Failed to get projects'));
    });
  }

  /**
   * Сохранение изменения для последующей синхронизации
   */
  async saveChange(change: Omit<OfflineChange, 'id' | 'synced' | 'timestamp'>): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    const offlineChange: OfflineChange = {
      ...change,
      id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      synced: false,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.changesStore], 'readwrite');
      const store = transaction.objectStore(this.changesStore);
      const request = store.add(offlineChange);

      request.onsuccess = () => {
        // Если онлайн, сразу пытаемся синхронизировать
        if (this.isOnline) {
          this.syncChanges();
        }
        resolve();
      };
      request.onerror = () => reject(new Error('Failed to save change'));
    });
  }

  /**
   * Получение несинхронизированных изменений
   */
  async getUnsyncedChanges(): Promise<OfflineChange[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.changesStore], 'readonly');
      const store = transaction.objectStore(this.changesStore);
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => reject(new Error('Failed to get changes'));
    });
  }

  /**
   * Отметка изменения как синхронизированного
   */
  async markChangeAsSynced(changeId: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.changesStore], 'readwrite');
      const store = transaction.objectStore(this.changesStore);
      const getRequest = store.get(changeId);

      getRequest.onsuccess = () => {
        const change = getRequest.result;
        if (change) {
          change.synced = true;
          const putRequest = store.put(change);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(new Error('Failed to mark as synced'));
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(new Error('Failed to get change'));
    });
  }

  /**
   * Удаление синхронизированных изменений
   */
  async deleteSyncedChanges(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.changesStore], 'readwrite');
      const store = transaction.objectStore(this.changesStore);
      const index = store.index('synced');
      const request = index.openCursor(IDBKeyRange.only(true));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(new Error('Failed to delete synced changes'));
    });
  }

  /**
   * Синхронизация изменений с сервером
   */
  async syncChanges(): Promise<void> {
    if (!this.isOnline) {
      return;
    }

    const unsyncedChanges = await this.getUnsyncedChanges();
    
    for (const change of unsyncedChanges) {
      try {
        // Здесь должна быть логика отправки на сервер
        // В зависимости от типа изменения вызываем соответствующий API метод
        await this.applyChangeToServer(change);
        await this.markChangeAsSynced(change.id);
      } catch (error) {
        console.error('Failed to sync change:', error);
        // Оставляем изменение несинхронизированным для повторной попытки
      }
    }

    // Удаляем старые синхронизированные изменения
    await this.deleteSyncedChanges();
  }

  /**
   * Применение изменения на сервере
   */
  private async applyChangeToServer(change: OfflineChange): Promise<void> {
    const { api } = await import('./api');

    switch (change.type) {
      case 'create':
        if (change.entity === 'project') {
          await api.createProject(change.data);
        }
        break;
      case 'update':
        if (change.entity === 'project') {
          await api.updateProject(change.entityId, change.data);
        }
        break;
      case 'delete':
        if (change.entity === 'project') {
          await api.deleteProject(change.entityId);
        }
        break;
    }
  }

  /**
   * Проверка онлайн статуса
   */
  get online(): boolean {
    return this.isOnline;
  }

  /**
   * Очистка всех данных
   */
  async clear(): Promise<void> {
    if (!this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.projectsStore, this.changesStore], 'readwrite');
      
      transaction.objectStore(this.projectsStore).clear();
      transaction.objectStore(this.changesStore).clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new Error('Failed to clear storage'));
    });
  }
}

export const offlineStorage = new OfflineStorage();

// Инициализация при загрузке модуля
offlineStorage.init().catch(console.error);

