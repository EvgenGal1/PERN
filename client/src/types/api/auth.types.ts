export interface AuthRes {
  // status: number;
  success: true;
  message: string;
  data: {
    tokenAccess: string;
    user: IUser;
    roles: RoleLevels[];
    isActivated: boolean;
    basket: number;
  };
}

export interface CheckRes {
  success: true;
  message: string;
  data: {
    user: IUser;
  };
}

export interface IUser {
  id: number;
  email: string;
  username: string;
  // ! вр.вкл.от ошб.в UserAutoriz
  isActivated?: boolean;
}

export interface UserStoreData {
  id: number;
  email: string;
  username: string;
  roles: string[];
  isAuth: boolean;
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
  exp?: number;
}

export interface UserDataRes {
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
