// Утилиты для работы с параметрами дизайна

export interface ColorPalette {
  id: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  name: string;
}

export interface DesignStyle {
  id: string;
  name: string;
  type: 'minimalist' | 'tech' | 'premium' | 'vibrant' | 'creative' | 'corporate' | 'modern' | 'classic' | 'bold' | 'elegant' | 'playful' | 'sophisticated' | 'energetic' | 'calm' | 'dynamic' | 'refined' | 'striking' | 'balanced';
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface Composition {
  id: string;
  layout: 'centered' | 'asymmetric' | 'grid' | 'flow' | 'geometric' | 'organic' | 'layered' | 'overlapping' | 'scattered' | 'aligned';
  balance: 'symmetrical' | 'dynamic' | 'radial' | 'diagonal';
  spacing: 'tight' | 'moderate' | 'loose';
}

export interface DesignElement {
  id: string;
  type: 'shape' | 'icon' | 'typography' | 'pattern' | 'illustration';
  value: string;
  category: string;
}

export interface Effect {
  id: string;
  type: 'shadow' | 'gradient' | 'glow' | 'texture' | 'blur' | 'outline' | 'emboss' | 'metallic' | 'glass' | 'neon';
  intensity: number;
  color?: string;
}

export interface Mood {
  id: string;
  name: string;
  keywords: string[];
}

export interface Industry {
  id: string;
  name: string;
  relevantStyles: string[];
  relevantColors: string[];
}

export interface DesignParameters {
  colorPalette: ColorPalette;
  style: DesignStyle;
  composition: Composition;
  elements: DesignElement[];
  effects: Effect[];
  mood: Mood;
  industry: Industry;
}

export interface GeneratedDesign {
  id: string;
  preview: string;
  parameters: DesignParameters;
  score: number;
  generatedAt: Date;
}

// Генерация уникального ID для комбинации параметров
export function generateDesignId(parameters: DesignParameters): string {
  const str = JSON.stringify({
    color: parameters.colorPalette.id,
    style: parameters.style.id,
    composition: parameters.composition.id,
    elements: parameters.elements.map(e => e.id).sort().join(','),
    effects: parameters.effects.map(e => e.id).sort().join(','),
    mood: parameters.mood.id,
    industry: parameters.industry.id,
  });
  
  // Простой hash функция
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `design_${Math.abs(hash).toString(36)}`;
}

// Валидация параметров
export function validateParameters(params: Partial<DesignParameters>): boolean {
  return !!(
    params.colorPalette &&
    params.style &&
    params.composition &&
    params.elements &&
    params.elements.length > 0 &&
    params.effects &&
    params.mood &&
    params.industry
  );
}

// Сериализация параметров
export function serializeParameters(params: DesignParameters): string {
  return JSON.stringify(params);
}

// Десериализация параметров
export function deserializeParameters(str: string): DesignParameters | null {
  try {
    return JSON.parse(str) as DesignParameters;
  } catch {
    return null;
  }
}

