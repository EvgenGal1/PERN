// ^ хранилище Пользователей

import { makeAutoObservable } from "mobx";
import { TokenPayload } from "@/types/api/auth.types";

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

  login({ id, username, email, roles }: TokenPayload) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.isAuth = true;
    this.isAdmin = roles[0].role === "ADMIN";
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
