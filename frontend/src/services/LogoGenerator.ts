import type { GeneratedDesign, DesignParameters } from '../utils/DesignParameters';
import { PreviewGenerator, getRandomIconForNiche, getIconsForNiche } from './PreviewGenerator';

export interface LogoVariant {
  id: string;
  preview: string;
  parameters: DesignParameters;
  name: string;
}

export class LogoGenerator {
  private static instance: LogoGenerator;

  private constructor() {}

  static getInstance(): LogoGenerator {
    if (!LogoGenerator.instance) {
      LogoGenerator.instance = new LogoGenerator();
    }
    return LogoGenerator.instance;
  }

  // Генерация вариантов логотипов на основе выбранного дизайна
  async generateLogos(
    brandName: string,
    selectedDesign: GeneratedDesign,
    count: number = 12,
    strategy: 'diverse' | 'cohesive' | 'progressive' = 'diverse'
  ): Promise<LogoVariant[]> {
    const logos: LogoVariant[] = [];

    // Создаем варианты на основе выбранного дизайна
    for (let i = 0; i < count; i++) {
      const variant = this.createLogoVariant(brandName, selectedDesign, i, strategy);
      logos.push(variant);
    }

    return logos;
  }

  // Генерация вариантов с различными стратегиями
  generateVariantsWithStrategy(
    brandName: string,
    baseDesign: GeneratedDesign,
    strategy: 'diverse' | 'cohesive' | 'progressive',
    count: number = 12
  ): LogoVariant[] {
    const logos: LogoVariant[] = [];

    for (let i = 0; i < count; i++) {
      const variant = this.createLogoVariant(brandName, baseDesign, i, strategy);
      logos.push(variant);
    }

    return logos;
  }

  private createLogoVariant(
    brandName: string,
    baseDesign: GeneratedDesign,
    variantIndex: number,
    strategy: 'diverse' | 'cohesive' | 'progressive' = 'diverse'
  ): LogoVariant {
    // Создаем вариацию параметров в зависимости от стратегии
    let parameters: DesignParameters;
    
    if (strategy === 'cohesive') {
      // Cohesive: минимальные вариации, единый стиль
      parameters = {
        ...baseDesign.parameters,
        composition: {
          ...baseDesign.parameters.composition,
          layout: baseDesign.parameters.composition.layout,
        },
        elements: baseDesign.parameters.elements,
      };
    } else if (strategy === 'progressive') {
      // Progressive: от простого к сложному
      const complexity = Math.min(variantIndex / 3, 1);
      parameters = {
        ...baseDesign.parameters,
        composition: {
          ...baseDesign.parameters.composition,
          layout: this.getVariantLayout(baseDesign.parameters.composition.layout, Math.floor(complexity * 4)),
        },
        elements: complexity > 0.5 ? baseDesign.parameters.elements : baseDesign.parameters.elements.slice(0, 1),
        effects: complexity > 0.7 ? baseDesign.parameters.effects : [],
      };
    } else {
      // Diverse: максимальное разнообразие
      parameters = {
        ...baseDesign.parameters,
        composition: {
          ...baseDesign.parameters.composition,
          layout: this.getVariantLayout(baseDesign.parameters.composition.layout, variantIndex),
        },
        elements: this.getVariantElements(baseDesign.parameters.elements, variantIndex, baseDesign.parameters.industry.id),
      };
    }

    // Определяем тип макета логотипа
    const logoLayoutType = this.getLogoLayoutType(variantIndex, brandName);

    // Генерируем превью логотипа
    const preview = this.generateLogoPreview(brandName, parameters, logoLayoutType, variantIndex);

    const layoutNames: Record<string, string> = {
      stacked: 'Stacked',
      horizontal: 'Horizontal',
      badge: 'Badge',
      monogram: 'Monogram',
      wordmark: 'Wordmark',
      lettermark: 'Lettermark',
      abstract: 'Abstract',
      combined: 'Combined',
    };

    return {
      id: `logo_${baseDesign.id}_${variantIndex}`,
      preview,
      parameters,
      name: `${baseDesign.parameters.style.name} ${layoutNames[logoLayoutType]}`,
    };
  }

  // Типы макетов логотипов
  private logoLayoutTypes = ['stacked', 'horizontal', 'badge', 'monogram', 'wordmark', 'lettermark', 'abstract', 'combined'] as const;
  
