export interface UserCreateDto {
  email: string;
  password: string;
  username?: string;
  role?: string;
  phoneNumber?: string;
}

export interface UserUpdateDto {
  email?: string;
  password?: string;
  username?: string;
  role?: string;
  phoneNumber?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  phoneNumber: string | null;
  clientId: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  phoneNumber: string | null;
  clientId: string;
  isActivated: boolean;
  activationLink: string;
}
