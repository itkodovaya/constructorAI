import type { DesignParameters } from '../utils/DesignParameters';

const ICON_PATHS: Record<string, string> = {
  // Tech
  rocket: 'M13.13 2.188c-5.855 4.277-7.74 11.687-7.49 13.622L2.43 19.02a1 1 0 0 0 .931 1.588l4.63-.33a1.03 1.03 0 0 1 .81.397l3.05 3.72a1 1 0 0 0 1.548-.002l3.21-3.89a1 1 0 0 1 .804-.349l4.27.308a1 1 0 0 0 .915-1.623l-3.38-3.14c.245-1.935-1.64-9.345-7.495-13.622a1 1 0 0 0-1.123 0z',
  chip: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h10V4H7zm2 3h6v2H9V7zm0 4h6v2H9v-2zm0 4h6v2H9v-2z',
  code: 'M8 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8zm0 2h8v14H8V5zm2 4v2h4V9h-4zm0 4v2h4v-2h-4z',
  database: 'M4 7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2H4V7zm0 4v6c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6H4zm2-6h12c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2z',
  cloud: 'M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z',
  server: 'M4 1h16c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2zm0 6h16v4H4V7zm0 6h16c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2z',
  wifi: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
  
  // Health
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  cross: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  pulse: 'M3 13h2v-2H3v2zm4 8h2v-2H7v2zm-4-8h2v-2H3v2zm8 8h2v-2h-2v2zm-4-4h2v-2H7v2zm8-8h2V7h-2v2zm-4 4h2v-2h-2v2zm4-4h2V7h-2v2zm-8 0h2V7H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2z',
  pill: 'M8.5 2C6.57 2 5 3.57 5 5.5S6.57 9 8.5 9 12 7.43 12 5.5 10.43 2 8.5 2zm7 0C13.57 2 12 3.57 12 5.5S13.57 9 15.5 9 19 7.43 19 5.5 17.43 2 15.5 2zM5 10.5C5 8.57 6.57 7 8.5 7h7C17.43 7 19 8.57 19 10.5S17.43 14 15.5 14h-7C6.57 14 5 12.43 5 10.5z',
  stethoscope: 'M19 14v-3c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v4H5c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h1v1c0 2.21 1.79 4 4 4s4-1.79 4-4v-1h1c1.1 0 2-.9 2-2zm-6-9h2v4h-2V5zm-4 0h2v4H9V5zm3 15c-1.1 0-2-.9-2-2v-1h4v1c0 1.1-.9 2-2 2z',
  
  // Food
  coffee: 'M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.38 0 2.5-1.12 2.5-2.5S19.88 3 18.5 3zm-1.54 2l.5 2H6V5h10.96zm.04 4H6v-.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5V9zm-1.5 2c-.83 0-1.5.67-1.5 1.5h7c0-.83-.67-1.5-1.5-1.5h-4z',
  pizza: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  burger: 'M5 7h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zm0 4h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zm0 4h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1z',
  wine: 'M6 3v6c0 2.97 2.16 5.43 5 5.91V19H8v2h8v-2h-3v-4.09c2.84-.48 5-2.94 5-5.91V3H6zm6 10c-1.86 0-3.41-1.28-3.86-3h7.72c-.45 1.72-2 3-3.86 3zm4-8H8V5h8v0z',
  
  // Fashion
  diamond: 'M6 2L2 8l10 14L22 8l-4-6H6zm2.5 2h7l2.5 4h-12l2.5-4zm1.5 6l3 4-3 4-3-4 3-4z',
  crown: 'M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1z',
  gem: 'M6 2L2 8l10 14L22 8l-4-6H6zm2.5 2h7l2.5 4h-12l2.5-4zm1.5 6l3 4-3 4-3-4 3-4z',
  bag: 'M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z',
  
  // Education
  book: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
  'graduation-cap': 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
  lightbulb: 'M12 2c-3.86 0-7 3.14-7 7 0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1zM9 19h6v2H9v-2z',
  pencil: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  
  // Finance
  wallet: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4H4V6h16v2zM4 18V10h16v8H4zm6-4h4v-2h-4v2z',
  'credit-card': 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4H4V6h16v2zM4 18V10h16v8H4z',
  'trending-up': 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
  dollar: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
  
  // Travel
  plane: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  car: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
  map: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z',
  compass: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5l3.5 3L12 18.5 8.5 16zm7-8l-3.5 2.5L15.5 12l3.5-2.5-3.5-2.5zm-7 8l3.5-2.5L8.5 12l-3.5 2.5 3.5 2.5z',
  
  // Sports
  trophy: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.65 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 13.65 21 11.55 21 9V7c0-1.1-.9-2-2-2zM5 9V7h2v3.82C5.84 10.4 5 9.3 5 9zm14 0c0 1.3-.84 2.4-2 2.82V7h2v2z',
  target: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  award: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  
  // General/Other
  star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  shield: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',
  building: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z',
  leaf: 'M17 8c.98 0 1.86.22 2.59.61C21.13 5.41 18.52 3 15 3c-4.42 0-8 3.58-8 8 0 1.58.43 3.06 1.19 4.32C6.26 16.58 4 19.03 4 22h2c0-2.76 2.24-5 5-5h2c2.76 0 5-2.24 5-5V8z',
  mountain: 'M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z',
  brush: 'M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 0 0-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z',
  bulb: 'M12 2c-3.86 0-7 3.14-7 7 0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1zM9 19h6v2H9v-2z',
};

