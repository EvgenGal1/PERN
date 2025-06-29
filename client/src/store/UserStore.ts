// ^ хранилище Пользователей

import { action, makeAutoObservable, observable, runInAction } from "mobx";

import { authAPI } from "@/api/auth/authAPI";
import type { TokenPayload } from "@/types/api/auth.types";

export default class UserStore {
  @observable id: number | null = null;
  @observable username: string | null = null;
  @observable email: string | null = null;
  @observable isAuth = false;
  @observable isAdmin = false;
  @observable activated = false;

  constructor() {
    makeAutoObservable(this, {
      restoreSession: action.bound,
      login: action,
      logout: action,
    });

    // чтение данн.из localStorage при инициализации
    const storedData = localStorage.getItem("userStore");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.id = parsedData.id;
      this.username = parsedData.username;
      this.email = parsedData.email;
      this.isAuth = parsedData.isAuth;
      this.isAdmin = parsedData.isAdmin;
      this.activated = parsedData.activated;
    }
  }

  // Входа Пользователя. Сохр.данн.в Store и LS от сбросов MobX при перезагрузке
  @action login(payload: TokenPayload) {
    this.id = payload.id;
    this.username = payload.username;
    this.email = payload.email;
    this.isAuth = true;
    this.activated = payload.isActivated;
    this.isAdmin = payload.roles.some((role) => role.role === "ADMIN");

    // сохр.данн.в LS
    this.saveToLocalStorage();
  }

  // восст.сост.из LS
  async restoreSession(tokenAccess: string): Promise<boolean> {
    if (!tokenAccess) return false;
    try {
      const userDataDat = authAPI.parseToken(tokenAccess);
      this.login(userDataDat);
      return true;
    } catch (error) {
      console.error("Ошибка восстановления сессии из LS : ", error);
      this.logout();
      return false;
    }
  }

  /**
   * Выход Пользователя
   * удал. user/catalog Store из LS
   */
  // Выход Пользователя
  @action logout() {
    runInAction(() => {
      this.id = null;
      this.username = null;
      this.email = null;
      this.isAuth = false;
      this.isAdmin = false;
      this.activated = false;
      // очистка LS
      this.clearLocalStorage;
      localStorage.removeItem("catalogStore");
    });
  }

  // сохр.данн.в LS
  @action saveToLocalStorage() {
    localStorage.setItem(
      "userStore",
      JSON.stringify({
        id: this.id,
        username: this.username,
        email: this.email,
        isAuth: this.isAuth,
        isAdmin: this.isAdmin,
        activated: this.activated,
      })
    );
  }

  // удал.данн.из LS
  @action clearLocalStorage() {
    localStorage.removeItem("userStore");
  }
}
