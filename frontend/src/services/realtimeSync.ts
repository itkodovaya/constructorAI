/**
 * Realtime синхронизация для совместного редактирования
 * Клиентская часть WebSocket соединения
 */

export interface SyncMessage {
  type: 'cursor' | 'edit' | 'selection' | 'lock' | 'unlock' | 'presence' | 'presence_update' | 'user_left' | 'connected' | 'error';
  projectId?: string;
  userId?: string;
  userName?: string;
  clientId?: string;
  data?: any;
  timestamp?: number;
}

export interface CursorPosition {
  x: number;
  y: number;
  elementId?: string;
}

export interface Presence {
  userId: string;
  userName: string;
  cursor?: CursorPosition;
  activeElements?: string[];
}

// Экспорт типа для использования в TypeScript
export type { Presence as PresenceType };

type MessageHandler = (message: SyncMessage) => void;

export class RealtimeSyncClient {
  private ws: WebSocket | null = null;
  private url: string;
  private projectId: string | null = null;
  private userId: string | null = null;
  private userName: string | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;

  constructor(apiUrl: string = 'http://localhost:3001') {
    // Преобразуем HTTP URL в WebSocket URL
    this.url = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws';
  }

  /**
   * Подключение к WebSocket серверу
   */
  connect(projectId: string, userId: string, userName: string) {
    this.projectId = projectId;
    this.userId = userId;
    this.userName = userName;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[RealtimeSync] Connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected', {});
      };

      this.ws.onmessage = (event) => {
        try {
          const message: SyncMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('[RealtimeSync] Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[RealtimeSync] WebSocket error:', error);
        this.emit('error', { error });
      };

      this.ws.onclose = () => {
        console.log('[RealtimeSync] Disconnected');
        this.isConnected = false;
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('[RealtimeSync] Connection error:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Попытка переподключения
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[RealtimeSync] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[RealtimeSync] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (this.projectId && this.userId && this.userName) {
        this.connect(this.projectId, this.userId, this.userName);
      }
    }, delay);
  }

  /**
   * Отправка сообщения
   */
  send(type: SyncMessage['type'], data?: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[RealtimeSync] Cannot send message: not connected');
      return;
    }

    const message: SyncMessage = {
      type,
      projectId: this.projectId || undefined,
      userId: this.userId || undefined,
      userName: this.userName || undefined,
      data,
      timestamp: Date.now()
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Отправка позиции курсора
   */
  sendCursor(cursor: CursorPosition) {
    this.send('cursor', { cursor });
  }

  /**
   * Отправка операции редактирования
   */
  sendEdit(operation: { elementId: string; operation: 'add' | 'update' | 'delete'; data?: any }) {
    this.send('edit', operation);
  }

  /**
   * Отправка выделения
   */
  sendSelection(elementIds: string[]) {
    this.send('selection', { elementIds });
  }

  /**
   * Блокировка элемента
   */
  lockElement(elementId: string) {
    this.send('lock', { elementId });
  }

  /**
   * Разблокировка элемента
   */
  unlockElement(elementId: string) {
    this.send('unlock', { elementId });
  }

  /**
   * Обновление присутствия
   */
  updatePresence(cursor?: CursorPosition, activeElements?: string[]) {
    this.send('presence', { cursor, activeElements });
  }

  /**
   * Обработка входящих сообщений
   */
  private handleMessage(message: SyncMessage) {
    const handlers = this.handlers.get(message.type) || [];
    handlers.forEach(handler => handler(message));

    // Также вызываем общий обработчик
    const allHandlers = this.handlers.get('*') || [];
    allHandlers.forEach(handler => handler(message));
  }

  /**
   * Подписка на сообщения определенного типа
   */
  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  /**
   * Отписка от сообщений
   */
  off(type: string, handler: MessageHandler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Эмиссия события (для внутреннего использования)
   */
  private emit(type: string, data: any) {
    const handlers = this.handlers.get(type) || [];
    handlers.forEach(handler => handler({ type, ...data } as SyncMessage));
  }

  /**
   * Отключение
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.projectId = null;
    this.userId = null;
    this.userName = null;
    this.handlers.clear();
  }

  /**
   * Проверка состояния подключения
   */
  get connected(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let syncClientInstance: RealtimeSyncClient | null = null;

export function getRealtimeSyncClient(): RealtimeSyncClient {
  if (!syncClientInstance) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    syncClientInstance = new RealtimeSyncClient(apiUrl.replace('/api', ''));
  }
  return syncClientInstance;
}

