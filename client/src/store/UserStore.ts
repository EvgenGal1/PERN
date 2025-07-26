// ^ хранилище Пользователей

import { action, makeAutoObservable, observable, runInAction, spy } from "mobx";
import { jwtDecode } from "jwt-decode";
import { debounce } from "lodash";

import { authAPI } from "@/api/auth/authAPI";
import type { RoleLevel } from "@/types/user.types";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/auth.types";
import { ApiError } from "@/utils/errorAPI";
import { errorHandler } from "@/utils/errorHandler";

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
    // лог.измен.
    spy((event) => {
      if (event.type === "action") {
        console.log("UserStore Action:", event.name);
      }
    });
    // инициализация с чтение данн.из LS и проверкой
    this.initializeSession();
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

  // SESSION ----------------------------------------------------------------------------------

  @action private initializeSession() {
    this.loadFromLocalStorage();

    // проверка Токена при инициализации
    this.check().catch((error) => {
      console.warn("проверка Сессии не удалась:", error);
      this.logout();
    });
  }

  /**
   * восстан.сессии из lS
   * @param tokenAccess - JWT Токен
   * @returns Promise<boolean> успех восстановления
   */
  async restoreSession(): Promise<boolean> {
    this.setLoading(true);
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
      this.setLoading(false);
    }
  }

  // сохр.сессии
  @action private saveSession(data: AuthResponse) {
    this.id = data.user.id;
    this.email = data.user.email;
    this.username = data.user.username;
    this.roles = data.roles;
    this.isAuth = true;
    this.activated = data.isActivated;
    // сохр. Токена в LS
    localStorage.setItem("tokenAccess", data.tokenAccess);
    // сохр.данн.в LS
    this.saveToLocalStorage();
  }

  // очистка данн.в Store/LS
  @action clearSession() {
    this.id = null;
    this.email = null;
    this.username = null;
    this.roles = [];
    this.isAuth = false;
    this.activated = false;
    this.error = null;

    this.clearAllLocalStorage();
  }

  // ASYNC ----------------------------------------------------------------------------------

  @action async login(credentials: LoginCredentials): Promise<void> {
    this.setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      runInAction(() => {
        this.saveSession(response.data);
      });
    } catch (error) {
      this.handleError(error, "Ошибка Авторизации");
      throw error;
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  @action async register(credentials: RegisterCredentials): Promise<void> {
    this.setLoading(true);
    try {
      const response = await authAPI.register(credentials);
      runInAction(() => {
        this.saveSession(response.data);
      });
    } catch (error) {
      this.handleError(error, "Ошибка Регистрации");
      throw error;
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  // проверка Пользователя в БД
  @action async check(): Promise<boolean> {
    if (this.isLoading) return false;
    this.setLoading(true);
    try {
      const { isValid, user } = await authAPI.check();
      runInAction(() => {
        if (isValid && user) {
          this.id = user.id;
          this.email = user.email;
          this.username = user.username;
          this.isAuth = true;
          user.isActivated ? (this.activated = user.isActivated) : false;
          this.saveToLocalStorage();
        } else {
          this.clearSession();
        }
      });

      return isValid;
    } catch (error) {
      this.handleError(error, "проверка сессии не удалась");
      this.clearSession();
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  @action async refreshToken(): Promise<void> {
    this.setLoading(true);
    try {
      const tokens = await authAPI.refresh();
      localStorage.setItem("tokenAccess", tokens.tokenAccess);
    } catch (error) {
      this.handleError(error, "не удалось обновить Токен");
      this.clearSession();
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  @action async logout(): Promise<void> {
    this.setLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn("Предупреждение о выходе из системы : ", error);
    } finally {
      runInAction(() => {
        this.clearSession();
        this.setLoading(false);
      });
    }
  }

  // ДОП.МТД. (ЗАГРУЗКА/РОЛИ/ОШИБКИ) ----------------------------------------------------------------------------------

  @action private setLoading(state: boolean) {
    this.isLoading = state;
  }

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
    return requiredRoles.some((r) => this.hasRole(r.role, r.level ?? 1));
  }

  @action private handleError(error: unknown, context: string) {
    // обраб. ч/з универ.fn обраб.ошб.
    const apiError = errorHandler(error, `UserStore: ${context}`);
    // сохр./логг.
    this.error = apiError;
    console.error(`Ошб.в UserStore [${context}]`, apiError);
    // отправка ошб.в Sentry
    // captureException(apiError);
  }

  // ГЕТТЕРЫ ----------------------------------------------------------------------------------

  // проверка ADMIN с уровнем
  get isAdmin(): boolean {
    return this.hasRole("ADMIN", 1);
  }
}
