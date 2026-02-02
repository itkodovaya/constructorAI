/**
 * Export Service - Микросервис для экспорта проектов
 */

import express from 'express';
import cors from 'cors';
import { PDFDocument } from 'pdf-lib';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const port = 3006;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Экспорт проекта в HTML
app.post('/api/export/html', async (req, res) => {
  try {
    const { project, pages } = req.body;

    if (!project) {
      return res.status(400).json({ error: 'Project data is required' });
    }

    // Генерация HTML
    const html = generateHTML(project, pages || []);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="${project.brandName || 'project'}.html"`);
    res.send(html);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Экспорт презентации в PDF
app.post('/api/export/pdf', async (req, res) => {
  try {
    const { slides, format } = req.body;

    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({ error: 'Slides data is required' });
    }

    const pdfDoc = await PDFDocument.create();
    const { width, height } = format === '4:3' 
      ? { width: 1024, height: 768 }
      : { width: 1920, height: 1080 };

    for (const slide of slides) {
      const page = pdfDoc.addPage([width, height]);
      // Здесь была бы генерация содержимого слайда
      // Для демо оставляем пустую страницу
    }

    const pdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="presentation.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Экспорт бренд-кита в ZIP
app.post('/api/export/brandkit', async (req, res) => {
  try {
    const { brandAssets, brandName } = req.body;

    if (!brandAssets) {
      return res.status(400).json({ error: 'Brand assets are required' });
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${brandName || 'brandkit'}.zip"`);
    
    archive.pipe(res);

    // Добавляем логотип
    if (brandAssets.logo) {
      archive.append(brandAssets.logo, { name: 'logo.svg' });
    }

    // Добавляем палитру
    archive.append(JSON.stringify(brandAssets.palette || [], null, 2), { name: 'palette.json' });

    // Добавляем информацию о шрифтах
    archive.append(JSON.stringify(brandAssets.fonts || [], null, 2), { name: 'fonts.json' });

    await archive.finalize();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Генерация HTML из проекта
function generateHTML(project: any, pages: any[]): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.brandName || 'Project'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: #fff;
    }
  </style>
</head>
<body>
  <h1>${project.brandName || 'Project'}</h1>
  ${pages.map(page => `<section>${page.content || ''}</section>`).join('')}
</body>
</html>`;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'export-service' });
});

app.listen(port, () => {
  console.log(`Export Service running at http://localhost:${port}`);
});

