import { Request, Response, NextFunction } from 'express';

import ApiError from '../errors/ApiError';
import { hasAnyRole } from '../../utils/roles';
import type { RoleName } from '../../types/role.interface';

/**
 * MW. проварка наличия у Пользователя одной из указанных Ролей
 * @param allowedRoles - массив назв.разрешённых Ролей
 */
export const rolesMW = (allowedRoles: RoleName[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // проверка отработки authMW
    if (!req.auth) {
      return next(
        ApiError.internal(
          'Ошибка конфигурации: rolesMW должен использоваться после authMW',
        ),
      );
    }

    // проверка/наличие Ролей у Пользователя
    if (hasAnyRole(req.auth.roles, allowedRoles)) return next();

    // запрет
    return next(
      ApiError.forbidden(`Доступ Запрещен для Роли ${req.auth.roles[0]}`), // Требуется одна из ролей: ${allowedRoles.join(', ')}
    );
  };
};

/**
 * MW. проверка наличия у Пользователя конкретной Роли с мин.Уровнем
 * @param roleName - назв.требуемой Роли
 * @param minLevel - мин.Уровень доступа. По умолчанию 1
 */
export const roleLevelMW = (roleName: string, minLevel: number = 1) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      return next(
        ApiError.internal(
          'Ошибка конфигурации: roleLevelMW должен использоваться после authMW',
        ),
      );
    }

    // проверка наличия Роль с нужным Уровнем
    const hasRole = req.auth.roles.some(
      (r) => r.role === roleName && r.level >= minLevel,
    );

    // Доступ Разрешён
    if (hasRole) return next();

    return next(
      ApiError.forbidden(
        `Доступ Запрещён для для Роли ${req.auth.roles[0]['role']} с уровнем ${req.auth.roles[0]['level']}`,
      ), //  Требуется роль ${roleName} с уровнем ${minLevel} или выше
    );
  };
};
