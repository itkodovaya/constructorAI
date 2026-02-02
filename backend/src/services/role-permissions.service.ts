/**
 * Сервис для управления granular ролями и правами доступа
 * Реализует модель: owner, admin, editor, commenter, viewer
 */

export type GranularRole = 'owner' | 'admin' | 'editor' | 'commenter' | 'viewer';

export interface Permission {
  resource: string; // 'project', 'page', 'block', 'asset', 'settings'
  action: string; // 'read', 'write', 'delete', 'share', 'export'
}

export interface RolePermissions {
  role: GranularRole;
  permissions: Permission[];
  description: string;
}

// Определение прав для каждой роли
const ROLE_PERMISSIONS: Record<GranularRole, RolePermissions> = {
  owner: {
    role: 'owner',
    description: 'Полный доступ ко всем функциям проекта',
    permissions: [
      { resource: 'project', action: 'read' },
      { resource: 'project', action: 'write' },
      { resource: 'project', action: 'delete' },
      { resource: 'project', action: 'share' },
      { resource: 'project', action: 'export' },
      { resource: 'project', action: 'settings' },
      { resource: 'page', action: 'read' },
      { resource: 'page', action: 'write' },
      { resource: 'page', action: 'delete' },
      { resource: 'block', action: 'read' },
      { resource: 'block', action: 'write' },
      { resource: 'block', action: 'delete' },
      { resource: 'asset', action: 'read' },
      { resource: 'asset', action: 'write' },
      { resource: 'asset', action: 'delete' },
      { resource: 'collaborator', action: 'read' },
      { resource: 'collaborator', action: 'write' },
      { resource: 'collaborator', action: 'delete' },
    ],
  },
  admin: {
    role: 'admin',
    description: 'Администратор проекта, может управлять контентом и участниками',
    permissions: [
      { resource: 'project', action: 'read' },
      { resource: 'project', action: 'write' },
      { resource: 'project', action: 'share' },
      { resource: 'project', action: 'export' },
      { resource: 'page', action: 'read' },
      { resource: 'page', action: 'write' },
      { resource: 'page', action: 'delete' },
      { resource: 'block', action: 'read' },
      { resource: 'block', action: 'write' },
      { resource: 'block', action: 'delete' },
      { resource: 'asset', action: 'read' },
      { resource: 'asset', action: 'write' },
      { resource: 'asset', action: 'delete' },
      { resource: 'collaborator', action: 'read' },
      { resource: 'collaborator', action: 'write' },
    ],
  },
  editor: {
    role: 'editor',
    description: 'Редактор, может создавать и редактировать контент',
    permissions: [
      { resource: 'project', action: 'read' },
      { resource: 'project', action: 'write' },
      { resource: 'project', action: 'export' },
      { resource: 'page', action: 'read' },
      { resource: 'page', action: 'write' },
      { resource: 'block', action: 'read' },
      { resource: 'block', action: 'write' },
      { resource: 'block', action: 'delete' },
      { resource: 'asset', action: 'read' },
      { resource: 'asset', action: 'write' },
      { resource: 'collaborator', action: 'read' },
    ],
  },
  commenter: {
    role: 'commenter',
    description: 'Комментатор, может просматривать и оставлять комментарии',
    permissions: [
      { resource: 'project', action: 'read' },
      { resource: 'page', action: 'read' },
      { resource: 'block', action: 'read' },
      { resource: 'block', action: 'comment' },
      { resource: 'asset', action: 'read' },
      { resource: 'comment', action: 'read' },
      { resource: 'comment', action: 'write' },
    ],
  },
  viewer: {
    role: 'viewer',
    description: 'Зритель, может только просматривать проект',
    permissions: [
      { resource: 'project', action: 'read' },
      { resource: 'page', action: 'read' },
      { resource: 'block', action: 'read' },
      { resource: 'asset', action: 'read' },
    ],
  },
};

export class RolePermissionsService {
  /**
   * Получает все права для роли
   */
  static getRolePermissions(role: GranularRole): RolePermissions {
    return ROLE_PERMISSIONS[role];
  }

  /**
   * Проверяет, имеет ли роль право на выполнение действия
   */
  static hasPermission(role: GranularRole, resource: string, action: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[role];
    if (!rolePermissions) {
      return false;
    }

    return rolePermissions.permissions.some(
      (p) => p.resource === resource && p.action === action
    );
  }

  /**
   * Получает список всех доступных ролей
   */
  static getAllRoles(): GranularRole[] {
    return Object.keys(ROLE_PERMISSIONS) as GranularRole[];
  }

  /**
   * Получает описание роли
   */
  static getRoleDescription(role: GranularRole): string {
    return ROLE_PERMISSIONS[role]?.description || '';
  }

  /**
   * Проверяет, может ли роль A выполнять действия роли B
   * (используется для проверки прав на изменение ролей)
   */
  static canManageRole(managerRole: GranularRole, targetRole: GranularRole): boolean {
    const roleHierarchy: Record<GranularRole, number> = {
      owner: 5,
      admin: 4,
      editor: 3,
      commenter: 2,
      viewer: 1,
    };

    return roleHierarchy[managerRole] > roleHierarchy[targetRole];
  }

  /**
   * Получает список разрешенных действий для роли на ресурсе
   */
  static getAllowedActions(role: GranularRole, resource: string): string[] {
    const rolePermissions = ROLE_PERMISSIONS[role];
    if (!rolePermissions) {
      return [];
    }

    return rolePermissions.permissions
      .filter((p) => p.resource === resource)
      .map((p) => p.action);
  }

  /**
   * Проверяет, может ли пользователь с ролью выполнить действие
   */
  static checkAccess(
    userRole: GranularRole,
    resource: string,
    action: string
  ): { allowed: boolean; reason?: string } {
    if (!this.hasPermission(userRole, resource, action)) {
      return {
        allowed: false,
        reason: `Role '${userRole}' does not have permission to ${action} on ${resource}`,
      };
    }

    return { allowed: true };
  }
}

