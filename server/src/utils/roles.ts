import type { RoleLevels, RoleName } from '../types/role.interface';

// проверка наличие Роли с определённым Уровнем у Пользователя
/**
 * проверка наличия Роли с определённым Уровнем у Пользователя
 * @param userRoles - масс.Роли/Уровни >  проверки
 * @param requiredRole - треб.Роль
 * @param minLevel - мин.доступ.Уровень. По умолчанию 1
 * @returns true, е/и есть Роль с Уровнем >= minLevel.
 */
export const hasMinRoleLevel = (
  userRoles: RoleLevels[],
  requiredRole: RoleName,
  minLevel: number = 1,
): boolean => {
  return userRoles.some((r) => r.role === requiredRole && r.level >= minLevel);
};

/**
 * проверка наличия указ.Ролей у Пользователя
 * @param userRoles - масс.Ролей/Уровней Пользователя
 * @param allowedRoles - масс.доступ.Ролей
 * @returns true, е/и есть хоть одна разреш.Роль
 */
export const hasAnyRole = (
  userRoles: RoleLevels[],
  allowedRoles: RoleName[],
): boolean => {
  return userRoles.some((userRole) => allowedRoles.includes(userRole.role));
};

// ~ проверки прав
// if (!hasRole(user.roles, 'ADMIN', 3)) {
//   throw ApiError.forbidden();
// }
