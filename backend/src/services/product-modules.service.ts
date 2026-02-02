/**
 * Сервис электронной коммерции (E-commerce)
 */

import prisma from '../utils/prisma';

export class EcommerceService {
  /**
   * Добавление товара в каталог проекта
   */
  static async addProduct(projectId: string, productData: any) {
    // В реальности: создание записи в таблице Product
    // Сейчас используем JSON-хранилище в метаданных проекта
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('Project not found');

    const products = (project.brandAssets as any)?.products || [];
    const newProduct = {
      id: `prod_${Date.now()}`,
      name: productData.name,
      price: productData.price,
      description: productData.description,
      image: productData.image,
      category: productData.category || 'General'
    };

    await prisma.project.update({
      where: { id: projectId },
      data: {
        brandAssets: {
          ...(project.brandAssets as any),
          products: [...products, newProduct]
        } as any
      }
    });

    return newProduct;
  }

  /**
   * Получение каталога
   */
  static async getCatalog(projectId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    return (project?.brandAssets as any)?.products || [];
  }
}

/**
 * Сервис для управления блогами и статьями
 */
export class BlogService {
  /**
   * Генерация статьи с помощью AI
   */
  static async generateArticle(topic: string, style: string = 'professional') {
    // В реальности: вызов OpenAI
    return {
      title: `Как ${topic} меняет индустрию`,
      content: `Это сгенерированная статья на тему "${topic}". Она написана в ${style} стиле...`,
      excerpt: `Краткий обзор статьи о ${topic}...`,
      tags: [topic.split(' ')[0], 'AI', 'Trends']
    };
  }

  /**
   * Сохранение статьи в проекте
   */
  static async saveArticle(projectId: string, article: any) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    const articles = (project?.brandAssets as any)?.articles || [];
    
    const newArticle = {
      id: `art_${Date.now()}`,
      ...article,
      createdAt: new Date().toISOString()
    };

    await prisma.project.update({
      where: { id: projectId },
      data: {
        brandAssets: {
          ...(project?.brandAssets as any),
          articles: [...articles, newArticle]
        } as any
      }
    });

    return newArticle;
  }
}

