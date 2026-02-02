/**
 * Сервис для управления AI Flow (цепочками AI действий)
 * Позволяет создавать сложные рабочие процессы на базе локальных моделей
 */

import prisma from '../utils/prisma';
import { AIService } from './ai.service';

export interface FlowNode {
  id: string;
  type: 'trigger' | 'ai_text' | 'ai_image' | 'condition' | 'action' | 'variable' | 'loop';
  config: any;
}

export interface FlowEdge {
  source: string;
  target: string;
  conditionValue?: any; // Для переходов по условиям
}

export class AIFlowService {
  /**
   * Создание нового флоу
   */
  static async createFlow(userId: string, data: any) {
    return await prisma.aiFlow.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        nodes: data.nodes || [],
        edges: data.edges || []
      }
    });
  }

  /**
   * Получение флоу пользователя
   */
  static async getUserFlows(userId: string) {
    return await prisma.aiFlow.findMany({
      where: { userId }
    });
  }

  /**
   * Выполнение флоу с поддержкой логики
   */
  static async executeFlow(flowId: string, initialInput: any) {
    const flow = await prisma.aiFlow.findUnique({ where: { id: flowId } });
    if (!flow) throw new Error('Flow not found');

    const nodes = flow.nodes as any as FlowNode[];
    const edges = flow.edges as any as FlowEdge[];

    const context: Record<string, any> = { input: initialInput };
    const results: any = {};

    // Находим стартовую ноду (trigger)
    let currentNode = nodes.find(n => n.type === 'trigger');
    if (!currentNode) currentNode = nodes[0];

    while (currentNode) {
      results[currentNode.id] = await this.executeNode(currentNode, context);
      
      // Обновляем контекст если это нода с переменной
      if (currentNode.type === 'variable') {
        context[currentNode.config.key] = results[currentNode.id];
      }

      // Ищем следующую ноду
      const nextEdge = edges.find(e => {
        if (currentNode!.type === 'condition') {
          return e.source === currentNode!.id && e.conditionValue === results[currentNode!.id];
        }
        return e.source === currentNode!.id;
      });

      if (!nextEdge) break;
      currentNode = nodes.find(n => n.id === nextEdge.target);
    }

    return results;
  }

  private static async executeNode(node: FlowNode, context: any) {
    switch (node.type) {
      case 'ai_text':
        const prompt = this.resolveVariables(node.config.prompt, context);
        return await AIService.generateText(prompt);
      
      case 'ai_image':
        const imgPrompt = this.resolveVariables(node.config.prompt, context);
        return await AIService.generateImage(imgPrompt);

      case 'condition':
        const val = this.resolveVariables(node.config.expression, context);
        // Простая оценка логики (mock)
        return val === node.config.expectedValue;

      case 'variable':
        return this.resolveVariables(node.config.value, context);

      default:
        return context.input;
    }
  }

  private static resolveVariables(text: string, context: any): string {
    if (typeof text !== 'string') return text;
    return text.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      return context[key.trim()] || '';
    });
  }
}

