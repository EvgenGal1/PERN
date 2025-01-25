// переменные Ролей и уровней

export enum NameUserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODER = 'MODER',
  MELOMAN = 'MELOMAN',
  VISUAL = 'VISUAL',
  GUEST = 'GUEST',
  SUPER = 'SUPER',
}

export const RolesIdsNames = {
  USER: { id: 1, name: 'USER' },
  ADMIN: { id: 2, name: 'ADMIN' },
  MODER: { id: 3, name: 'MODER' },
  MELOMAN: { id: 4, name: 'MELOMAN' },
  VISUAL: { id: 5, name: 'VISUAL' },
  GUEST: { id: 6, name: 'GUEST' },
  SUPER: { id: 7, name: 'SUPER' },
} as const;

export type RoleName = keyof typeof RolesIdsNames;
export type RoleID = (typeof RolesIdsNames)[keyof typeof RolesIdsNames]['id'];
