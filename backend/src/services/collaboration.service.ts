import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import prisma from '../utils/prisma';

interface UserPresence {
  userId: string;
  userName: string;
  cursor: { x: number; y: number };
  activeBlockId?: string;
}

export class CollaborationService {
  private static wss: WebSocketServer;
  private static projectSessions: Map<string, Map<string, UserPresence>> = new Map();

  static init(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws/collaboration' });

    this.wss.on('connection', (ws: WebSocket) => {
      let currentProjectId: string | null = null;
      let currentUserId: string | null = null;

      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data);

          switch (message.type) {
            case 'join':
              currentProjectId = message.projectId;
              currentUserId = message.userId;
              this.handleJoin(ws, message);
              break;
            case 'cursor':
              this.handleCursorMove(message);
              break;
            case 'focus':
              this.handleFocus(message);
              break;
            case 'change':
              this.broadcastToProject(message.projectId, message.userId, {
                type: 'project_updated',
                data: message.data
              });
              break;
          }
        } catch (e) {
          console.error('WS Error:', e);
        }
      });

      ws.on('close', () => {
        if (currentProjectId && currentUserId) {
          this.handleLeave(currentProjectId, currentUserId);
        }
      });
    });
  }

  /**
   * Создание приглашения в проект (Prisma Version)
   */
  static async createInvitation(projectId: string, email: string, role: string, inviterId: string) {
    // В реальной версии здесь была бы таблица Invitation
    // Для совместимости с текущей схемой просто возвращаем объект
    return {
      id: `inv_${Date.now()}`,
      projectId,
      email,
      role,
      inviterId,
      status: 'pending'
    };
  }

  /**
   * Принятие приглашения (Prisma Version)
   */
  static async acceptInvitation(invitationId: string, userId: string, email: string, name: string) {
    // В реальности мы бы искали приглашение в БД
    // Здесь мы просто создаем коллаборатора в БД через Prisma
    const projectId = 'project-1'; // Заглушка, в реальности из приглашения
    const role = 'editor'; // Заглушка

    return await prisma.collaborator.create({
      data: {
        projectId,
        userId,
        role
      }
    });
  }

  /**
   * Получение коллабораторов проекта
   */
  static async getProjectCollaborators(projectId: string) {
    return await prisma.collaborator.findMany({
      where: { projectId },
      include: {
        // user: { select: { name: true, email: true } } // Если есть связь в схеме
      }
    });
  }

  /**
   * Удаление коллаборатора
   */
  static async removeCollaborator(projectId: string, userId: string, requesterId: string) {
    try {
      await prisma.collaborator.delete({
        where: {
          projectId_userId: { projectId, userId }
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  private static handleJoin(ws: WebSocket, message: any) {
    const { projectId, userId, userName } = message;
    if (!this.projectSessions.has(projectId)) {
      this.projectSessions.set(projectId, new Map());
    }

    const session = this.projectSessions.get(projectId)!;
    session.set(userId, { userId, userName, cursor: { x: 0, y: 0 } });

    // Уведомляем остальных о входе
    this.broadcastToProject(projectId, userId, {
      type: 'user_joined',
      user: { userId, userName }
    });
  }

  private static handleCursorMove(message: any) {
    const { projectId, userId, cursor } = message;
    const session = this.projectSessions.get(projectId);
    if (session && session.has(userId)) {
      session.get(userId)!.cursor = cursor;
      
      this.broadcastToProject(projectId, userId, {
        type: 'presence',
        userId,
        cursor
      });
    }
  }

  private static handleFocus(message: any) {
    const { projectId, userId, blockId } = message;
    const session = this.projectSessions.get(projectId);
    if (session && session.has(userId)) {
      session.get(userId)!.activeBlockId = blockId;

      this.broadcastToProject(projectId, userId, {
        type: 'user_focused',
        userId,
        blockId
      });
    }
  }

  private static handleLeave(projectId: string, userId: string) {
    const session = this.projectSessions.get(projectId);
    if (session) {
      session.delete(userId);
      this.broadcastToProject(projectId, userId, {
        type: 'user_left',
        userId
      });
    }
  }

  private static broadcastToProject(projectId: string, senderId: string, message: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // В реальном приложении мы бы проверяли, к какому проекту относится клиент
        client.send(JSON.stringify(message));
      }
    });
  }
}