// Маппинг ниш к релевантным иконкам
const NICHE_ICON_MAP: Record<string, string[]> = {
  tech: ['rocket', 'chip', 'code', 'database', 'cloud', 'server', 'wifi'],
  health: ['heart', 'cross', 'pulse', 'pill', 'stethoscope'],
  food: ['coffee', 'pizza', 'burger', 'wine'],
  fashion: ['diamond', 'crown', 'gem', 'bag'],
  education: ['book', 'graduation-cap', 'lightbulb', 'pencil'],
  finance: ['wallet', 'credit-card', 'trending-up', 'dollar'],
  travel: ['plane', 'car', 'map', 'compass'],
  sports: ['trophy', 'target', 'activity', 'award'],
  // Fallback для неизвестных ниш
  default: ['star', 'shield', 'building', 'leaf', 'mountain', 'brush', 'bulb'],
};

// Получить список иконок для ниши
export function getIconsForNiche(niche: string): string[] {
  const normalizedNiche = niche.toLowerCase();
  return NICHE_ICON_MAP[normalizedNiche] || NICHE_ICON_MAP.default;
}

// Получить случайную иконку для ниши
export function getRandomIconForNiche(niche: string): string {
  const icons = getIconsForNiche(niche);
  return icons[Math.floor(Math.random() * icons.length)];
}

