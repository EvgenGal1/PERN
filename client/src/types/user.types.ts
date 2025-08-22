// типы Пользователя

export type User = {
  id: number;
  email: string;
  username: string;
  isActivated?: boolean;
};

export type UserProfile = User & { roles: RoleLevel[]; basket: number };

export type RoleLevel = { role: NameUserRoles; level: number };

export enum NameUserRoles {
  GUEST = "GUEST",
  USER = "USER",
  ADMIN = "ADMIN",
  MODER = "MODER",
  MELOMAN = "MELOMAN",
  VISUAL = "VISUAL",
  SUPER = "SUPER",
}

export type UserSession = { isAuth: boolean; isAdmin: boolean } & UserProfile;

/**
 * тип команд/комбинаций > user.availableCommands
 * @param name - имя кмд./комбин.
 * @param keys - масс.клавиш
 * @param type - тип комбинации
 */
export type AvailableCommands = {
  name: string;
  keys: string[];
  /** последовательность | одновременный | сенсорная панель */
  type: "sequence" | "simultaneous" | "touchpad";
};

/**
 * расшир.конфиг. кмд./комбин. + onMatch как cb fn вызываемая при срабатывании кмд.
 */
export type CommandConfig = AvailableCommands & {
  onMatch: () => void;
};