  private getLogoLayoutType(variantIndex: number, brandName: string): string {
    // Выбираем макет на основе индекса и длины названия
    const layouts = [...this.logoLayoutTypes];
    
    // Для коротких названий предпочитаем lettermark/monogram
    if (brandName.length <= 3) {
      const shortLayouts = ['lettermark', 'monogram', 'badge', 'abstract'];
      return shortLayouts[variantIndex % shortLayouts.length];
    }
    
    // Для длинных названий предпочитаем wordmark/horizontal
    if (brandName.length > 15) {
      const longLayouts = ['wordmark', 'horizontal', 'combined', 'stacked'];
      return longLayouts[variantIndex % longLayouts.length];
    }
    
    // Для средних названий используем все макеты
    return layouts[variantIndex % layouts.length];
  }

  private getVariantLayout(
    baseLayout: DesignParameters['composition']['layout'],
    variantIndex: number
  ): DesignParameters['composition']['layout'] {
    const layouts: DesignParameters['composition']['layout'][] = [
      'centered',
      'asymmetric',
      'grid',
      'flow',
      'geometric',
    ];
    
    const baseIndex = layouts.indexOf(baseLayout);
    const variantLayout = layouts[(baseIndex + variantIndex) % layouts.length];
    return variantLayout;
  }

  private getVariantElements(
    baseElements: DesignParameters['elements'][],
    variantIndex: number,
    niche?: string
  ): DesignParameters['elements'][] {
    // Создаем вариации элементов с разными иконками
    return baseElements.map((elem, index) => {
      if (elem.type === 'icon') {
        // Для иконок используем релевантные для ниши
        const iconValue = niche ? this.getVariantIconForNiche(niche, variantIndex) : elem.value;
        return {
          ...elem,
          id: `${elem.id}_v${variantIndex}`,
          value: iconValue,
        };
      }
      return {
        ...elem,
        id: `${elem.id}_v${variantIndex}`,
      };
    });
  }

  private getVariantIconForNiche(niche: string, variantIndex: number): string {
    const icons = getIconsForNiche(niche);
    return icons[variantIndex % icons.length] || icons[0];
  }

  private getFontFamily(style: string, layoutType: string): string {
    const fontMap: Record<string, string> = {
      minimalist: "'Inter', 'Helvetica', sans-serif",
      tech: "'JetBrains Mono', 'Courier New', monospace",
      premium: "'Playfair Display', 'Georgia', serif",
      vibrant: "'Montserrat', 'Arial Black', sans-serif",
      creative: "'Pacifico', 'cursive'",
      corporate: "'Roboto', 'Arial', sans-serif",
      modern: "'Raleway', 'Helvetica', sans-serif",
      classic: "'Lato', 'Arial', sans-serif",
      bold: "'Oswald', 'Arial', sans-serif",
      elegant: "'Poppins', 'Arial', sans-serif",
      playful: "'Nunito', 'Arial', sans-serif",
    };
    return fontMap[style] || fontMap.minimalist;
  }

  private getFontSize(brandName: string, layoutType: string): number {
    const baseSize = 36;
    const length = brandName.length;
    
    if (layoutType === 'monogram' || layoutType === 'lettermark') {
      return 72;
    }
    if (layoutType === 'wordmark') {
      return 42;
    }
    if (length > 15) {
      return baseSize - 8;
    }
    if (length > 10) {
      return baseSize - 4;
    }
    return baseSize;
  }

  private getLetterSpacing(style: string, layoutType: string): string {
    if (layoutType === 'lettermark') {
      return '8';
    }
    if (style === 'premium' || style === 'elegant') {
      return '4';
    }
    if (style === 'tech') {
      return '2';
    }
    return 'normal';
  }

  private generateStylizedLetter(brandName: string, style: string): string {
    const firstLetter = brandName.charAt(0).toUpperCase();
    const fontFamily = this.getFontFamily(style, 'monogram');
    
    return `
      <text x="200" y="200" 
            font-family="${fontFamily}" 
            font-size="120" 
            font-weight="900"
            fill="url(#logoGrad)" 
            text-anchor="middle"
            filter="url(#logoGlow)">
        ${firstLetter}
      </text>
    `;
  }

