// константы/интерфейсы/типы Ролей/уровней

export interface RoleDTO {
  value: string;
  description?: string;
}

export interface RoleLevels {
  role: NameUserRoles;
  level: number;
}

export enum NameUserRoles {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODER = 'MODER',
  MELOMAN = 'MELOMAN',
  VISUAL = 'VISUAL',
  SUPER = 'SUPER',
}

export const RolesIdsNames = {
  [NameUserRoles.GUEST]: { id: 0, name: NameUserRoles.GUEST },
  [NameUserRoles.USER]: { id: 1, name: NameUserRoles.USER },
  [NameUserRoles.ADMIN]: { id: 2, name: NameUserRoles.ADMIN },
  [NameUserRoles.MODER]: { id: 3, name: NameUserRoles.MODER },
  [NameUserRoles.MELOMAN]: { id: 4, name: NameUserRoles.MELOMAN },
  [NameUserRoles.VISUAL]: { id: 5, name: NameUserRoles.VISUAL },
  [NameUserRoles.SUPER]: { id: 6, name: NameUserRoles.SUPER },
} as const;

export const ROLE_HIERARCHY: Record<NameUserRoles, number> = {
  [NameUserRoles.GUEST]: 0,
  [NameUserRoles.USER]: 1,
  [NameUserRoles.MELOMAN]: 1,
  [NameUserRoles.VISUAL]: 1,
  [NameUserRoles.MODER]: 2,
  [NameUserRoles.ADMIN]: 3,
  [NameUserRoles.SUPER]: 4,
};

export type RoleName = keyof typeof RolesIdsNames;
export type RoleID = (typeof RolesIdsNames)[RoleName]['id'];
