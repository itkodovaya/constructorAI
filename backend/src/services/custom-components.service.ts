/**
 * Сервис для управления пользовательскими компонентами (Prisma Version)
 * Позволяет пользователям загружать и использовать свои React-компоненты
 */

import prisma from '../utils/prisma';
import { CustomComponent as PrismaCustomComponent } from '../generated/client';

export interface ComponentProp {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'image' | 'select';
  defaultValue?: any;
  required?: boolean;
  options?: string[]; // Для select типа
  label: string;
  description?: string;
}

export class CustomComponentsService {
  /**
   * Создание пользовательского компонента
   */
  static async createComponent(
    userId: string,
    data: any
  ): Promise<PrismaCustomComponent> {
    const component = await prisma.customComponent.create({
      data: {
        authorId: userId,
        name: data.name,
        description: data.description,
        category: data.category,
        code: data.code,
        props: JSON.stringify(data.props || []),
        isPublic: data.isPublic || false,
      }
    });
    return this.parseComponent(component);
  }

  /**
   * Получение компонента по ID
   */
  static async getComponent(id: string): Promise<PrismaCustomComponent | null> {
    const component = await prisma.customComponent.findUnique({
      where: { id }
    });
    return component ? this.parseComponent(component) : null;
  }

  /**
   * Получение компонентов пользователя
   */
  static async getUserComponents(userId: string): Promise<PrismaCustomComponent[]> {
    const components = await prisma.customComponent.findMany({
      where: { authorId: userId }
    });
    return components.map(c => this.parseComponent(c));
  }

  /**
   * Получение публичных компонентов
   */
  static async getPublicComponents(filters?: {
    category?: string;
    search?: string;
    tags?: string[];
    limit?: number;
  }): Promise<PrismaCustomComponent[]> {
    const components = await prisma.customComponent.findMany({
      where: {
        isPublic: true,
        category: filters?.category,
        OR: filters?.search ? [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ] : undefined
      },
      orderBy: { downloads: 'desc' },
      take: filters?.limit
    });
    return components.map(c => this.parseComponent(c));
  }

  /**
   * Обновление компонента
   */
  static async updateComponent(
    componentId: string,
    userId: string,
    updates: any
  ): Promise<PrismaCustomComponent | null> {
    const dataToUpdate = { ...updates };
    if (updates.props) dataToUpdate.props = JSON.stringify(updates.props);

    const updated = await prisma.customComponent.update({
      where: { id: componentId, authorId: userId },
      data: dataToUpdate
    });
    return this.parseComponent(updated);
  }

  /**
   * Удаление компонента
   */
  static async deleteComponent(componentId: string, userId: string): Promise<boolean> {
    try {
      await prisma.customComponent.delete({
        where: { id: componentId, authorId: userId }
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Установка компонента пользователем
   */
  static async installComponent(componentId: string, userId: string): Promise<boolean> {
    try {
      await prisma.customComponent.update({
        where: { id: componentId },
        data: {
          downloads: { increment: 1 }
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  private static parseComponent(component: any): any {
    return {
      ...component,
      props: component.props ? JSON.parse(component.props) : []
    };
  }

  /**
   * Валидация кода компонента
   */
  static validateComponentCode(code: string): {
    valid: boolean;
    errors?: string[];
  } {
    const errors: string[] = [];
    if (!code.trim()) errors.push('Code is empty');
    if (!code.includes('export') && !code.includes('module.exports')) {
      errors.push('Component must be exported');
    }
    const dangerousPatterns = [/eval\(/, /Function\(/, /innerHTML/, /dangerouslySetInnerHTML/, /document\.write/, /fetch\(/];
    dangerousPatterns.forEach(pattern => {
      if (pattern.test(code)) errors.push(`Dangerous pattern detected: ${pattern.source}`);
    });
    return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
  }
}
