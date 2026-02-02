import prisma from '../utils/prisma';

export class OrganizationService {
  static async create(name: string, ownerId: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return await prisma.organization.create({
      data: {
        name,
        slug,
        users: { connect: { id: ownerId } }
      }
    });
  }

  static async getUserOrganizations(userId: string) {
    return await prisma.organization.findMany({
      where: {
        users: { some: { id: userId } }
      },
      include: {
        projects: true,
        users: { select: { id: true, name: true, email: true } }
      }
    });
  }

  static async addProject(orgId: string, projectId: string) {
    return await prisma.project.update({
      where: { id: projectId },
      data: { organizationId: orgId }
    });
  }
}

