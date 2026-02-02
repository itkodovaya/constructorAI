/**
 * Digital Asset Management (DAM) сервис (Prisma Version)
 */

import prisma from '../utils/prisma';
import { Asset as PrismaAsset } from '../generated/client';
import * as fs from 'fs';
import * as path from 'path';

export class DAMService {
  private static uploadsDir = path.join(process.cwd(), 'uploads');

  static initialize() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Загружает актив и сохраняет метаданные в БД
   */
  static async uploadAsset(
    userId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    metadata: { projectId?: string; category?: string; tags?: string[]; isPublic?: boolean } = {}
  ): Promise<PrismaAsset> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${fileExtension}`;
    const filePath = path.join(this.uploadsDir, fileName);

    // Физическое сохранение файла
    fs.writeFileSync(filePath, file.buffer);

    let assetType = 'other';
    if (file.mimetype.startsWith('image/')) assetType = 'image';
    else if (file.mimetype.startsWith('video/')) assetType = 'video';
    else if (file.mimetype.startsWith('audio/')) assetType = 'audio';
    else if (file.mimetype.includes('pdf') || file.mimetype.includes('document')) assetType = 'document';

    const asset = await prisma.asset.create({
      data: {
        userId,
        projectId: metadata.projectId,
        name: file.originalname,
        type: assetType,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${fileName}`,
        category: metadata.category || 'uncategorized',
        tags: JSON.stringify(metadata.tags || []),
        metadata: JSON.stringify({ originalSize: file.size }),
        isPublic: metadata.isPublic || false
      }
    });

    return this.parseAsset(asset);
  }

  /**
   * Получение активов из БД с фильтрацией
   */
  static async getUserAssets(userId: string, filters: any = {}): Promise<PrismaAsset[]> {
    const assets = await prisma.asset.findMany({
      where: {
        userId,
        type: filters.type,
        category: filters.category,
        projectId: filters.projectId,
      },
      orderBy: { createdAt: 'desc' }
    });

    return assets.map(a => this.parseAsset(a));
  }

  /**
   * Поиск по активам
   */
  static async searchAssets(query: string, userId: string): Promise<PrismaAsset[]> {
    const assets = await prisma.asset.findMany({
      where: {
        OR: [
          { userId },
          { isPublic: true }
        ],
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { tags: { contains: query } }
            ]
          }
        ]
      }
    });
    return assets.map(a => this.parseAsset(a));
  }

  /**
   * Удаление актива
   */
  static async deleteAsset(assetId: string, userId: string): Promise<boolean> {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset || asset.userId !== userId) return false;

    await prisma.asset.delete({ where: { id: assetId } });

    const fileName = path.basename(asset.url);
    const filePath = path.join(this.uploadsDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return true;
  }

  /**
   * Получение всех ассетов системы (для админки)
   */
  static async getAllAssets(): Promise<PrismaAsset[]> {
    const assets = await prisma.asset.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return assets.map(a => this.parseAsset(a));
  }

  /**
   * Массовое удаление ассетов
   */
  static async deleteAssets(assetIds: string[], userId: string): Promise<number> {
    let deletedCount = 0;
    for (const id of assetIds) {
      const success = await this.deleteAsset(id, userId);
      if (success) deletedCount++;
    }
    return deletedCount;
  }

  /**
   * Перемещение ассета в категорию
   */
  static async moveAsset(assetId: string, userId: string, category: string): Promise<PrismaAsset | null> {
    const updated = await prisma.asset.update({
      where: { id: assetId, userId },
      data: { category }
    });
    return this.parseAsset(updated);
  }

  /**
   * Добавление тегов к ассету
   */
  static async addTags(assetId: string, userId: string, tags: string[]): Promise<PrismaAsset | null> {
    const asset = await prisma.asset.findUnique({ where: { id: assetId, userId } });
    if (!asset) return null;

    const currentTags = asset.tags ? JSON.parse(asset.tags) : [];
    const newTags = Array.from(new Set([...currentTags, ...tags]));
    
    const updated = await prisma.asset.update({
      where: { id: assetId },
      data: { tags: JSON.stringify(newTags) }
    });
    return this.parseAsset(updated);
  }

  private static parseAsset(asset: any): any {
    return {
      ...asset,
      tags: asset.tags ? JSON.parse(asset.tags) : [],
      metadata: asset.metadata ? JSON.parse(asset.metadata) : {}
    };
  }
}

DAMService.initialize();
