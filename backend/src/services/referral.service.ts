/**
 * Сервис реферальной программы (Prisma Version)
 */

import prisma from '../utils/prisma';
import { Referral as PrismaReferral } from '../generated/client';

export class ReferralService {
  /**
   * Генерация ссылки
   */
  static generateReferralLink(userId: string, type: string = 'user'): string {
    const code = Buffer.from(`${userId}:${type}`).toString('base64');
    return `https://constructor.ai/ref/${code}`;
  }

  /**
   * Регистрация реферала в БД
   */
  static async registerReferral(referrerId: string, referredEmail: string, type: string): Promise<PrismaReferral> {
    return await prisma.referral.create({
      data: {
        referrerId,
        referredEmail,
        type,
        status: 'pending',
        rewardAmount: type === 'user' ? 100 : 500
      }
    });
  }

  /**
   * Активация реферала (при регистрации)
   */
  static async activateReferral(email: string, userId: string) {
    const referral = await prisma.referral.findFirst({
      where: { referredEmail: email, status: 'pending' }
    });

    if (referral) {
      return await prisma.referral.update({
        where: { id: referral.id },
        data: {
          status: 'active',
          activatedAt: new Date()
        }
      });
    }
  }

  /**
   * Получение статистики пользователя
   */
  static async getReferralStats(userId: string) {
    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId }
    });

    return {
      total: referrals.length,
      active: referrals.filter(r => r.status === 'active').length,
      earnings: referrals.reduce((sum, r) => sum + r.rewardAmount, 0)
    };
  }
}
