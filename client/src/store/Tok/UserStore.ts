// ^ хранилище состояний пользователей сайта
import { makeAutoObservable } from "mobx";

export default class UserStore {
  id = null;
  username = null;
  email = null;
  isAuth = false;
  isAdmin = false;

  constructor() {
    makeAutoObservable(this);
  }

  login({ id, username, email, role }: any) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.isAuth = true;
    this.isAdmin = role === "ADMIN";
  }

  logout() {
    this.id = null;
    this.username = null;
    this.email = null;
    this.isAuth = false;
    this.isAdmin = false;
  }
}
