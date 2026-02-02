import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Slide } from './presentation.service';

export interface ExportPresentationOptions {
  format: '16:9' | '4:3';
  slides: Slide[];
  brandName: string;
  brandAssets?: any;
}

export class PresentationExportService {
  static async exportToPDF(options: ExportPresentationOptions): Promise<Buffer> {
    const { format, slides, brandName, brandAssets } = options;
    
    // Размеры слайдов в зависимости от формата
    const dimensions = format === '16:9' 
      ? { width: 1920, height: 1080 } 
      : { width: 1920, height: 1440 };
    
    // Создаем PDF документ
    const pdfDoc = await PDFDocument.create();
    const palette = brandAssets?.palette || ['#2563eb', '#1e40af'];
    
    // Конвертируем цвета из hex в RGB
    const primaryColor = this.hexToRgb(palette[0] || '#2563eb');
    const secondaryColor = this.hexToRgb(palette[1] || '#1e40af');
    
    // Загружаем шрифты
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Создаем страницу для каждого слайда
    for (const slide of slides) {
      const page = pdfDoc.addPage([dimensions.width / 4, dimensions.height / 4]); // Масштабируем для PDF
      
      // Фон страницы
      page.drawRectangle({
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
        color: rgb(1, 1, 1), // Белый фон
      });
      
      // Заголовок слайда
      if (slide.title) {
        page.drawText(slide.title, {
          x: 50,
          y: page.getHeight() - 100,
          size: 36,
          font: helveticaBoldFont,
          color: rgb(primaryColor.r, primaryColor.g, primaryColor.b),
        });
      }
      
      // Содержимое слайда
      if (slide.content) {
        const contentLines = this.wrapText(slide.content, page.getWidth() - 100, helveticaFont, 24);
        let yPos = page.getHeight() - 180;
        
        for (const line of contentLines) {
          page.drawText(line, {
            x: 50,
            y: yPos,
            size: 24,
            font: helveticaFont,
            color: rgb(0.2, 0.2, 0.2),
          });
          yPos -= 35;
        }
      }
      
      // Добавляем номер слайда и название бренда в футер
      const pageNumber = slides.indexOf(slide) + 1;
      page.drawText(`${brandName} - Слайд ${pageNumber}`, {
        x: 50,
        y: 30,
        size: 12,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
      });
    }
    
    // Генерируем PDF байты
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
  
  private static hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0.15, g: 0.39, b: 0.92 }; // Дефолтный синий
  }
  
  private static wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }
}

