// ^ конфигурация Ролей. Опред.всех Ролей, ID в БД, иерархии, описаний

interface RoleConfig {
  name: string;
  id: number;
  hierarchy: number;
  description?: string;
}

/**
 * @constant {Record<string, RoleConfig>} ROLES_CONFIG
 * @description конфигурация Ролей/ID/Иерархии
 *
 * Ключ объекта — назв.Роли, Значение — объ.конфиг.Роли
 *
 * @type {string} KEY - Ключ объ.Роли  >  Значения
 * @type {string} name - назв.Роли === KEY
 * @type {number} id - ID Роли в БД
 * @type {number} hierarchy - знач.доступа в Иерархии
 * @type {string} [description] - описание Роли
 *
 * @example
 * // использ.знач.по умолчанию как USER
 * const { role = ROLES_CONFIG.USER.name }
 *
 * @example
 * // проверка всех доступ.знач. Роли
 * Object.keys(ROLES_CONFIG).includes(role)
 *
 * @example
 * // проверка опред.знач. Роли (USER, ADMIN)
 * [ROLES_CONFIG.USER.name, ROLES_CONFIG.ADMIN.name].includes(role)
 *
 * @example
 * // получить ID Роли USER
 * const userId = ROLES_CONFIG.USER.id;
 *
 * @example
 * // проверить Иерархию Роли ADMIN
 * const isAdminPowerful = ROLES_CONFIG.ADMIN.hierarchy > ROLES_CONFIG.USER.hierarchy;
 */
export const ROLES_CONFIG: Record<string, RoleConfig> = {
  GUEST: {
    name: 'GUEST',
    id: 0,
    hierarchy: 0,
    description: 'Гость без аккаунта',
  },
  USER: {
    name: 'USER',
    id: 1,
    hierarchy: 1,
    description: 'Зарегистрированный пользователь',
  },
  ADMIN: {
    name: 'ADMIN',
    id: 2,
    hierarchy: 3,
    description: 'Администратор',
  },
  MODER: {
    name: 'MODER',
    id: 3,
    hierarchy: 2,
    description: 'Модератор',
  },
  MELOMAN: {
    name: 'MELOMAN',
    id: 4,
    hierarchy: 1,
    description: 'Пользователь с ролью Meloman',
  },
  VISUAL: {
    name: 'VISUAL',
    id: 5,
    hierarchy: 1,
    description: 'Пользователь с ролью Visual',
  },
  SUPER: {
    name: 'SUPER',
    id: 6,
    hierarchy: 4,
    description: 'Суперпользователь',
  },
} as const; // as const для вывода литеральных типов