export class PreviewGenerator {
  // Генерация превью через Canvas
  static generateCanvasPreview(parameters: DesignParameters, width: number = 400, height: number = 300): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return this.generateSVGPreview(parameters, width, height);
    }

    // Фон с градиентом
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, parameters.colorPalette.primary);
    gradient.addColorStop(1, parameters.colorPalette.secondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Добавляем элементы в зависимости от композиции
    if (parameters.composition.layout === 'centered') {
      this.drawCenteredLayout(ctx, parameters, width, height);
    } else if (parameters.composition.layout === 'grid') {
      this.drawGridLayout(ctx, parameters, width, height);
    } else if (parameters.composition.layout === 'asymmetric') {
      this.drawAsymmetricLayout(ctx, parameters, width, height);
    } else {
      this.drawCenteredLayout(ctx, parameters, width, height);
    }

    // Добавляем эффекты
    if (parameters.effects.some(e => e.type === 'glow')) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = parameters.colorPalette.accent;
    }

    return canvas.toDataURL('image/png');
  }

  private static drawCenteredLayout(
    ctx: CanvasRenderingContext2D,
    parameters: DesignParameters,
    width: number,
    height: number
  ) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Рисуем формы
    parameters.elements.forEach((element, index) => {
      if (element.type === 'shape') {
        ctx.fillStyle = parameters.colorPalette.accent;
        ctx.beginPath();
        
        if (element.value === 'circle') {
          ctx.arc(centerX, centerY, 50 + index * 20, 0, Math.PI * 2);
        } else if (element.value === 'square') {
          const size = 60 + index * 20;
          ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
        }
        
        ctx.fill();
      }
    });

    // Текст стиля
    ctx.fillStyle = parameters.colorPalette.text;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(parameters.style.name, centerX, centerY + 80);
  }

  private static drawGridLayout(
    ctx: CanvasRenderingContext2D,
    parameters: DesignParameters,
    width: number,
    height: number
  ) {
    const cols = 3;
    const rows = 3;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillStyle = parameters.colorPalette.accent;
          ctx.fillRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
        }
      }
    }
  }

  private static drawAsymmetricLayout(
    ctx: CanvasRenderingContext2D,
    parameters: DesignParameters,
    width: number,
    height: number
  ) {
    // Асимметричная композиция
    ctx.fillStyle = parameters.colorPalette.accent;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width * 0.7, 0);
    ctx.lineTo(width * 0.3, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  }

  // Генерация SVG превью (более легковесная альтернатива)
  static generateSVGPreview(parameters: DesignParameters, width: number = 400, height: number = 300): string {
    const fontFamilies: Record<string, string> = {
      minimalist: "'Inter', 'Helvetica', sans-serif",
      tech: "'JetBrains Mono', 'Courier New', monospace",
      premium: "'Playfair Display', 'Georgia', serif",
      vibrant: "'Montserrat', 'Arial Black', sans-serif",
      creative: "'Pacifico', 'cursive'",
    };

    const fontFamily = fontFamilies[parameters.style.type] || fontFamilies.minimalist;
    const letterSpacing = parameters.style.type === 'premium' ? '4' : 'normal';

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=JetBrains+Mono:wght@800&family=Playfair+Display:wght@900&family=Montserrat:wght@900&family=Pacifico&display=swap');
          </style>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${parameters.colorPalette.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${parameters.colorPalette.secondary};stop-opacity:1" />
          </linearGradient>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${parameters.colorPalette.text};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${parameters.colorPalette.text};stop-opacity:0.8" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="${parameters.colorPalette.accent}" opacity="0.1"/>
          </pattern>
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${parameters.colorPalette.accent}" stroke-width="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="${parameters.colorPalette.background}"/>
        <rect width="${width}" height="${height}" fill="url(#${parameters.style.type === 'tech' ? 'grid' : 'dots'})"/>
        ${this.generateSVGElements(parameters, width, height)}
        <text x="${width / 2}" y="${height - 40}" 
              font-family="${fontFamily}" font-size="24" font-weight="900" 
              fill="url(#textGrad)" text-anchor="middle"
              style="letter-spacing: ${letterSpacing}px">
          ${parameters.style.name.toUpperCase()}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }

  private static generateSVGElements(parameters: DesignParameters, width: number, height: number): string {
    const elements: string[] = [];
    const centerX = width / 2;
    const centerY = height / 2;

    // Проверяем наличие иконки в параметрах
    const iconElement = parameters.elements.find(e => e.type === 'icon');
    if (iconElement && ICON_PATHS[iconElement.value]) {
      const path = ICON_PATHS[iconElement.value];
      elements.push(
        `<g transform="translate(${centerX - 40}, ${centerY - 60}) scale(3.5)">
          <path d="${path}" fill="${parameters.colorPalette.accent}" opacity="0.9" filter="url(#glow)"/>
        </g>`
      );
      return elements.join('');
    }

    parameters.elements.forEach((element, index) => {
      if (element.type === 'shape') {
        if (element.value === 'circle') {
          elements.push(
            `<circle cx="${centerX}" cy="${centerY - 20 + index * 30}" r="${30 + index * 10}" 
                     fill="${parameters.colorPalette.accent}" opacity="0.8"/>`
          );
        } else if (element.value === 'square') {
          const size = 40 + index * 15;
          elements.push(
            `<rect x="${centerX - size / 2}" y="${centerY - size / 2 - 20 + index * 30}" 
                   width="${size}" height="${size}" 
                   fill="${parameters.colorPalette.accent}" opacity="0.8"/>`
          );
        }
      }
    });

    return elements.join('');
  }

  static renderIconPath(iconName: string, x: number, y: number, scale: number, options?: {
    gradientId?: string;
    filterId?: string;
    backgroundColor?: string;
    backgroundOpacity?: number;
    iconColor?: string;
  }): string {
    const path = ICON_PATHS[iconName] || ICON_PATHS.star;
    const gradientId = options?.gradientId || 'logoGrad';
    const filterId = options?.filterId || 'logoGlow';
    const iconColor = options?.iconColor || `url(#${gradientId})`;
    const bgColor = options?.backgroundColor;
    const bgOpacity = options?.backgroundOpacity || 0;
    
    const iconSize = 24 * scale;
    const offsetX = x - iconSize / 2;
    const offsetY = y - iconSize / 2;
    
    let background = '';
    if (bgColor && bgOpacity > 0) {
      // Добавляем фон для иконки (круг или квадрат)
      background = `
        <circle cx="${x}" cy="${y}" r="${iconSize / 2 + 4}" fill="${bgColor}" opacity="${bgOpacity}"/>
      `;
    }
    
    return `
      ${background}
      <g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">
        <path d="${path}" fill="${iconColor}" filter="url(#${filterId})" transform="translate(12, 12)"/>
      </g>
    `;
  }

  static renderMultipleIcons(icons: Array<{name: string, x: number, y: number, scale: number}>): string {
    return icons.map(icon => this.renderIconPath(icon.name, icon.x, icon.y, icon.scale)).join('');
  }

  // Кэш для превью
  private static previewCache = new Map<string, string>();

  static getCachedPreview(designId: string, parameters: DesignParameters): string {
    if (this.previewCache.has(designId)) {
      return this.previewCache.get(designId)!;
    }

    // Генерируем превью
    const preview = this.generateSVGPreview(parameters);
    this.previewCache.set(designId, preview);
    return preview;
  }

  static clearCache(): void {
    this.previewCache.clear();
  }
}

