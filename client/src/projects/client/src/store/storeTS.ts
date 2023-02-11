import { IUser } from "../../../../models/IUser";
import { makeAutoObservable } from "mobx";
import AuthService from "../../../../service/auth.service";
import axios from "axios";
import { AuthResponse } from "../../../../models/response/auth.response";
import { API_URL } from "../../../../http";

export default class Store {
  // сохр.данн.польз.
  user = {} as IUser;
  // перем.авториз.
  isAuth = false;
  // загрузка от мелькание теста перед формой
  isLoading = false;

  // `Сделайте автоматическое наблюдаемая` для раб.mobx с кл.
  constructor() {
    makeAutoObservable(this);
  }

  // мутации. замена текущ.знач.на получ.в парам.
  setAuth(bool: boolean) {
    this.isAuth = bool;
  }
  setUser(user: IUser) {
    this.user = user;
  }
  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  // асинхр.экшны
  async registration(username: string, email: string, password: string) {
    try {
      // отправ.данн.на serv
      const response = await AuthService.registration(
        username,
        email,
        password
      );
      console.log(response?.data);
      // запись в LS
      localStorage.setItem("tokenAccess", response.data.tokens.accessToken);
      // отпр.данн.в мутац.для сохр.(авториз.,токен,польз.,..)
      this.setAuth(true);
      this.setUser(response?.data?.user);
    } catch (error: any) {
      console.log(error);
      console.log(error?.response?.data); // все данные
      // console.log(error.response?.data?.errors); // масс. errors
      // console.log(error.response?.data.errors[0].msg); // из объ. по ind_0 поле msg
      console.log(error?.response?.data?.errors?.map((item: any) => item.msg)); // из масс.errors, из всех объ., все msg
    }
  }

  async login(username: string, email: string, password: string) {
    try {
      const response = await AuthService.login(username, email, password);
      console.log(response?.data);
      localStorage.setItem("tokenAccess", response.data.tokens.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error: any) {
      console.log(error?.response);
      console.log(error?.response?.data);
      console.log(error?.response?.data?.errors?.map((item: any) => item.msg));
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      // удал.из LS
      localStorage.removeItem("tokenAccess");
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (error: any) {
      console.log(error?.response?.data);
    }
  }

  // ПРОВЕРКА авторизации польз.
  async checkAuth() {
    this.setLoading(true);
    try {
      // использ.axios экзепляр по умалч.чтоб не нагружать интерцептор <ожид.тело отв.>(путь,авто.зацеп cookie)
      const response = await axios.get<AuthResponse>(
        `${/* process.env. */ API_URL}/auth/refresh`,
        {
          withCredentials: true,
        }
      );
      console.log(response?.data);
      localStorage.setItem("tokenAccess", response.data.tokens.accessToken);
      this.setAuth(true);
      this.setUser(response?.data?.user);
    } catch (error: any) {
      console.log(/* "Данные НЕ введены - " +  */ error?.response?.data);
    } finally {
      this.setLoading(false);
    }
  }
}
