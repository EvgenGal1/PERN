// ^ хранилище Пользователей

import { action, makeAutoObservable, observable, runInAction, spy } from "mobx";
import { jwtDecode } from "jwt-decode";
import { debounce } from "lodash";

import { authAPI } from "@/api/auth/authAPI";
import type { AvailableCommands, RoleLevel } from "@/types/user.types";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/auth.types";
import { errorHandler } from "@/utils/errorHandler";

export default class UserStore {
  @observable id: number | null = null;
  @observable username: string | null = null;
  @observable email: string | null = null;
  /** масс.объ.Роль/Уровень */
  @observable.deep roles: RoleLevel[] = [];
  /** кмд./комбин. доступных Пользователю */
  @observable.deep availableCommands: AvailableCommands[] = [];
  @observable isAuth = false;
  @observable activated = false;
  // загр.
  @observable isLoading = false;

  constructor() {
    makeAutoObservable(this);
    // лог.измен.
    process.env.REACT_APP_MEGA_TEST === "true" &&
      process.env.NODE_ENV === "development" &&
      spy((event) => {
        if (event.type === "action" && event.object === this) {
          console.log(`%cUserStore: ${event.name}`, "color: #ffd700;");
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
      const parsed = JSON.parse(storedData);
      runInAction(() => {
        this.id = parsed.id;
        this.username = parsed.username;
        this.email = parsed.email;
        this.roles = parsed.roles || [];
        this.isAuth = !!parsed.isAuth;
        this.activated = parsed.activated;
        this.availableCommands = parsed.availableCommands;
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
          availableCommands: this.availableCommands,
        })
      );
      localStorage.setItem("--dopMenu", JSON.stringify(false));
    } catch (error) {
      this.handleError(error, `Ошибка Сохранения userStore из LS`);
    }
  }, 500);

  // удал.данн.из LS
  @action clearAllLocalStorage() {
    localStorage.removeItem("tokenAccess");
    localStorage.removeItem("userStore");
    localStorage.removeItem("basketStore");
    localStorage.removeItem("--dopMenu");
  }

  // SESSION ----------------------------------------------------------------------------------

  @action private initializeSession() {
    this.loadFromLocalStorage();

    // проверка Токена при Инициализации
    if (this.isAuth) {
      this.restoreSession().catch((error) =>
        this.handleError(error, "ошибка Инициализации Сессии")
      );
    }
  }

  /**
   * восстан.сессии из LS
   * @param tokenAccess - JWT Токен
   * @returns Promise<boolean> успех восстановления
   */
  @action async restoreSession(): Promise<boolean> {
    if (this.isLoading) return false;
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
      // проверка User
      return await this.checkAuth();
    } catch (error) {
      this.handleError(error, "ошибка Восстановления Сессии из LS : ");
      this.logout();
      return false;
    } finally {
      this.isLoading = false;
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
    this.availableCommands = data.availableCommands;
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
    this.availableCommands = [];

    this.clearAllLocalStorage();
  }

  // ASYNC ----------------------------------------------------------------------------------

  @action async login(credentials: LoginCredentials): Promise<void> {
    this.isLoading = true;
    try {
      const response = await authAPI.login(credentials);
      console.log("response.data : ", response.data);
      runInAction(() => {
        this.saveSession(response.data);
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

  @action async register(credentials: RegisterCredentials): Promise<void> {
    this.isLoading = true;
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
        this.isLoading = false;
      });
    }
  }

  // проверка Пользователя в БД
  @action async checkAuth(): Promise<boolean> {
    try {
      const { isValid, user } = await authAPI.checkAuth();
      if (isValid && user) {
        runInAction(() => {
          this.id = user.id;
          this.email = user.email;
          this.username = user.username;
          this.isAuth = true;
          this.activated = user.isActivated ?? false;
          this.saveToLocalStorage();
        });
        return isValid;
      }
      this.clearSession();
      return false;
    } catch (error) {
      this.handleError(error, "проверка сессии не удалась");
      this.clearSession();
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  @action async refreshToken(): Promise<void> {
    this.isLoading = true;
    try {
      const tokens = await authAPI.refresh();
      localStorage.setItem("tokenAccess", tokens.tokenAccess);
    } catch (error) {
      this.handleError(error, "не удалось обновить Токен");
      this.clearSession();
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  @action async logout(): Promise<void> {
    this.isLoading = true;
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn("Предупреждение о выходе из системы : ", error);
    } finally {
      runInAction(() => {
        this.clearSession();
        this.isLoading = false;
      });
    }
  }

  // ДОП.МТД. (ЗАГРУЗКА/РОЛИ/ОШИБКИ) ----------------------------------------------------------------------------------

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
    // логг.
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
