/**
 * Валидация данных проекта с помощью Zod
 */

import { z } from 'zod';

// Схема для создания проекта (Onboarding)
export const CreateProjectSchema = z.object({
  brandName: z.string().min(2, 'Название бренда должно быть не менее 2 символов').max(100),
  niche: z.string().min(1, 'Ниша обязательна'),
  style: z.string(), // Более гибкий тип для демо
  colors: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
  metadata: z.any().optional(), // Дополнительные данные (selectedDesign, selectedLogo и т.д.)
});

// Схема для обновления проекта
export const UpdateProjectSchema = z.object({
  brandName: z.string().min(2).max(100).optional(),
  niche: z.string().min(1).optional(),
  style: z.string().optional(),
  colors: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
  brandAssets: z.any().optional(),
  seo: z.any().optional(),
  pages: z.array(z.any()).optional(),
  presentation: z.array(z.any()).optional(),
}).partial();

// Схема для блока сайта
export const BlockSchema = z.object({
  id: z.string(),
  type: z.enum(['hero', 'features', 'gallery', 'text', 'footer', 'pricing', 'testimonials', 'faq']),
  content: z.any(),
  style: z.any().optional(),
});

// Схема для SEO данных
export const SEOSchema = z.object({
  title: z.string().max(60, 'Title должен быть не более 60 символов'),
  description: z.string().max(160, 'Description должен быть не более 160 символов'),
  keywords: z.string().max(200).optional(),
  ogImage: z.string().url('OG Image должен быть валидным URL').optional(),
});

// Валидация с обработкой ошибок
export function validateProject(data: any, schema: z.ZodSchema) {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      console.error('[Validation] Zod error issues:', result.error.issues);
      return {
        success: false,
        errors: result.error.issues.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
  } catch (error: any) {
    console.error('[Validation] Unexpected error:', error);
    return {
      success: false,
      errors: [{ path: 'unknown', message: error.message || 'Ошибка валидации' }],
    };
  }
}

