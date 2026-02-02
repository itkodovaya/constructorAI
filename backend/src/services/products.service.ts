import prisma from '../utils/prisma';

export interface ProductData {
  projectId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId?: string;
  stock?: number;
  isActive?: boolean;
}

export class ProductsService {
  /**
   * Получение всех продуктов проекта
   */
  static async getProjectProducts(projectId: string) {
    return await prisma.product.findMany({
      where: { projectId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Создание продукта
   */
  static async createProduct(data: ProductData) {
    return await prisma.product.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        categoryId: data.categoryId,
        stock: data.stock ?? -1,
        isActive: data.isActive ?? true,
      },
    });
  }

  /**
   * Обновление продукта
   */
  static async updateProduct(id: string, data: Partial<ProductData>) {
    return await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        categoryId: data.categoryId,
        stock: data.stock,
        isActive: data.isActive,
      },
    });
  }

  /**
   * Удаление продукта
   */
  static async deleteProduct(id: string) {
    return await prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Категории
   */
  static async getProjectCategories(projectId: string) {
    return await prisma.category.findMany({
      where: { projectId },
    });
  }

  static async createCategory(projectId: string, name: string) {
    return await prisma.category.create({
      data: { projectId, name },
    });
  }
}

