/**
 * Realtime синхронизация для совместного редактирования
 * Использует WebSockets для синхронизации изменений в реальном времени
 */

import WebSocket from 'ws';

export interface SyncMessage {
  type: 'cursor' | 'edit' | 'selection' | 'lock' | 'unlock' | 'presence';
  projectId: string;
  userId: string;
  userName: string;
  data: any;
  timestamp: number;
}

export interface CursorPosition {
  x: number;
  y: number;
  elementId?: string;
}

export interface EditOperation {
  elementId: string;
  operation: 'add' | 'update' | 'delete';
  data?: any;
}

export interface Selection {
  elementIds: string[];
}

export interface Presence {
  userId: string;
  userName: string;
  cursor?: CursorPosition;
  activeElements?: string[];
}

class RealtimeSyncService {
  private wss: WebSocket.Server | null = null;
  private clients: Map<string, WebSocket> = new Map();
  private projectRooms: Map<string, Set<string>> = new Map(); // projectId -> Set<clientId>
  private userPresence: Map<string, Presence> = new Map(); // userId -> Presence
  private elementLocks: Map<string, string> = new Map(); // elementId -> userId

  /**
   * Инициализация WebSocket сервера
   */
  initialize(server: any) {
    this.wss = new WebSocket.Server({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket, req: any) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);

      console.log(`[RealtimeSync] Client connected: ${clientId}`);

      ws.on('message', (message: string) => {
        try {
          const syncMessage: SyncMessage = JSON.parse(message);
          this.handleMessage(clientId, syncMessage);
        } catch (error) {
          console.error('[RealtimeSync] Error parsing message:', error);
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(clientId);
      });

      ws.on('error', (error) => {
        console.error('[RealtimeSync] WebSocket error:', error);
        this.handleDisconnect(clientId);
      });

      // Отправляем приветственное сообщение
      ws.send(JSON.stringify({
        type: 'connected',
        clientId,
        timestamp: Date.now()
      }));
    });

    console.log('[RealtimeSync] WebSocket server initialized on /ws');
  }

  /**
   * Обработка входящих сообщений
   */
  private handleMessage(clientId: string, message: SyncMessage) {
    const { type, projectId, userId, userName, data } = message;

    // Добавляем клиента в комнату проекта
    if (projectId) {
      if (!this.projectRooms.has(projectId)) {
        this.projectRooms.set(projectId, new Set());
      }
      this.projectRooms.get(projectId)!.add(clientId);
    }

    // Обновляем присутствие пользователя
    if (userId) {
      this.userPresence.set(userId, {
        userId,
        userName: userName || 'Unknown',
        cursor: data?.cursor,
        activeElements: data?.activeElements
      });
    }

    switch (type) {
      case 'cursor':
        this.broadcastToProject(projectId, {
          ...message,
          clientId,
          timestamp: Date.now()
        }, clientId);
        break;

      case 'edit':
        this.handleEdit(projectId, userId, data);
        break;

      case 'selection':
        this.broadcastToProject(projectId, {
          ...message,
          clientId,
          timestamp: Date.now()
        }, clientId);
        break;

      case 'lock':
        this.handleLock(projectId, userId, data.elementId);
        break;

      case 'unlock':
        this.handleUnlock(projectId, userId, data.elementId);
        break;

      case 'presence':
        this.broadcastToProject(projectId, {
          type: 'presence_update',
          projectId,
          presence: Array.from(this.userPresence.values()),
          timestamp: Date.now()
        });
        break;
    }
  }

  /**
   * Обработка редактирования
   */
  private handleEdit(projectId: string, userId: string, operation: EditOperation) {
    // Проверяем блокировку элемента
    const lockOwner = this.elementLocks.get(operation.elementId);
    if (lockOwner && lockOwner !== userId) {
      // Отправляем ошибку пользователю
      const client = this.findClientByUserId(userId);
      if (client) {
        client.send(JSON.stringify({
          type: 'error',
          message: 'Element is locked by another user',
          elementId: operation.elementId
        }));
      }
      return;
    }

    // Блокируем элемент на время редактирования
    if (operation.operation === 'add' || operation.operation === 'update') {
      this.elementLocks.set(operation.elementId, userId);
    }

    // Рассылаем изменение всем участникам проекта
    this.broadcastToProject(projectId, {
      type: 'edit',
      projectId,
      userId,
      data: operation,
      timestamp: Date.now()
    });
  }

  /**
   * Обработка блокировки элемента
   */
  private handleLock(projectId: string, userId: string, elementId: string) {
    const currentLock = this.elementLocks.get(elementId);
    if (currentLock && currentLock !== userId) {
      return; // Элемент уже заблокирован другим пользователем
    }

    this.elementLocks.set(elementId, userId);
    this.broadcastToProject(projectId, {
      type: 'lock',
      projectId,
      userId,
      data: { elementId },
      timestamp: Date.now()
    });
  }

  /**
   * Обработка разблокировки элемента
   */
  private handleUnlock(projectId: string, userId: string, elementId: string) {
    const lockOwner = this.elementLocks.get(elementId);
    if (lockOwner === userId) {
      this.elementLocks.delete(elementId);
      this.broadcastToProject(projectId, {
        type: 'unlock',
        projectId,
        userId,
        data: { elementId },
        timestamp: Date.now()
      });
    }
  }

  /**
   * Рассылка сообщения всем участникам проекта
   */
  private broadcastToProject(projectId: string, message: any, excludeClientId?: string) {
    const room = this.projectRooms.get(projectId);
    if (!room) return;

    const messageStr = JSON.stringify(message);
    room.forEach(clientId => {
      if (clientId === excludeClientId) return;
      const client = this.clients.get(clientId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  /**
   * Поиск клиента по userId
   */
  private findClientByUserId(userId: string): WebSocket | null {
    // В реальной реализации нужно хранить маппинг userId -> clientId
    // Для упрощения возвращаем null
    return null;
  }

  /**
   * Обработка отключения клиента
   */
  private handleDisconnect(clientId: string) {
    console.log(`[RealtimeSync] Client disconnected: ${clientId}`);

    // Удаляем клиента из всех комнат
    this.projectRooms.forEach((room, projectId) => {
      if (room.has(clientId)) {
        room.delete(clientId);
        
        // Разблокируем все элементы, заблокированные этим клиентом
        this.elementLocks.forEach((lockedUserId, elementId) => {
          // В реальной реализации нужно отслеживать userId клиента
          // Для упрощения просто очищаем все блокировки при отключении
        });

        // Уведомляем остальных участников об уходе
        this.broadcastToProject(projectId, {
          type: 'user_left',
          projectId,
          clientId,
          timestamp: Date.now()
        });
      }
    });

    this.clients.delete(clientId);
  }

  /**
   * Генерация уникального ID клиента
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Получение списка активных пользователей в проекте
   */
  getActiveUsers(projectId: string): Presence[] {
    const room = this.projectRooms.get(projectId);
    if (!room) return [];

    return Array.from(this.userPresence.values()).filter(presence => {
      // В реальной реализации нужно проверять, что пользователь в комнате
      return true;
    });
  }

  /**
   * Получение заблокированных элементов
   */
  getLockedElements(projectId: string): Map<string, string> {
    return new Map(this.elementLocks);
  }
}

export const realtimeSyncService = new RealtimeSyncService();

