// типы Ролей/Уровней/Доступов

import { ROLES_CONFIG } from '../config/api/roles.config';

export type RoleDTO = {
  value: RoleName;
  description?: string;
};

export type RoleLevels = {
  role: RoleName;
  level: number;
};

// тип назв.Ролей (из ключей ROLES_CONFIG)
export type RoleName = keyof typeof ROLES_CONFIG;

// тип str.назв.Ролей (не enum)
export type RoleNameString = (typeof ROLES_CONFIG)[RoleName]['name'];

// тип ID Ролей
export type RoleID = (typeof ROLES_CONFIG)[RoleName]['id'];
