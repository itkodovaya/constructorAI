/**
 * Middleware для обработки ошибок
 */

import { Request, Response, NextFunction } from 'express';

export class ErrorHandler {
  static handle(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Error:', err);

    // Ошибки валидации
    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation error',
        details: err.errors,
      });
    }

    // Ошибки базы данных
    if (err.code === 'ENOENT') {
      return res.status(500).json({
        error: 'Database error',
        message: 'Database file not found',
      });
    }

    // Общие ошибки
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  static asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

