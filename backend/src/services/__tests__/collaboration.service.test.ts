/**
 * Unit тесты для CollaborationService
 */

import { CollaborationService } from '../collaboration.service';

describe('CollaborationService', () => {
  describe('createInvitation', () => {
    it('should create an invitation', async () => {
      const invitation = await CollaborationService.createInvitation(
        'project-1',
        'user@example.com',
        'editor',
        'owner-user-id'
      );

      expect(invitation).toBeDefined();
      expect(invitation.email).toBe('user@example.com');
      expect(invitation.role).toBe('editor');
    });
  });

  describe('acceptInvitation', () => {
    it('should accept invitation and create collaborator', async () => {
      const invitation = await CollaborationService.createInvitation(
        'project-1',
        'user@example.com',
        'editor',
        'owner-user-id'
      );

      const collaborator = await CollaborationService.acceptInvitation(
        invitation.id,
        'user-id',
        'user@example.com',
        'User Name'
      );

      expect(collaborator).toBeDefined();
      expect(collaborator.userId).toBe('user-id');
      expect(collaborator.role).toBe('editor');
    });
  });
});

