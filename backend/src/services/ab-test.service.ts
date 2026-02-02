/**
 * Сервис для управления A/B тестами
 * Позволяет создавать варианты страниц и отслеживать конверсию
 */

import { v4 as uuidv4 } from 'uuid';

export interface ABTest {
  id: string;
  projectId: string;
  name: string;
  description: string;
  variants: ABVariant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: string;
  endDate?: string;
  trafficSplit: number; // Процент трафика на вариант B (0-100)
  goal: ABGoal;
  createdAt: string;
  updatedAt: string;
}

export interface ABVariant {
  id: string;
  name: string; // 'A' или 'B'
  description: string;
  pageId: string; // ID страницы проекта
  visitors: number;
  conversions: number;
  conversionRate: number;
}

export interface ABGoal {
  type: 'click' | 'form_submit' | 'purchase' | 'time_on_page' | 'scroll_depth' | 'custom';
  selector?: string; // CSS селектор для цели
  value?: number; // Значение для числовых целей (время в секундах, глубина прокрутки в %)
  customEvent?: string; // Имя кастомного события
}

export interface ABTestResult {
  testId: string;
  variantA: {
    visitors: number;
    conversions: number;
    conversionRate: number;
  };
  variantB: {
    visitors: number;
    conversions: number;
    conversionRate: number;
  };
  improvement: number; // Процент улучшения варианта B относительно A
  statisticalSignificance: number; // Статистическая значимость (0-1)
  winner?: 'A' | 'B' | 'tie';
  recommendation: string;
}

// Временное хранилище тестов
const abTests: Map<string, ABTest> = new Map();
const testSessions: Map<string, { testId: string; variant: string; sessionId: string }> = new Map();

