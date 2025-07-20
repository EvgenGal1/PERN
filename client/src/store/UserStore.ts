// ^ хранилище Пользователей

import { action, makeAutoObservable, observable, runInAction } from "mobx";
import { jwtDecode } from "jwt-decode";

import type { TokenPayload } from "@/types/api/auth.types";

export default class UserStore {
  @observable id: number | null = null;
  @observable username: string | null = null;
  @observable email: string | null = null;
  // масс.объ.
  // @observable.deep roles = [
  //   {
  //     role: null as string | null,
  //     level: null as string | null,
  //   },
  // ];
  @observable isAuth = false;
  @observable isAdmin = false;
  @observable activated = false;
  @observable isLoading = false;

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
    // сохр.Роли Уровни
    // (this.role = payload.roles["role"]), (this.isAuth = true);
    this.activated = payload.isActivated;
    this.isAdmin = payload.roles.some((role) => role.role === "ADMIN");

    // сохр.данн.в LS
    this.saveToLocalStorage();
  }

  // восст.сост.из LS
  /**
   * восстан.сессии из lS
   * @param tokenAccess - JWT Токен
   * @returns Promise<boolean> успех восстановления
   */
  async restoreSession(): Promise<boolean> {
    this.isLoading = true;
    try {
      const tokenAccess = localStorage.getItem("tokenAccess") ?? "";
      if (!tokenAccess) return false;
      // проверка срок действия токена(без декодирования)
      const { exp } = jwtDecode<{ exp: number }>(tokenAccess);
      // проверка валидности Токена без запроса к БД
      // выход при просроченном Токене
      if (exp < Date.now() / 1000) {
        this.logout();
        return false;
      }
      this.isAuth = true;
      return true;
    } catch (error) {
      console.error("Ошибка восстановления сессии из LS : ", error);
      this.logout();
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Выход Пользователя
   * удал. user/catalog Store из LS
   */
  @action logout() {
    runInAction(() => {
      this._resetUserState();
      this.clearAllLocalStorage();
    });
  }

  @action private _resetUserState() {
    this.id = null;
    this.username = null;
    this.email = null;
    // ^ roles
    this.isAuth = false;
    this.isAdmin = false;
    this.activated = false;
  }

  // сохр.данн.в LS
  @action saveToLocalStorage() {
    localStorage.setItem(
      "userStore",
      JSON.stringify({
        id: this.id,
        username: this.username,
        email: this.email,
        // Роли и УРовни
        isAuth: this.isAuth,
        isAdmin: this.isAdmin,
        activated: this.activated,
      })
    );
  }

  // удал.данн.из LS
  @action clearAllLocalStorage() {
    localStorage.removeItem("tokenAccess");
    localStorage.removeItem("userStore");
    localStorage.removeItem("basketStore");
    localStorage.removeItem("catalogStore");
  }
}
