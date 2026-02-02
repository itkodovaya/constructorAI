import prisma from '../utils/prisma';

export interface PostData {
  projectId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  author?: string;
  status?: string;
  seoTitle?: string;
  seoDesc?: string;
}

export class BlogService {
  static async getProjectPosts(projectId: string) {
    return await prisma.blogPost.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createPost(data: PostData) {
    return await prisma.blogPost.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        image: data.image,
        author: data.author,
        status: data.status || 'draft',
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
      },
    });
  }

  static async updatePost(id: string, data: Partial<PostData>) {
    return await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        image: data.image,
        author: data.author,
        status: data.status,
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
      },
    });
  }

  static async deletePost(id: string) {
    return await prisma.blogPost.delete({
      where: { id },
    });
  }

  static async getPostBySlug(projectId: string, slug: string) {
    return await prisma.blogPost.findUnique({
      where: {
        projectId_slug: { projectId, slug }
      }
    });
  }
}

