export interface AuthRes {
  status: number;
  success: true;
  message: string;
  data: {
    accessToken: string;
    user: IUser;
    roles: RoleLevels[];
    isActivated: boolean;
    basket: number;
  };
}

export interface IUser {
  id: number;
  email: string;
  username: string;
  // ! вр.вкл.от ошб.в UserAutoriz
  isActivated?: boolean;
}

export interface RoleLevels {
  role: string;
  level: number;
}

export interface TokenPayload {
  id: number;
  email: string;
  username: string;
  roles: RoleLevels[];
  basket: number;
  isActivated: boolean;
}

export interface UserResData {
  id: number;
  email: string;
  username: string;
  roles: RoleLevels[];
  basket: number;
  isActivated: boolean;
  status?: number;
  message?: string;
  errors?: string;
}
