/**
 * Unit тесты для UserService
 */

import { UserService } from '../user.service';

describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = await UserService.createUser(
        'test@example.com',
        'password123',
        'Test User'
      );

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.plan).toBe('free');
    });
  });

  describe('authenticate', () => {
    it('should authenticate user with correct credentials', async () => {
      await UserService.createUser('test@example.com', 'password123', 'Test User');
      
      const result = await UserService.authenticate('test@example.com', 'password123');

      expect(result).toBeDefined();
      expect(result?.user.email).toBe('test@example.com');
      expect(result?.token).toBeDefined();
    });
  });

  describe('getPlanLimits', () => {
    it('should return correct limits for free plan', () => {
      const limits = UserService.getPlanLimits('free');
      
      expect(limits.projectsLimit).toBe(3);
      expect(limits.aiGenerationsLimit).toBe(10);
    });
  });
});

