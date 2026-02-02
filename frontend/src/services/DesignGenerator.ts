import type { DesignParameters, GeneratedDesign } from '../utils/DesignParameters';
import { generateDesignId, validateParameters } from '../utils/DesignParameters';
import { PreviewGenerator } from './PreviewGenerator';

// Кэш для сгенерированных дизайнов
const designCache = new Map<string, GeneratedDesign>();

// Предустановленные варианты параметров
const colorPalettes: DesignParameters['colorPalette'][] = [
  { id: 'palette_1', primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899', background: '#ffffff', text: '#1e293b', name: 'Indigo Purple' },
  { id: 'palette_2', primary: '#3b82f6', secondary: '#06b6d4', accent: '#10b981', background: '#f8fafc', text: '#0f172a', name: 'Ocean Blue' },
  { id: 'palette_3', primary: '#f59e0b', secondary: '#ef4444', accent: '#f97316', background: '#fff7ed', text: '#1c1917', name: 'Warm Sunset' },
  { id: 'palette_4', primary: '#10b981', secondary: '#059669', accent: '#34d399', background: '#f0fdf4', text: '#064e3b', name: 'Nature Green' },
  { id: 'palette_5', primary: '#8b5cf6', secondary: '#a855f7', accent: '#c084fc', background: '#faf5ff', text: '#3b0764', name: 'Royal Purple' },
  // Добавим больше вариантов программно
];

const designStyles: DesignParameters['style'][] = [
  { id: 'style_minimalist', name: 'Минимализм', type: 'minimalist', complexity: 'simple' },
  { id: 'style_tech', name: 'Техно', type: 'tech', complexity: 'moderate' },
  { id: 'style_premium', name: 'Премиум', type: 'premium', complexity: 'complex' },
  { id: 'style_vibrant', name: 'Яркий', type: 'vibrant', complexity: 'moderate' },
  { id: 'style_creative', name: 'Креативный', type: 'creative', complexity: 'complex' },
  { id: 'style_corporate', name: 'Корпоративный', type: 'corporate', complexity: 'moderate' },
  { id: 'style_modern', name: 'Современный', type: 'modern', complexity: 'moderate' },
  { id: 'style_classic', name: 'Классический', type: 'classic', complexity: 'simple' },
  // Добавим больше стилей программно
];

const compositions: DesignParameters['composition'][] = [
  { id: 'comp_centered', layout: 'centered', balance: 'symmetrical', spacing: 'moderate' },
  { id: 'comp_asymmetric', layout: 'asymmetric', balance: 'dynamic', spacing: 'loose' },
  { id: 'comp_grid', layout: 'grid', balance: 'symmetrical', spacing: 'tight' },
  { id: 'comp_flow', layout: 'flow', balance: 'dynamic', spacing: 'moderate' },
  { id: 'comp_geometric', layout: 'geometric', balance: 'radial', spacing: 'tight' },
  // Добавим больше композиций программно
];

// Генерация большего количества вариантов
function generateMoreVariants() {
  // Генерируем больше цветовых палитр
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
  for (let i = 6; i <= 100; i++) {
    const primary = colors[Math.floor(Math.random() * colors.length)];
    const secondary = colors[Math.floor(Math.random() * colors.length)];
    colorPalettes.push({
      id: `palette_${i}`,
      primary,
      secondary,
      accent: colors[Math.floor(Math.random() * colors.length)],
      background: '#ffffff',
      text: '#1e293b',
      name: `Palette ${i}`,
    });
  }

  // Генерируем больше стилей
  const styleTypes: DesignParameters['style']['type'][] = ['minimalist', 'tech', 'premium', 'vibrant', 'creative', 'corporate', 'modern', 'classic', 'bold', 'elegant', 'playful', 'sophisticated', 'energetic', 'calm', 'dynamic', 'refined', 'striking', 'balanced'];
  for (let i = 8; i <= 50; i++) {
    const type = styleTypes[Math.floor(Math.random() * styleTypes.length)];
    designStyles.push({
      id: `style_${i}`,
      name: `Style ${i}`,
      type,
      complexity: ['simple', 'moderate', 'complex'][Math.floor(Math.random() * 3)] as 'simple' | 'moderate' | 'complex',
    });
  }

  // Генерируем больше композиций
  const layouts: DesignParameters['composition']['layout'][] = ['centered', 'asymmetric', 'grid', 'flow', 'geometric', 'organic', 'layered', 'overlapping', 'scattered', 'aligned'];
  for (let i = 6; i <= 30; i++) {
    compositions.push({
      id: `comp_${i}`,
      layout: layouts[Math.floor(Math.random() * layouts.length)],
      balance: ['symmetrical', 'dynamic', 'radial', 'diagonal'][Math.floor(Math.random() * 4)] as any,
      spacing: ['tight', 'moderate', 'loose'][Math.floor(Math.random() * 3)] as any,
    });
  }
}

// Инициализация вариантов
generateMoreVariants();

export class DesignGenerator {
  private static instance: DesignGenerator;
  private seed: number = Date.now();

  private constructor() {}

  static getInstance(): DesignGenerator {
    if (!DesignGenerator.instance) {
      DesignGenerator.instance = new DesignGenerator();
    }
    return DesignGenerator.instance;
  }

  // Генерация варианта на основе индекса (для детерминированной генерации)
  generateDesign(index: number, industryId?: string): GeneratedDesign {
    // Используем seed для детерминированной генерации
    const rng = this.seededRandom(index);
    
    const colorPalette = colorPalettes[Math.floor(rng() * colorPalettes.length)];
    const style = designStyles[Math.floor(rng() * designStyles.length)];
    const composition = compositions[Math.floor(rng() * compositions.length)];
    
    // Генерируем элементы
    const elements: DesignParameters['elements'][] = [
      { id: 'elem_1', type: 'shape', value: 'circle', category: 'geometric' },
      { id: 'elem_2', type: 'icon', value: 'star', category: 'symbols' },
      { id: 'elem_3', type: 'typography', value: 'bold', category: 'text' },
    ];
    const selectedElements = elements.slice(0, Math.floor(rng() * elements.length) + 1);
    
    // Генерируем эффекты
    const effects: DesignParameters['effects'][] = [
      { id: 'eff_1', type: 'shadow', intensity: 0.5 },
      { id: 'eff_2', type: 'gradient', intensity: 0.7 },
      { id: 'eff_3', type: 'glow', intensity: 0.3 },
    ];
    const selectedEffects = effects.slice(0, Math.floor(rng() * effects.length) + 1);
    
    const mood: DesignParameters['mood'] = {
      id: 'mood_1',
      name: 'Professional',
      keywords: ['clean', 'modern', 'trustworthy'],
    };
    
    const industry: DesignParameters['industry'] = {
      id: industryId || 'tech',
      name: 'Technology',
      relevantStyles: ['tech', 'modern'],
      relevantColors: ['blue', 'indigo'],
    };
    
    const parameters: DesignParameters = {
      colorPalette,
      style,
      composition,
      elements: selectedElements as any,
      effects: selectedEffects as any,
      mood,
      industry,
    };
    
    if (!validateParameters(parameters)) {
      throw new Error('Invalid parameters generated');
    }
    
    const id = generateDesignId(parameters);
    
    // Проверяем кэш
    if (designCache.has(id)) {
      return designCache.get(id)!;
    }
    
    // Генерируем превью (пока placeholder, потом будет Canvas/SVG)
    const preview = this.generatePreview(parameters);
    
    const design: GeneratedDesign = {
      id,
      preview,
      parameters,
      score: this.calculateScore(parameters, industryId),
      generatedAt: new Date(),
    };
    
    // Кэшируем
    designCache.set(id, design);
    
    return design;
  }

  // Генерация превью через PreviewGenerator
  private generatePreview(parameters: DesignParameters): string {
    try {
      // Пытаемся использовать Canvas, если доступен
      if (typeof document !== 'undefined') {
        return PreviewGenerator.generateCanvasPreview(parameters);
      }
    } catch (error) {
      console.warn('Canvas preview generation failed, using SVG:', error);
    }
    
    // Fallback на SVG
    return PreviewGenerator.generateSVGPreview(parameters);
  }

  // Расчет релевантности
  private calculateScore(parameters: DesignParameters, industryId?: string): number {
    let score = 0.5; // Базовый score
    
    // Увеличиваем score если стиль релевантен индустрии
    if (industryId && parameters.industry.relevantStyles.includes(parameters.style.type)) {
      score += 0.3;
    }
    
    // Добавляем случайность для разнообразия
    score += Math.random() * 0.2;
    
    return Math.min(1, score);
  }

  // Seeded random для детерминированной генерации
  private seededRandom(seed: number): () => number {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  // Генерация батча дизайнов
  generateBatch(count: number, industryId?: string, offset: number = 0): GeneratedDesign[] {
    const designs: GeneratedDesign[] = [];
    for (let i = 0; i < count; i++) {
      try {
        const design = this.generateDesign(offset + i, industryId);
        designs.push(design);
      } catch (error) {
        console.error('Error generating design:', error);
      }
    }
    return designs;
  }

  // Очистка кэша
  clearCache(): void {
    designCache.clear();
  }
}

