// ^ хранилище Пользователей

import { action, makeAutoObservable, observable, runInAction } from "mobx";
import { jwtDecode } from "jwt-decode";
import { debounce } from "lodash";

import { authAPI } from "@/api/auth/authAPI";
import type { RoleLevel, UserProfile } from "@/types/user.types";
import { ApiError } from "@/utils/errorAPI";

export default class UserStore {
  @observable id: number | null = null;
  @observable username: string | null = null;
  @observable email: string | null = null;
  // масс.объ.Роль/Уровень
  @observable.deep roles: RoleLevel[] = [];
  @observable isAuth = false;
  @observable activated = false;
  // загр., ошб.
  @observable isLoading = false;
  @observable error: ApiError | null = null;

  constructor() {
    makeAutoObservable(this);

    // чтение данн.из localStorage при инициализации
    this.loadFromLocalStorage();
  }

  // LOCALSTORE ----------------------------------------------------------------------------------

  // загр.данн.из LS
  @action private loadFromLocalStorage() {
    const storedData = localStorage.getItem("userStore");
    if (!storedData) return;

    try {
      const { id, username, email, roles, isAuth } = JSON.parse(storedData);
      runInAction(() => {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles || [];
        this.isAuth = !!isAuth;
      });
    } catch (error) {
      this.handleError(error, `Ошибка Загрузки userStore из LS`);
      this.clearAllLocalStorage();
    }
  }

  // сохр.данн.в LS
  @action private saveToLocalStorage = debounce(() => {
    try {
      localStorage.setItem(
        "userStore",
        JSON.stringify({
          id: this.id,
          username: this.username,
          email: this.email,
          roles: this.roles,
          isAuth: this.isAuth,
          activated: this.activated,
        })
      );
    } catch (error) {
      this.handleError(error, `Ошибка Сохранения userStore из LS`);
    }
  }, 500);

  // удал.данн.из LS
  @action clearAllLocalStorage() {
    localStorage.removeItem("tokenAccess");
    localStorage.removeItem("userStore");
    localStorage.removeItem("basketStore");
    localStorage.removeItem("catalogStore");
  }

  // ASYNC ----------------------------------------------------------------------------------

  @action async login(email: string, password: string): Promise<void> {
    this.isLoading = true;
    try {
      const response = await authAPI.login({ email, password });
      runInAction(() => {
        this.saveData(response);
      });
    } catch (error) {
      this.handleError(error, "Ошибка Авторизации");
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  @action async register(email: string, password: string): Promise<void> {
    this.isLoading = true;
    try {
      const response = await authAPI.register({ email, password });
      runInAction(() => {
        this.saveData(response);
      });
    } catch (error) {
      this.handleError(error, "Ошибка Регистрации");
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  @action private saveData(userData: UserProfile): void {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.roles = userData.roles;
    this.isAuth = true;
    this.saveToLocalStorage();
  }

  // USER ----------------------------------------------------------------------------------

  /**
   * Выход Пользователя
   * удал. user/catalog Store из LS
   */
  @action logout() {
    runInAction(() => {
      this.resetUserState();
      this.clearAllLocalStorage();
    });
  }

  @action private resetUserState() {
    this.id = null;
    this.username = null;
    this.email = null;
    this.roles = [];
    this.isAuth = false;
    this.activated = false;
  }

  // Входа Пользователя. Сохр.данн.в Store и LS от сбросов MobX при перезагрузке
  @action save(payload: UserProfile) {
    this.id = payload.id;
    this.username = payload.username;
    this.email = payload.email;
    this.isAuth = true;
    // сохр.Роли Уровни
    this.roles = payload.roles;
    this.activated = payload.isActivated!;
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
      this.handleError(error, "Ошибка восстановления сессии из LS : ");
      this.logout();
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  // ДОП.МТД. (РОЛИ/ОШИБКИ) ----------------------------------------------------------------------------------

  // проверка Роли с мин.Уровнем
  /**
   * проверка наличия конкретной Роли с минимальным Уровнем
   * @param roleName - название Роли (например, "USER")
   * @param minLevel - минимальный требуемый Уровень (по умолчанию 1)
   * @returns boolean - true если Роль есть и Уровень достаточен
   */
  @action hasRole(roleName: string, minLevel: number = 1): boolean {
    return this.roles.some((r) => r.role === roleName && r.level >= minLevel);
  }

  // проверка нескольких ролей
  /**
   * проверка наличия хотя бы одной Роли из списка с учетом Уровней
   * @param requiredRoles - массив требуемых Ролей с опциональными Уровнями
   * @returns boolean - true если есть хотя бы одна подходящая Роль
   */
  @action hasAnyRole(
    requiredRoles: Array<{ role: string; level?: number }>
  ): boolean {
    return requiredRoles.some((required) =>
      this.hasRole(required.role, required.level ?? 1)
    );
  }

  @action private handleError(error: unknown, context?: string) {
    const apiError =
      error instanceof ApiError
        ? error
        : new ApiError(500, "Неизвестная ошибка", "UNKNOWN_ERROR", { context });

    this.error = apiError;
    // captureException(error); // Отправка ошибки в Sentry или аналоги
    console.error(`Ошб.в UserStore [${context}]`, apiError);

    // авто logout при 401
    if (apiError.status === 401) {
      this.logout();
    }
  }

  // ГЕТТЕРЫ ----------------------------------------------------------------------------------

  // проверка ADMIN /* с уровнем */
  get isAdmin(): boolean {
    return this.hasRole("ADMIN", 1);
  }
}