  private generateDecorativeElements(style: string, layoutType: string, parameters: DesignParameters, centerX: number, centerY: number): string {
    const elements: string[] = [];
    
    // Геометрические рамки
    if (layoutType === 'badge' || style === 'premium') {
      elements.push(`
        <circle cx="${centerX}" cy="${centerY}" r="150" fill="none" stroke="${parameters.colorPalette.accent}" stroke-width="1" opacity="0.1"/>
        <circle cx="${centerX}" cy="${centerY}" r="130" fill="none" stroke="${parameters.colorPalette.primary}" stroke-width="1" opacity="0.15"/>
      `);
    }
    
    // Декоративные линии
    if (layoutType === 'wordmark' || style === 'minimalist') {
      elements.push(`
        <line x1="${centerX - 120}" y1="${centerY - 30}" x2="${centerX - 20}" y2="${centerY - 30}" stroke="${parameters.colorPalette.accent}" stroke-width="2" opacity="0.3"/>
        <line x1="${centerX + 20}" y1="${centerY + 30}" x2="${centerX + 120}" y2="${centerY + 30}" stroke="${parameters.colorPalette.accent}" stroke-width="2" opacity="0.3"/>
      `);
    }
    
    // Орнаменты для премиум стилей
    if (style === 'premium' || style === 'elegant') {
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * 100;
        const y = centerY + Math.sin(angle) * 100;
        elements.push(`
          <circle cx="${x}" cy="${y}" r="3" fill="${parameters.colorPalette.accent}" opacity="0.2"/>
        `);
      }
    }
    
    // Абстрактные формы для креативных стилей
    if (style === 'creative' || layoutType === 'abstract') {
      elements.push(`
        <polygon points="${centerX - 30},${centerY - 50} ${centerX + 30},${centerY - 50} ${centerX},${centerY - 20}" 
                 fill="${parameters.colorPalette.primary}" opacity="0.1"/>
        <polygon points="${centerX - 30},${centerY + 50} ${centerX + 30},${centerY + 50} ${centerX},${centerY + 20}" 
                 fill="${parameters.colorPalette.secondary}" opacity="0.1"/>
      `);
    }
    