export class ABTestService {
  /**
   * Создание нового A/B теста
   */
  static createTest(
    projectId: string,
    data: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt' | 'variants'>
  ): ABTest {
    const test: ABTest = {
      ...data,
      id: `ab-test-${uuidv4()}`,
      variants: [
        {
          id: 'variant-a',
          name: 'A',
          description: 'Контрольный вариант',
          pageId: data.variants?.[0]?.pageId || '',
          visitors: 0,
          conversions: 0,
          conversionRate: 0
        },
        {
          id: 'variant-b',
          name: 'B',
          description: 'Тестовый вариант',
          pageId: data.variants?.[1]?.pageId || '',
          visitors: 0,
          conversions: 0,
          conversionRate: 0
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    abTests.set(test.id, test);
    return test;
  }

  /**
   * Получение теста по ID
   */
  static getTest(testId: string): ABTest | null {
    return abTests.get(testId) || null;
  }

  /**
   * Получение всех тестов проекта
   */
  static getProjectTests(projectId: string): ABTest[] {
    return Array.from(abTests.values()).filter(test => test.projectId === projectId);
  }

  /**
   * Получение активных тестов проекта
   */
  static getActiveTests(projectId: string): ABTest[] {
    return this.getProjectTests(projectId).filter(test => test.status === 'running');
  }

  /**
   * Запуск теста
   */
  static startTest(testId: string): boolean {
    const test = abTests.get(testId);
    if (!test) return false;

    test.status = 'running';
    test.startDate = new Date().toISOString();
    test.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Остановка теста
   */
  static pauseTest(testId: string): boolean {
    const test = abTests.get(testId);
    if (!test) return false;

    test.status = 'paused';
    test.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Завершение теста
   */
  static completeTest(testId: string): boolean {
    const test = abTests.get(testId);
    if (!test) return false;

    test.status = 'completed';
    test.endDate = new Date().toISOString();
    test.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Получение варианта для посетителя
   */
  static getVariantForVisitor(testId: string, sessionId: string): string | null {
    // Проверяем, есть ли уже назначенный вариант для этой сессии
    const existing = Array.from(testSessions.values()).find(
      s => s.testId === testId && s.sessionId === sessionId
    );
    if (existing) {
      return existing.variant;
    }

    const test = abTests.get(testId);
    if (!test || test.status !== 'running') {
      return null;
    }

    // Распределение трафика на основе trafficSplit
    const random = Math.random() * 100;
    const variant = random < test.trafficSplit ? 'B' : 'A';

    // Сохраняем выбор для сессии
    testSessions.set(`${testId}-${sessionId}`, {
      testId,
      variant,
      sessionId
    });

    // Увеличиваем счетчик посетителей
    const variantObj = test.variants.find(v => v.name === variant);
    if (variantObj) {
      variantObj.visitors++;
      this.updateConversionRate(test);
    }

    return variant;
  }

  /**
   * Регистрация конверсии
   */
  static recordConversion(testId: string, sessionId: string, goalData?: any): boolean {
    const session = Array.from(testSessions.values()).find(
      s => s.testId === testId && s.sessionId === sessionId
    );

    if (!session) {
      return false;
    }

    const test = abTests.get(testId);
    if (!test) {
      return false;
    }

    const variant = test.variants.find(v => v.name === session.variant);
    if (variant) {
      variant.conversions++;
      this.updateConversionRate(test);
      test.updatedAt = new Date().toISOString();
      return true;
    }

    return false;
  }

  /**
   * Обновление коэффициента конверсии
   */
  private static updateConversionRate(test: ABTest) {
    test.variants.forEach(variant => {
      variant.conversionRate =
        variant.visitors > 0 ? (variant.conversions / variant.visitors) * 100 : 0;
    });
  }

  /**
   * Получение результатов теста
   */
  static getTestResults(testId: string): ABTestResult | null {
    const test = abTests.get(testId);
    if (!test) return null;

    const variantA = test.variants.find(v => v.name === 'A');
    const variantB = test.variants.find(v => v.name === 'B');

    if (!variantA || !variantB) return null;

    const improvement =
      variantA.conversionRate > 0
        ? ((variantB.conversionRate - variantA.conversionRate) / variantA.conversionRate) * 100
        : 0;

    // Упрощенный расчет статистической значимости (Z-test)
    const statisticalSignificance = this.calculateStatisticalSignificance(
      variantA.visitors,
      variantA.conversions,
      variantB.visitors,
      variantB.conversions
    );

    let winner: 'A' | 'B' | 'tie' = 'tie';
    if (statisticalSignificance > 0.95) {
      winner = variantB.conversionRate > variantA.conversionRate ? 'B' : 'A';
    }

    const recommendation = this.generateRecommendation(
      variantA,
      variantB,
      improvement,
      statisticalSignificance,
      winner
    );

    return {
      testId,
      variantA: {
        visitors: variantA.visitors,
        conversions: variantA.conversions,
        conversionRate: variantA.conversionRate
      },
      variantB: {
        visitors: variantB.visitors,
        conversions: variantB.conversions,
        conversionRate: variantB.conversionRate
      },
      improvement,
      statisticalSignificance,
      winner,
      recommendation
    };
  }

  /**
   * Расчет статистической значимости (Z-test)
   */
  private static calculateStatisticalSignificance(
    n1: number,
    x1: number,
    n2: number,
    x2: number
  ): number {
    if (n1 === 0 || n2 === 0) return 0;

    const p1 = x1 / n1;
    const p2 = x2 / n2;
    const p = (x1 + x2) / (n1 + n2);

    const se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
    if (se === 0) return 0;

    const z = (p2 - p1) / se;
    
    // Упрощенный расчет p-value (двусторонний тест)
    // В реальной реализации нужно использовать таблицу Z или библиотеку
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
    
    return 1 - pValue; // Возвращаем уровень доверия
  }

  /**
   * Нормальная функция распределения (CDF)
   */
  private static normalCDF(x: number): number {
    // Приближение функции нормального распределения
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  /**
   * Функция ошибок (error function)
   */
  private static erf(x: number): number {
    // Приближение через ряд Тейлора
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  /**
   * Генерация рекомендации на основе результатов
   */
  private static generateRecommendation(
    variantA: ABVariant,
    variantB: ABVariant,
    improvement: number,
    significance: number,
    winner: 'A' | 'B' | 'tie'
  ): string {
    if (significance < 0.95) {
      return `Недостаточно данных для статистически значимого вывода. Соберите больше данных (минимум 100 посетителей на вариант).`;
    }

    if (winner === 'tie') {
      return `Оба варианта показывают схожие результаты. Рекомендуется продолжить тест или попробовать новый вариант.`;
    }

    if (winner === 'B') {
      return `Вариант B показывает улучшение на ${improvement.toFixed(1)}% с уровнем доверия ${(significance * 100).toFixed(1)}%. Рекомендуется применить вариант B.`;
    }

    return `Вариант A показывает лучшие результаты. Рекомендуется оставить текущий вариант или попробовать новый тест.`;
  }

  /**
   * Удаление теста
   */
  static deleteTest(testId: string): boolean {
    return abTests.delete(testId);
  }
}

