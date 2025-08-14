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

export type AvailableCommands = {
  name: string;
  keys: string[];
  type: "sequence" | "simultaneous" | "touchpad";
};
