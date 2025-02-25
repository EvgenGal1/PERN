import { RoleLevels } from './role.interface';

export interface UserCreateDto {
  email: string;
  password: string;
  username?: string;
  role?: string;
}

export interface UserUpdateDto {
  email?: string;
  password?: string;
  username?: string;
  role?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string | null;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  isActivated: boolean;
  activationLink: string;
}
