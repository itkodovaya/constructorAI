/**
 * Утилиты для работы с форматами файлов
 */

export class FileUtils {
  /**
   * Определяет MIME тип по расширению файла
   */
  static getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'zip': 'application/zip',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  /**
   * Форматирует размер файла
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Валидирует имя файла
   */
  static isValidFilename(filename: string): boolean {
    // Запрещенные символы в именах файлов
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    return !invalidChars.test(filename) && filename.length > 0 && filename.length < 255;
  }

  /**
   * Очищает имя файла от недопустимых символов
   */
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
      .replace(/\s+/g, '_')
      .substring(0, 255);
  }
}

