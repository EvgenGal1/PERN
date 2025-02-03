// тип > хран.данн.Токена
export interface UserTokenAcs {
  [key: string]: string | number | boolean;
}

export interface AuthRes {
  status: number;
  success: true;
  message: string;
  data: {
    accessToken: string;
    user?: IUser;
    roles?: string[];
    isActivated?: boolean;
  };
}

export interface IUser {
  id: number;
  email: string;
  username: string;
  // ! вр.вкл.от ошб.в UserAutoriz
  isActivated?: boolean;
}

export interface TokenDto {
  id: number;
  email: string;
  username: string;
  roles: string[];
  levels: number[];
  basket: number;
}

export interface ErrorRes {
  status?: number;
  message?: string;
  errors?: Record<string, unknown>;
}
