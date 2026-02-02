export interface BrandAssets {
  logo?: string;
  palette: string[];
  fonts: string[];
}

export class BrandService {
  private static palettes = {
    minimalist: ['#F8FAFC', '#0F172A', '#64748B', '#94A3B8'],
    tech: ['#0F172A', '#3B82F6', '#60A5FA', '#1E293B'],
    premium: ['#1A1A1A', '#C5A059', '#F5F5F5', '#333333'],
    vibrant: ['#4F46E5', '#EC4899', '#F59E0B', '#10B981'],
  };

  private static fonts = {
    minimalist: ['Inter', 'Manrope'],
    tech: ['JetBrains Mono', 'Plus Jakarta Sans'],
    premium: ['Playfair Display', 'Cormorant Garamond'],
    vibrant: ['Outfit', 'Space Grotesk'],
  };

  static async generate(brandName: string, style: string): Promise<BrandAssets> {
    // Имитация задержки AI
    await new Promise(resolve => setTimeout(resolve, 800));

    const selectedPalette = this.palettes[style as keyof typeof this.palettes] || this.palettes.minimalist;
    const selectedFonts = this.fonts[style as keyof typeof this.fonts] || this.fonts.minimalist;
    
    // Генерация простого текстового логотипа (SVG)
    const logoSvg = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${selectedPalette[1]}" rx="40"/>
      <text x="50%" y="50%" font-family="${selectedFonts[0]}" font-size="80" font-weight="900" 
        fill="${selectedPalette[0]}" text-anchor="middle" dominant-baseline="central">
        ${brandName.charAt(0).toUpperCase()}
      </text>
    </svg>`;

    return {
      logo: `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`,
      palette: selectedPalette,
      fonts: selectedFonts
    };
  }
}

