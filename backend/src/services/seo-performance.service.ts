import prisma from '../utils/prisma';

export class SeoPerformanceService {
  /**
   * Генерация sitemap.xml для проекта
   */
  static async generateSitemap(projectId: string, domain: string = 'https://mysite.com') {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return '';

    const pages = JSON.parse(project.pages || '[]');
    const posts = await prisma.blogPost.findMany({ where: { projectId, status: 'published' } });

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Страницы
    pages.forEach((p: any) => {
      xml += `  <url>\n    <loc>${domain}/${p.id === '1' ? 'index' : p.id}.html</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <priority>${p.id === '1' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });

    // Блог
    posts.forEach((p: any) => {
      xml += `  <url>\n    <loc>${domain}/${p.slug}.html</loc>\n    <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Имитация оптимизации изображения (WebP, Resize)
   */
  static async optimizeImage(url: string, options: { width?: number, quality?: number } = {}) {
    console.log(`[OPTIMIZER] Optimizing image: ${url} with options:`, options);
    
    // В реальности: использование Sharp или внешнего сервиса
    // Возвращаем "оптимизированную" ссылку (в данном случае просто ту же для демонстрации структуры)
    if (url.includes('unsplash.com')) {
      return `${url}&fm=webp&q=${options.quality || 80}${options.width ? '&w=' + options.width : ''}`;
    }
    
    return url;
  }
}

