/**
 * Swagger/OpenAPI документация для Constructor AI Platform
 */

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Constructor AI Platform API',
    version: '3.5.0',
    description: 'API для создания брендов, сайтов и презентаций с помощью AI',
    contact: {
      name: 'Constructor AI Support',
      email: 'support@constructor.ai'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Development server'
    },
    {
      url: 'https://api.constructor.ai/api',
      description: 'Production server'
    }
  ],
  tags: [
    { name: 'Authentication', description: 'Аутентификация и управление пользователями' },
    { name: 'Projects', description: 'Управление проектами' },
    { name: 'Collaboration', description: 'Коллаборация и роли' },
    { name: 'Templates', description: 'Маркетплейс шаблонов' },
    { name: 'AI', description: 'AI генерация контента' },
    { name: 'Export', description: 'Экспорт проектов' }
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token'
      }
    },
    schemas: {
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          ownerId: { type: 'string' },
          brandName: { type: 'string' },
          niche: { type: 'string' },
          brandAssets: {
            type: 'object',
            properties: {
              logoUrl: { type: 'string' },
              logoSvg: { type: 'string' },
              palette: { type: 'array', items: { type: 'string' } },
              fonts: { type: 'array', items: { type: 'string' } }
            }
          },
          pages: { type: 'array' },
          presentation: { type: 'array' },
          seo: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              keywords: { type: 'string' },
              ogTitle: { type: 'string' },
              ogDescription: { type: 'string' },
              ogImage: { type: 'string' },
              lang: { type: 'string' }
            }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          plan: { type: 'string', enum: ['free', 'pro', 'brandkit'] },
          usage: {
            type: 'object',
            properties: {
              projects: { type: 'number' },
              ai_generation: { type: 'number' }
            }
          }
        }
      },
      Template: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string', enum: ['website', 'presentation', 'social', 'brandkit'] },
          thumbnail: { type: 'string' },
          price: { type: 'number' },
          rating: { type: 'number' },
          downloadsCount: { type: 'number' }
        }
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Регистрация нового пользователя',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  name: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Пользователь создан',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' }
                  }
                }
              }
            }
          },
          '400': { description: 'Ошибка валидации' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Вход пользователя',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Успешный вход',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' }
                  }
                }
              }
            }
          },
          '401': { description: 'Неверные учетные данные' }
        }
      }
    },
    '/projects': {
      get: {
        tags: ['Projects'],
        summary: 'Получить все проекты пользователя',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Список проектов',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Project' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Projects'],
        summary: 'Создать новый проект',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['brandName', 'niche'],
                properties: {
                  brandName: { type: 'string' },
                  niche: { type: 'string' },
                  style: { type: 'string' },
                  colors: { type: 'array', items: { type: 'string' } },
                  goals: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Проект создан',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Project' }
              }
            }
          }
        }
      }
    },
    '/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Получить проект по ID',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Проект найден',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Project' }
              }
            }
          },
          '404': { description: 'Проект не найден' }
        }
      },
      put: {
        tags: ['Projects'],
        summary: 'Обновить проект',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Проект обновлен',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Project' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Projects'],
        summary: 'Удалить проект',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '204': { description: 'Проект удален' },
          '404': { description: 'Проект не найден' }
        }
      }
    },
    '/projects/{id}/invite': {
      post: {
        tags: ['Collaboration'],
        summary: 'Пригласить участника в проект',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'role'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  role: { type: 'string', enum: ['owner', 'editor', 'viewer'] }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Приглашение создано',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    invitation: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        expiresAt: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/templates': {
      get: {
        tags: ['Templates'],
        summary: 'Получить шаблоны',
        parameters: [
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string', enum: ['website', 'presentation', 'social', 'brandkit'] }
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' }
          },
          {
            name: 'featured',
            in: 'query',
            schema: { type: 'boolean' }
          }
        ],
        responses: {
          '200': {
            description: 'Список шаблонов',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    templates: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Template' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

