import archiver from 'archiver';
import * as fs from 'fs';

export interface BrandKitExportOptions {
  brandName: string;
  logoUrl?: string;
  logoSvg?: string;
  palette: string[];
  fonts: string[];
  socialTemplates?: Array<{ name: string; image: string }>;
}

export class BrandKitExportService {
  static async exportToZIP(options: BrandKitExportOptions, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => {
        resolve();
      });
      
      archive.on('error', (err) => {
        reject(err);
      });
      
      archive.pipe(output);
      
      // Добавляем логотип
      if (options.logoSvg) {
        archive.append(options.logoSvg, { name: 'logo.svg' });
      } else if (options.logoUrl) {
        // Если есть URL, можно добавить placeholder или скачать
        archive.append(`<!-- Logo URL: ${options.logoUrl} -->`, { name: 'logo-url.txt' });
      }
      
      // Добавляем палитру в JSON
      const paletteData = {
        brandName: options.brandName,
        colors: options.palette,
        exportDate: new Date().toISOString()
      };
      archive.append(JSON.stringify(paletteData, null, 2), { name: 'palette.json' });
      
      // Добавляем информацию о шрифтах
      const fontsData = {
        fonts: options.fonts,
        note: 'Установите эти шрифты для использования бренд-кита'
      };
      archive.append(JSON.stringify(fontsData, null, 2), { name: 'fonts.json' });
      
      // Добавляем README
      const readme = `# Бренд-кит: ${options.brandName}

## Содержимое

- \`logo.svg\` - Логотип в формате SVG
- \`palette.json\` - Цветовая палитра бренда
- \`fonts.json\` - Используемые шрифты
${options.socialTemplates && options.socialTemplates.length > 0 ? '- \`social/\` - Шаблоны для социальных сетей' : ''}

## Использование

1. Откройте \`palette.json\` для получения цветов бренда
2. Установите шрифты из \`fonts.json\`
3. Используйте \`logo.svg\` в ваших проектах
${options.socialTemplates && options.socialTemplates.length > 0 ? '4. Шаблоны для соцсетей находятся в папке \`social/\`' : ''}

Создано в Constructor AI Platform
`;
      archive.append(readme, { name: 'README.md' });
      
      // Добавляем шаблоны для соцсетей, если есть
      if (options.socialTemplates && options.socialTemplates.length > 0) {
        for (const template of options.socialTemplates) {
          // Здесь можно добавить реальные изображения, если они есть
          archive.append(`Template: ${template.name}\nImage: ${template.image}`, { 
            name: `social/${template.name}.txt` 
          });
        }
      }
      
      archive.finalize();
    });
  }
  
  static async exportToZIPBuffer(options: BrandKitExportOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      archive.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      
      archive.on('error', (err) => {
        reject(err);
      });
      
      // Добавляем те же файлы, что и в exportToZIP
      if (options.logoSvg) {
        archive.append(options.logoSvg, { name: 'logo.svg' });
      }
      
      const paletteData = {
        brandName: options.brandName,
        colors: options.palette,
        exportDate: new Date().toISOString()
      };
      archive.append(JSON.stringify(paletteData, null, 2), { name: 'palette.json' });
      
      const fontsData = {
        fonts: options.fonts,
        note: 'Установите эти шрифты для использования бренд-кита'
      };
      archive.append(JSON.stringify(fontsData, null, 2), { name: 'fonts.json' });
      
      const readme = `# Бренд-кит: ${options.brandName}

Создано в Constructor AI Platform
`;
      archive.append(readme, { name: 'README.md' });
      
      archive.finalize();
    });
  }
}

