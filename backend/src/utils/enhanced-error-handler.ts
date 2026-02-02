/**
 * Улучшенная обработка ошибок с логированием
 */

import { logger } from './logger';
import { metrics } from './metrics';

export class ErrorHandler {
  /**
   * Обработка ошибок API запросов
   */
  static handleApiError(error: any, req: any, res: any, next: any) {
    // Логирование ошибки
    logger.error('API Error', {
      method: req.method,
      path: req.path,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    // Запись метрики
    metrics.increment('api_errors_total', {
      method: req.method,
      path: req.path,
      status: error.statusCode?.toString() || '500'
    });

    // Определение статуса
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal Server Error';

    // Формирование ответа
    const response: any = {
      error: message,
      timestamp: new Date().toISOString()
    };

    // Добавление деталей в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      response.details = {
        stack: error.stack,
        originalError: error.toString()
      };
    }

    res.status(statusCode).json(response);
  }

  /**
   * Обработка необработанных ошибок
   */
  static handleUnhandledRejection(reason: any, promise: Promise<any>) {
    logger.error('Unhandled Rejection', {
      reason: reason?.toString(),
      promise: promise.toString()
    });

    metrics.increment('unhandled_rejections_total');
  }

  /**
   * Обработка необработанных исключений
   */
  static handleUncaughtException(error: Error) {
    logger.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack
    });

    metrics.increment('uncaught_exceptions_total');

    // В production лучше завершить процесс
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  /**
   * Валидация ошибок
   */
  static isValidationError(error: any): boolean {
    return error.name === 'ValidationError' || error.name === 'ZodError';
  }

  /**
   * Ошибка аутентификации
   */
  static isAuthError(error: any): boolean {
    return error.statusCode === 401 || error.name === 'UnauthorizedError';
  }

  /**
   * Ошибка доступа
   */
  static isForbiddenError(error: any): boolean {
    return error.statusCode === 403 || error.name === 'ForbiddenError';
  }

  /**
   * Ошибка не найдено
   */
  static isNotFoundError(error: any): boolean {
    return error.statusCode === 404 || error.name === 'NotFoundError';
  }
}

