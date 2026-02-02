/**
 * Утилиты для работы с цветами
 */

export class ColorUtils {
  /**
   * Конвертирует HEX в RGB
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Конвертирует RGB в HEX
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  }

  /**
   * Вычисляет яркость цвета (0-255)
   */
  static getLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    return (0.299 * r + 0.587 * g + 0.114 * b);
  }

  /**
   * Определяет, нужен ли темный или светлый текст на фоне
   */
  static getContrastColor(hex: string): '#000000' | '#FFFFFF' {
    return this.getLuminance(hex) > 128 ? '#000000' : '#FFFFFF';
  }

  /**
   * Осветляет цвет
   */
  static lighten(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    
    const { r, g, b } = rgb;
    const factor = 1 + percent / 100;
    
    return this.rgbToHex(
      Math.min(255, Math.round(r * factor)),
      Math.min(255, Math.round(g * factor)),
      Math.min(255, Math.round(b * factor))
    );
  }

  /**
   * Затемняет цвет
   */
  static darken(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    
    const { r, g, b } = rgb;
    const factor = 1 - percent / 100;
    
    return this.rgbToHex(
      Math.max(0, Math.round(r * factor)),
      Math.max(0, Math.round(g * factor)),
      Math.max(0, Math.round(b * factor))
    );
  }

  /**
   * Генерирует палитру из одного цвета
   */
  static generatePalette(baseColor: string): string[] {
    return [
      this.lighten(baseColor, 40),
      this.lighten(baseColor, 20),
      baseColor,
      this.darken(baseColor, 20),
      this.darken(baseColor, 40),
    ];
  }
}

