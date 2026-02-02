/**
 * Сервис платежей и финансовых операций (Payment & Payouts)
 */

import prisma from '../utils/prisma';

export interface PaymentIntent {
  amount: number;
  currency: string;
  metadata: any;
}

export class PaymentService {
  /**
   * Создание платежной сессии (Stripe Mock)
   */
  static async createCheckoutSession(userId: string, itemId: string) {
    const item = await prisma.customComponent.findUnique({ where: { id: itemId } });
    if (!item) throw new Error('Item not found');

    const price = (item.props as any)?.price || 0;

    // В реальности здесь вызывается stripe.checkout.sessions.create
    const session = {
      id: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
      url: `https://checkout.stripe.com/pay/${Math.random().toString(36).substr(2, 9)}`,
      amount: price,
      itemId: itemId
    };

    return session;
  }

  /**
   * Обработка успешного платежа (Webhook)
   */
  static async handleSuccessfulPayment(userId: string, itemId: string, amount: number) {
    return await prisma.$transaction(async (tx) => {
      // 1. Создаем запись о покупке
      const purchase = await tx.purchase.create({
        data: {
          userId,
          itemId,
          itemType: 'marketplace_item',
          amount,
          status: 'completed'
        }
      });

      // 2. Начисляем средства автору (минус комиссия платформы 20%)
      const item = await tx.customComponent.findUnique({ where: { id: itemId } });
      if (item) {
        const authorId = item.authorId;
        const authorEarnings = amount * 0.8;

        // Обновляем баланс автора (в расширенной схеме была бы таблица Wallet)
        await tx.user.update({
          where: { id: authorId },
          data: {
            // Используем поле в metadata для хранения баланса в текущей схеме
            // В реальности это отдельная колонка balance
            name: item.authorId // Заглушка, предполагаем наличие баланса
          }
        });
      }

      return purchase;
    });
  }

  /**
   * Запрос на вывод средств
   */
  static async requestPayout(userId: string, amount: number, method: string) {
    // В реальности: проверка баланса и создание Payout в Stripe/PayPal
    console.log(`Payout requested for user ${userId}: ${amount} via ${method}`);
    return { status: 'pending', requestId: `req_${Date.now()}` };
  }
}

