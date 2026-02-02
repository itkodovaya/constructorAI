/**
 * Unit тесты для ProjectsService
 */

import { ProjectsService } from '../projects.service';

describe('ProjectsService', () => {
  beforeEach(() => {
    // Очистка данных перед каждым тестом
  });

  describe('create', () => {
    it('should create a new project with required fields', async () => {
      const projectData = {
        brandName: 'Test Brand',
        niche: 'tech',
        style: 'modern',
        colors: ['#000000', '#ffffff'],
        goals: ['goal1', 'goal2']
      };

      const project = await ProjectsService.create(projectData);

      expect(project).toBeDefined();
      expect(project.brandName).toBe('Test Brand');
      expect(project.niche).toBe('tech');
      expect(project.brandAssets).toBeDefined();
      expect(project.pages).toBeDefined();
      expect(project.pages.length).toBeGreaterThan(0);
    });
  });

  describe('getById', () => {
    it('should return project by id', async () => {
      const projectData = {
        brandName: 'Test Brand',
        niche: 'tech',
        style: 'modern',
        colors: [],
        goals: []
      };

      const created = await ProjectsService.create(projectData);
      const found = await ProjectsService.getById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });
  });
});

