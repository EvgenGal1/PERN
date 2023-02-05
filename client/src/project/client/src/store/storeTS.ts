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
  async login(email: string, /* username: string, */ password: string) {
    console.log("str log email : " + email);
    try {
      console.log("str log 1 : " + 1);
      const response = await AuthService.login(email, /* username, */ password);
      console.log("str log 2 : " + 2);
      console.log("str log resp : " + response);
      localStorage.setItem("tokenAccess", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      // console.log(error.response?.data?.message);
    }
  }

  async registration(email: string, /* username: string, */ password: string) {
    console.log("str reg email : " + email);
    try {
      console.log("str reg 1 : " + 1);
      const response = await AuthService.registration(
        email,
        // username,
        password
      );
      console.log("str reg 2 : " + 2);
      console.log("str reg resp : " + response);
      localStorage.setItem("tokenAccess", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      // console.log(error.response?.data?.message);
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      console.log("response logout : " + response);
      // удал.из LS
      localStorage.removeItem("tokenAccess");
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (error) {
      // console.log(error.response?.data?.message);
    }
  }
}
