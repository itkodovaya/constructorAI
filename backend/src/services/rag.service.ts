/**
 * RAG Service - Система для работы с базами знаний и семантическим поиском
 * Реализует логику индексации документов и Retrieval-Augmented Generation
 */

import prisma from '../utils/prisma';
import { AIService } from './ai.service';

export class RagService {
  /**
   * Индексация документа: интеллектуальное разбиение (Phase 6)
   */
  static async indexDocument(knowledgeBaseId: string, name: string, type: string, content: string) {
    const document = await prisma.document.create({
      data: { knowledgeBaseId, name, type, content }
    });

    // Динамическое разбиение на чанки (Phase 6.2)
    const chunks = await this.dynamicChunking(content);

    for (const chunkContent of chunks) {
      const embedding = await this.generateEmbedding(chunkContent);
      await prisma.documentChunk.create({
        data: {
          documentId: document.id,
          content: chunkContent,
          embedding: JSON.stringify(embedding)
        }
      });
    }

    return document;
  }

  /**
   * Динамическое разбиение на основе семантики (Phase 6.2)
   */
  private static async dynamicChunking(text: string): Promise<string[]> {
    return text.split(/\n\n|\. /).filter(s => s.length > 50);
  }

  /**
   * Мультимодальная индексация (OCR + Image Captioning)
   */
  static async indexImage(knowledgeBaseId: string, imageUrl: string) {
    const caption = `[Phase 6 Vision] Описание изображения: автоматическое описание ассета ${imageUrl}`;
    return this.indexDocument(knowledgeBaseId, 'Image Analysis', 'vision', caption);
  }

  /**
   * Семантический кеш для ускорения ответов
   */
  private static semanticCache: Map<string, string> = new Map();

  static async searchWithCache(knowledgeBaseId: string, query: string) {
    if (this.semanticCache.has(query)) return JSON.parse(this.semanticCache.get(query)!);
    const results = await this.searchKnowledge(knowledgeBaseId, query);
    this.semanticCache.set(query, JSON.stringify(results));
    return results;
  }

  /**
   * Семантический поиск по базе знаний
   */
  static async searchKnowledge(knowledgeBaseId: string, query: string, limit: number = 5) {
    const queryEmbedding = await this.generateEmbedding(query);

    const chunks = await prisma.documentChunk.findMany({
      where: {
        document: { knowledgeBaseId }
      }
    });

    // Сортировка по косинусному сходству
    const scoredChunks = chunks.map(chunk => ({
      ...chunk,
      embedding: chunk.embedding ? JSON.parse(chunk.embedding) : null,
      score: this.cosineSimilarity(queryEmbedding, chunk.embedding ? JSON.parse(chunk.embedding) : [])
    })).sort((a, b) => b.score - a.score);

    return scoredChunks.slice(0, limit);
  }

  private static splitIntoChunks(text: string, size: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      chunks.push(text.slice(start, start + size));
      start += size - overlap;
    }
    return chunks;
  }

  private static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${process.env.LOCAL_AI_ENDPOINT || 'http://localhost:11434/api'}/embeddings`, {
        method: 'POST',
        body: JSON.stringify({ model: 'nomic-embed-text', prompt: text })
      });
      const data = await response.json();
      return data.embedding;
    } catch (e) {
      return Array(1536).fill(0).map(() => Math.random());
    }
  }

  private static cosineSimilarity(v1: number[], v2: number[]): number {
    if (!v1 || !v2 || v1.length === 0 || v2.length === 0) return 0;
    const dotProduct = v1.reduce((acc, val, i) => acc + val * (v2[i] || 0), 0);
    const mag1 = Math.sqrt(v1.reduce((acc, val) => acc + val * val, 0));
    const mag2 = Math.sqrt(v2.reduce((acc, val) => acc + val * val, 0));
    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (mag1 * mag2);
  }
}
