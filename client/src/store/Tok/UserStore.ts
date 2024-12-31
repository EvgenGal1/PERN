// ^ хранилище состояний пользователей сайта
import { makeAutoObservable } from "mobx";

export default class UserStore {
  id: number | null = null;
  username: string | null = null;
  email: string | null = null;
  isAuth = false;
  isAdmin = false;
  activated = false;

  constructor() {
    makeAutoObservable(this);
  }

  login({
    id,
    username,
    email,
    role,
  }: {
    id: number;
    username: string;
    email: string;
    role: string;
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.isAuth = true;
    this.isAdmin = role === "ADMIN";
  }

  isActivated(activated: boolean) {
    this.activated = activated;
  }

  logout() {
    this.id = null;
    this.username = null;
    this.email = null;
    this.isAuth = false;
    this.isAdmin = false;
  }
}
