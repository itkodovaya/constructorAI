/**
 * Unit тесты для ExportService
 */

import { ExportService } from '../export.service';

describe('ExportService', () => {
  describe('generateHTML', () => {
    it('should generate HTML with basic blocks', () => {
      const brandName = 'Test Brand';
      const assets = {
        palette: ['#2563eb', '#1e40af'],
        fonts: ['Inter']
      };
      const blocks = [
        {
          id: '1',
          type: 'hero',
          content: {
            title: 'Welcome',
            subtitle: 'Test subtitle'
          }
        }
      ];

      const html = ExportService.generateHTML(brandName, assets, blocks);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Test Brand');
      expect(html).toContain('Welcome');
    });

    it('should include SEO meta tags', () => {
      const brandName = 'Test Brand';
      const assets = { palette: ['#2563eb'], fonts: ['Inter'] };
      const blocks = [];
      const seo = {
        title: 'SEO Title',
        description: 'SEO Description',
        ogImage: 'https://example.com/image.jpg',
        lang: 'en'
      };

      const html = ExportService.generateHTML(brandName, assets, blocks, seo, 'en');

      expect(html).toContain('<meta property="og:title"');
      expect(html).toContain('SEO Title');
      expect(html).toContain('lang="en"');
    });
  });
});

