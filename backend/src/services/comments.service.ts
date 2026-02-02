/**
 * Сервис для управления комментариями (Prisma Version)
 */

import prisma from '../utils/prisma';
import { Comment as PrismaComment } from '../generated/client';

export class CommentsService {
  /**
   * Получение комментариев проекта
   */
  static async getComments(projectId: string, elementId?: string): Promise<PrismaComment[]> {
    const comments = await prisma.comment.findMany({
      where: {
        projectId,
        elementId: elementId || undefined,
        parentId: null
      },
      include: {
        user: { select: { name: true, email: true } },
        replies: {
          include: { user: { select: { name: true, email: true } } }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return comments.map(c => this.parseComment(c));
  }

  /**
   * Добавление комментария
   */
  static async addComment(data: any): Promise<PrismaComment> {
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        projectId: data.projectId,
        userId: data.userId,
        elementId: data.elementId,
        elementType: data.elementType,
        position: data.position ? JSON.stringify(data.position) : null,
        parentId: data.parentId
      }
    });
    return this.parseComment(comment);
  }

  /**
   * Решение комментария
   */
  static async resolveComment(id: string): Promise<PrismaComment> {
    const updated = await prisma.comment.update({
      where: { id },
      data: { resolved: true }
    });
    return this.parseComment(updated);
  }

  /**
   * Удаление комментария
   */
  static async deleteComment(id: string): Promise<boolean> {
    try {
      await prisma.comment.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  private static parseComment(comment: any): any {
    return {
      ...comment,
      position: comment.position ? JSON.parse(comment.position) : null,
      replies: comment.replies ? comment.replies.map((r: any) => this.parseComment(r)) : []
    };
  }
}
