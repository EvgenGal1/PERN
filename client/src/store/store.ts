import { IUser } from "../models/IUser";
import { makeAutoObservable } from "mobx";
import AuthService from "../service/auth.service";

export default class Store {
  user = {} as IUser;
  isAuth = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  // асинхр.экшн.
  async login(username: string, email: string, password: string) {
    console.log("username_str : " + username);
    try {
      console.log("1 : " + 1);
      const response = await AuthService.login(email, username, password);
      console.log("2 : " + 2);
      console.log("response login : " + response);
      localStorage.setItem("tokenAccess", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      // console.log(error.response?.data?.message);
    }
  }

  async registration(username: string, email: string, password: string) {
    try {
      const response = await AuthService.registration(
        email,
        username,
        password
      );
      console.log("response registr : " + response);
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
