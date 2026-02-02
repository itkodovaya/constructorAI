import { describe, it, expect } from 'vitest';
import { AISiteGeneratorService } from '../services/ai-site-generator.service';

describe('AISiteGeneratorService', () => {
  it('generates site structure', async () => {
    const result = await AISiteGeneratorService.generateSiteStructure({
      brandName: 'Test',
      niche: 'Tech',
      goals: ['site']
    });
    expect(result.pages).toBeDefined();
    expect(result.metadata.aiGenerated).toBe(true);
  });
});
