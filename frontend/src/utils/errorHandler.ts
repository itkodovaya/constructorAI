/**
 * Улучшенная обработка ошибок на фронтенде
 */

import { AxiosError } from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Axios ошибки
    if ('response' in error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const data = axiosError.response.data as any;
        if (data?.details) {
          return `Ошибка валидации: ${data.details.map((d: any) => d.message).join(', ')}`;
        }
        return data?.error || `Ошибка ${axiosError.response.status}`;
      }
      if (axiosError.request) {
        return 'Сервер не отвечает. Проверьте подключение.';
      }
    }
    return error.message;
  }

  return 'Произошла неизвестная ошибка';
}

export function showErrorNotification(message: string) {
  // В реальном приложении можно использовать toast библиотеку
  alert(`Ошибка: ${message}`);
}

