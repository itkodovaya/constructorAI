import prisma from '../utils/prisma';

export class KnowledgeService {
  /**
   * Add a document to the knowledge base
   */
  static async addDocument(knowledgeBaseId: string, name: string, type: string, content: string) {
    const document = await prisma.document.create({
      data: {
        knowledgeBaseId,
        name,
        type,
        content
      }
    });

    // Simple mock chunking (in reality would use a proper chunking strategy)
    const chunks = this.chunkText(content);
    for (const chunk of chunks) {
      await prisma.documentChunk.create({
        data: {
          documentId: document.id,
          content: chunk,
          // In a real RAG, we would generate an embedding here
          embedding: JSON.stringify(new Array(1536).fill(0).map(() => Math.random()))
        }
      });
    }

    return document;
  }

  /**
   * Simple text chunking
   */
  private static chunkText(text: string, size: number = 1000): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
      chunks.push(text.slice(i, i + size));
      i += size;
    }
    return chunks;
  }

  /**
   * Search for relevant context across documents (Simple Keyword Search for Mock RAG)
   */
  static async queryContext(organizationId: string, query: string): Promise<string[]> {
    const kbs = await prisma.knowledgeBase.findMany({
      where: { organizationId },
      include: {
        documents: {
          include: {
            chunks: true
          }
        }
      }
    });

    const relevantChunks: string[] = [];
    const queryLower = query.toLowerCase();

    for (const kb of kbs) {
      for (const doc of kb.documents) {
        for (const chunk of doc.chunks) {
          if (chunk.content.toLowerCase().includes(queryLower)) {
            relevantChunks.push(chunk.content);
          }
        }
      }
    }

    // Return top 3 relevant chunks
    return relevantChunks.slice(0, 3);
  }

  static async getOrganizationKBs(organizationId: string) {
    return await prisma.knowledgeBase.findMany({
      where: { organizationId },
      include: { documents: true }
    });
  }

  static async createKB(organizationId: string, name: string, description?: string) {
    return await prisma.knowledgeBase.create({
      data: { organizationId, name, description }
    });
  }
}