    return elements.join('');
  }

  private generateLogoPreview(brandName: string, parameters: DesignParameters, layoutType: string, variantIndex: number = 0): string {
    const width = 400;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    const iconElement = parameters.elements.find(e => e.type === 'icon');
    const hasIcon = !!iconElement;
    const fontFamily = this.getFontFamily(parameters.style.type, layoutType);
    const fontSize = this.getFontSize(brandName, layoutType);
    const letterSpacing = this.getLetterSpacing(parameters.style.type, layoutType);

    let svgContent = '';

    switch (layoutType) {
      case 'stacked':
        // Stacked: Icon top, Text bottom
        svgContent = `
          ${hasIcon ? this.renderIcon(iconElement!, centerX, centerY - 50, 4) : ''}
        <text x="${centerX}" y="${centerY + 60}" 
              font-family="${fontFamily}" font-size="${fontSize}" font-weight="900"
              fill="${parameters.colorPalette.text}" text-anchor="middle" style="letter-spacing: ${letterSpacing}px">
          ${brandName.toUpperCase()}
        </text>
        `;
        break;

      case 'horizontal':
        // Horizontal: Icon left, Text right
        svgContent = `
          <g transform="translate(-40, 0)">
            ${hasIcon ? this.renderIcon(iconElement!, centerX - 80, centerY, 3.5) : ''}
            <text x="${centerX + 20}" y="${centerY + 12}" 
                  font-family="${fontFamily}" font-size="${fontSize - 4}" font-weight="900"
                  fill="${parameters.colorPalette.text}" text-anchor="start" style="letter-spacing: ${letterSpacing}px">
              ${brandName}
            </text>
          </g>
        `;
        break;

      case 'badge':
        // Badge: Логотип в круглой/квадратной рамке
        const badgeShape = (variantIndex || 0) % 2 === 0 ? 'circle' : 'square';
        if (badgeShape === 'circle') {
          svgContent = `
            <circle cx="${centerX}" cy="${centerY}" r="140" fill="none" stroke="${parameters.colorPalette.accent}" stroke-width="6" opacity="0.4"/>
            <circle cx="${centerX}" cy="${centerY}" r="120" fill="${parameters.colorPalette.background}" stroke="${parameters.colorPalette.primary}" stroke-width="2"/>
            ${hasIcon ? this.renderIcon(iconElement!, centerX, centerY - 30, 3) : ''}
            <text x="${centerX}" y="${centerY + 50}" 
                  font-family="${fontFamily}" font-size="${fontSize - 12}" font-weight="900"
                  fill="${parameters.colorPalette.text}" text-anchor="middle" style="letter-spacing: ${letterSpacing}px">
              ${brandName.toUpperCase()}
            </text>
          `;
        } else {
          svgContent = `
            <rect x="${centerX - 140}" y="${centerY - 140}" width="280" height="280" fill="none" stroke="${parameters.colorPalette.accent}" stroke-width="6" opacity="0.4" rx="20"/>
            <rect x="${centerX - 120}" y="${centerY - 120}" width="240" height="240" fill="${parameters.colorPalette.background}" stroke="${parameters.colorPalette.primary}" stroke-width="2" rx="15"/>
            ${hasIcon ? this.renderIcon(iconElement!, centerX, centerY - 30, 3) : ''}
            <text x="${centerX}" y="${centerY + 50}" 
                  font-family="${fontFamily}" font-size="${fontSize - 12}" font-weight="900"
                  fill="${parameters.colorPalette.text}" text-anchor="middle" style="letter-spacing: ${letterSpacing}px">
              ${brandName.toUpperCase()}
            </text>
          `;
        }
        break;

      case 'monogram':
        // Monogram: Стилизованная первая буква
        const firstLetter = brandName.charAt(0).toUpperCase();
        svgContent = `
          <circle cx="${centerX}" cy="${centerY}" r="100" fill="url(#logoGrad)" opacity="0.2"/>
          <text x="${centerX}" y="${centerY + 35}" 
                font-family="${fontFamily}" font-size="120" font-weight="900"
                fill="url(#logoGrad)" text-anchor="middle" filter="url(#logoGlow)">
            ${firstLetter}
          </text>
          <text x="${centerX}" y="${centerY + 100}" 
                font-family="${fontFamily}" font-size="18" font-weight="600"
                fill="${parameters.colorPalette.text}" text-anchor="middle" opacity="0.7" style="letter-spacing: 2px">
            ${brandName.substring(1).toUpperCase()}
          </text>
        `;
        break;

      case 'wordmark':
        // Wordmark: Только текст с декоративными акцентами
        svgContent = `
          <line x1="${centerX - 100}" y1="${centerY - 20}" x2="${centerX - 20}" y2="${centerY - 20}" stroke="${parameters.colorPalette.accent}" stroke-width="3" opacity="0.5"/>
          <text x="${centerX}" y="${centerY + 15}" 
                font-family="${fontFamily}" font-size="${fontSize}" font-weight="900"
                fill="${parameters.colorPalette.text}" text-anchor="middle" style="letter-spacing: ${letterSpacing}px">
            ${brandName.toUpperCase()}
          </text>
          <line x1="${centerX + 20}" y1="${centerY + 20}" x2="${centerX + 100}" y2="${centerY + 20}" stroke="${parameters.colorPalette.accent}" stroke-width="3" opacity="0.5"/>
        `;
        break;

      case 'lettermark':
        // Lettermark: Аббревиатура из первых букв
        const initials = brandName.split(' ').map(w => w.charAt(0).toUpperCase()).join('').substring(0, 3);
        svgContent = `
          <circle cx="${centerX}" cy="${centerY}" r="90" fill="url(#logoGrad)" opacity="0.15"/>
          <text x="${centerX}" y="${centerY + 25}" 
                font-family="${fontFamily}" font-size="72" font-weight="900"
                fill="url(#logoGrad)" text-anchor="middle" style="letter-spacing: 8px">
            ${initials}
          </text>
        `;
        break;

      case 'abstract':
        // Abstract: Абстрактные геометрические формы
        svgContent = `
          <polygon points="${centerX},${centerY - 80} ${centerX + 60},${centerY + 40} ${centerX - 60},${centerY + 40}" fill="url(#logoGrad)" opacity="0.6"/>
          <circle cx="${centerX - 40}" cy="${centerY - 20}" r="30" fill="${parameters.colorPalette.accent}" opacity="0.4"/>
          <circle cx="${centerX + 40}" cy="${centerY - 20}" r="30" fill="${parameters.colorPalette.secondary}" opacity="0.4"/>
          <text x="${centerX}" y="${centerY + 80}" 
                font-family="${fontFamily}" font-size="${fontSize - 8}" font-weight="900"
                fill="${parameters.colorPalette.text}" text-anchor="middle" style="letter-spacing: ${letterSpacing}px">
            ${brandName.toUpperCase()}
          </text>
        `;
        break;

      case 'combined':
        // Combined: Комбинация иконки и текста в различных пропорциях
        svgContent = `
          ${hasIcon ? this.renderIcon(iconElement!, centerX - 60, centerY, 3) : ''}
          <text x="${centerX + 40}" y="${centerY + 12}" 
                font-family="${fontFamily}" font-size="${fontSize - 8}" font-weight="900"
                fill="${parameters.colorPalette.text}" text-anchor="start" style="letter-spacing: ${letterSpacing}px">
            ${brandName}
          </text>
          <line x1="${centerX - 20}" y1="${centerY - 30}" x2="${centerX - 20}" y2="${centerY + 30}" stroke="${parameters.colorPalette.accent}" stroke-width="2" opacity="0.3"/>
        `;
        break;

      default:
        // Fallback to stacked
        svgContent = `
          ${hasIcon ? this.renderIcon(iconElement!, centerX, centerY - 40, 4) : ''}
        <text x="${centerX}" y="${centerY + 60}" 
              font-family="${fontFamily}" font-size="${fontSize}" font-weight="900"
              fill="${parameters.colorPalette.text}" text-anchor="middle" style="letter-spacing: ${letterSpacing}px">
          ${brandName.toUpperCase()}
        </text>
        `;
    }

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=JetBrains+Mono:wght@800&family=Playfair+Display:wght@900&family=Montserrat:wght@900&family=Pacifico&family=Roboto:wght@900&family=Oswald:wght@700&family=Bebas+Neue&family=Raleway:wght@900&family=Lato:wght@900&family=Poppins:wght@900&family=Nunito:wght@900&display=swap');
          </style>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${parameters.colorPalette.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${parameters.colorPalette.secondary};stop-opacity:1" />
          </linearGradient>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <filter id="metallic" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feSpecularLighting result="specOut" in="blur" specularConstant="1.5" specularExponent="20" lighting-color="#ffffff">
              <fePointLight x="50" y="50" z="200"/>
            </feSpecularLighting>
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
          </filter>
          <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="embossed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feOffset in="blur" dx="2" dy="2" result="offset"/>
            <feFlood flood-color="#ffffff" flood-opacity="0.5"/>
            <feComposite in2="offset" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="shadow3d" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
            <feOffset in="blur" dx="3" dy="3" result="offsetBlur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="logoDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="${parameters.colorPalette.accent}" opacity="0.05"/>
          </pattern>
          <radialGradient id="metallicGrad" cx="50%" cy="50%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8"/>
            <stop offset="50%" style="stop-color:${parameters.colorPalette.primary};stop-opacity:1"/>
            <stop offset="100%" style="stop-color:${parameters.colorPalette.secondary};stop-opacity:0.9"/>
          </radialGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="${parameters.colorPalette.background}"/>
        <rect width="${width}" height="${height}" fill="url(#logoDots)"/>
        ${this.generateDecorativeElements(parameters.style.type, layoutType, parameters, centerX, centerY)}
        ${svgContent}
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }

  private renderIcon(element: any, x: number, y: number, scale: number): string {
    return PreviewGenerator.renderIconPath(element.value, x, y, scale);
  }

  private generateLogoElements(parameters: DesignParameters, width: number, height: number): string {
    const elements: string[] = [];
    const centerX = width / 2;
    const centerY = height / 2 - 40;

    // Рисуем элементы вокруг текста
    parameters.elements.forEach((element, index) => {
      if (element.type === 'shape') {
        const angle = (index * 360) / parameters.elements.length;
        const radius = 60;
        const x = centerX + Math.cos((angle * Math.PI) / 180) * radius;
        const y = centerY + Math.sin((angle * Math.PI) / 180) * radius;

        if (element.value === 'circle') {
          elements.push(
            `<circle cx="${x}" cy="${y}" r="20" 
                     fill="${parameters.colorPalette.accent}" opacity="0.8"/>`
          );
        } else if (element.value === 'square') {
          elements.push(
            `<rect x="${x - 15}" y="${y - 15}" width="30" height="30" 
                   fill="${parameters.colorPalette.accent}" opacity="0.8"/>`
          );
        }
      }
    });

    return elements.join('');
  }
}

