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
    const selectedPalette = this.palettes[style as keyof typeof this.palettes] || this.palettes.minimalist;
    const selectedFonts = this.fonts[style as keyof typeof this.fonts] || this.fonts.minimalist;
    
    // Fallback logo generation (template based)
    const generateFallbackLogo = () => {
      return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${selectedPalette[1]}" rx="40"/>
        <text x="50%" y="50%" font-family="${selectedFonts[0]}" font-size="80" font-weight="900" 
          fill="${selectedPalette[0]}" text-anchor="middle" dominant-baseline="central">
          ${brandName.charAt(0).toUpperCase()}
        </text>
      </svg>`;
    };

    let logoSvg = '';

    try {
      const { AIService } = require('./ai.service');
      const prompt = `Create a professional, minimalist SVG logo for a brand named "${brandName}" with style "${style}". 
      Return ONLY the raw SVG code. No markdown, no explanations. 
      The SVG should be 200x200 pixels. 
      Use these colors if appropriate: ${selectedPalette.join(', ')}.
      Make it unique and suitable for a ${style} brand.`;

      const aiResponse = await AIService.generateText(prompt, 600);
      
      // Extract SVG from response (in case AI adds text around it)
      const svgMatch = aiResponse.match(/<svg[\s\S]*?<\/svg>/i);
      if (svgMatch) {
        logoSvg = svgMatch[0];
      } else if (aiResponse.trim().startsWith('<svg') && aiResponse.trim().endsWith('</svg>')) {
        logoSvg = aiResponse.trim();
      } else {
        console.warn('AI did not return a valid SVG, using fallback.');
        logoSvg = generateFallbackLogo();
      }
    } catch (error) {
      console.error('Failed to generate AI logo:', error);
      logoSvg = generateFallbackLogo();
    }

    return {
      logo: `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`,
      palette: selectedPalette,
      fonts: selectedFonts
    };
  }
}

