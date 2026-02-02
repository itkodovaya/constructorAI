/**
 * Расширенный сервис маркетплейса (Marketplace 2.0)
 */

import prisma from '../utils/prisma';

export interface MarketplaceItemSubmission {
  name: string;
  description: string;
  price: number;
  category: string;
  type: 'template' | 'component' | 'plugin';
  content: any;
  licenseType: 'personal' | 'commercial';
}

export class MarketplaceService {
  /**
   * Отправка айтема на модерацию
   */
  static async submitItem(authorId: string, submission: MarketplaceItemSubmission) {
    return await prisma.customComponent.create({
      data: {
        authorId,
        name: submission.name,
        description: submission.description,
        category: submission.category,
        code: JSON.stringify(submission.content),
        isPublic: false, // Ожидает модерации
        props: {
          price: submission.price,
          type: submission.type,
          license: submission.licenseType,
          status: 'pending_moderation'
        } as any
      }
    });
  }

  /**
   * Получение статистики автора
   */
  static async getAuthorStats(authorId: string) {
    const items = await prisma.customComponent.findMany({
      where: { authorId }
    });

    const purchases = await prisma.purchase.findMany({
      where: { itemId: { in: items.map(i => i.id) } }
    });

    const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

    return {
      itemsCount: items.length,
      salesCount: purchases.length,
      totalRevenue,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        status: (item.props as any)?.status || 'active',
        sales: purchases.filter(p => p.itemId === item.id).length,
        revenue: purchases.filter(p => p.itemId === item.id).reduce((sum, p) => sum + p.amount, 0)
      }))
    };
  }

  /**
   * Модерация (для админки)
   */
  static async moderateItem(itemId: string, approve: boolean, reason?: string) {
    return await prisma.customComponent.update({
      where: { id: itemId },
      data: {
        isPublic: approve,
        props: {
          status: approve ? 'active' : 'rejected',
          moderationNote: reason
        } as any
      }
    });
  }

  /**
   * Покупка с учетом лицензии
   */
  static async purchaseItem(userId: string, itemId: string) {
    const item = await prisma.customComponent.findUnique({ where: { id: itemId } });
    if (!item) throw new Error('Item not found');

    const price = (item.props as any)?.price || 0;

    return await prisma.purchase.create({
      data: {
        userId,
        itemId,
        itemType: (item.props as any)?.type || 'component',
        amount: price,
        status: 'completed'
      }
    });
  }
}
