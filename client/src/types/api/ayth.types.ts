export interface AuthRes {
  accessToken: string;
  refreshToken: string;
  // указ.интерф. как тип
  user: IUser;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  isActivated: boolean;
}
