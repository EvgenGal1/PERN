import { IUser } from "../../../../models/IUser";
import { makeAutoObservable } from "mobx";
import AuthService from "../../../../service/auth.service";

export default class Store {
  // сохр.данн.польз.
  user = {} as IUser;
  // перем.авториз
  isAuth = false;

  // `Сделайте автоматическое наблюдаемая` для раб.mobx с кл.
  constructor() {
    makeAutoObservable(this);
  }

  // мутации. замена текущ.знач.на получ.парам.
  setAuth(bool: boolean) {
    this.isAuth = bool;
  }
  setUser(user: IUser) {
    this.user = user;
  }

  // асинхр.экшн.
  async login(email: string, username: string, password: string) {
    try {
      const response = await AuthService.login(email, username, password);
      console.log(response);
      localStorage.setItem("tokenAccess", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.log(error /* .response?.data?.message */);
    }
  }

  async registration(email: string, username: string, password: string) {
    try {
      const response = await AuthService.registration(
        email,
        username,
        password
      );
      console.log(response);
      localStorage.setItem("tokenAccess", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.log(error /* .response?.data?.message */);
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      // удал.из LS
      localStorage.removeItem("tokenAccess");
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (error) {
      console.log(error /* .response?.data?.message */);
    }
  }
}
