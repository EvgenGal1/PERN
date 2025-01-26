import { RoleName } from '../types/role.interface';

// проверка наличие Роли с определённым уровнем у Пользователя
export const hasRole = (
  userRoles: Array<{ name: string; level: number }>,
  requiredRole: RoleName,
  minLevel: number = 1,
): boolean => {
  return userRoles.some((r) => r.name === requiredRole && r.level >= minLevel);
};
// ~ проверки прав
// if (!hasRole(user.roles, 'ADMIN', 3)) {
//   throw ApiError.forbidden();
// }
