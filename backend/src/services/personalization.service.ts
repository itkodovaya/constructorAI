/**
 * Сервис гиперперсонализации контента (Dynamic Content Engine)
 */

import prisma from '../utils/prisma';

export interface PersonalizationRule {
  id: string;
  name: string;
  condition: {
    type: 'utm_source' | 'geo' | 'device' | 'behavior';
    operator: 'equals' | 'contains' | 'in';
    value: string;
  };
  replacement: {
    blockId: string;
    content: any;
  };
}

export class PersonalizationService {
  /**
   * Получение правил для проекта
   */
  static async getRules(projectId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    return (project?.brandAssets as any)?.personalizationRules || [];
  }

  /**
   * Добавление нового правила персонализации
   */
  static async addRule(projectId: string, rule: Omit<PersonalizationRule, 'id'>) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    const rules = (project?.brandAssets as any)?.personalizationRules || [];
    
    const newRule = {
      id: `rule_${Date.now()}`,
      ...rule,
      active: true
    };

    await prisma.project.update({
      where: { id: projectId },
      data: {
        brandAssets: {
          ...(project?.brandAssets as any),
          personalizationRules: [...rules, newRule]
        } as any
      }
    });

    return newRule;
  }

  /**
   * Логика подбора контента под контекст посетителя (Edge-ready)
   */
  static matchContent(context: any, rules: PersonalizationRule[]) {
    for (const rule of rules) {
      const { type, operator, value } = rule.condition;
      const visitorValue = context[type];

      if (operator === 'equals' && visitorValue === value) return rule.replacement;
      if (operator === 'contains' && visitorValue?.includes(value)) return rule.replacement;
    }
    return null; // Используем базовый контент
  }
}

