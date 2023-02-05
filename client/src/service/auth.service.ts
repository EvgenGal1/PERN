import $api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/auth.response";
import { config } from "process";

export default class AuthService {
  static async login(
    email: string,
    // username: string,
    password: string
    // ): Promise<AxiosResponse<AuthResponse>> {
  ) {
    console.log("a.serv log : " + email);
    console.log(
      "$api : " +
        //
        $api.interceptors.request.use((config) => {
          // config.headers.Authorization = `Bearer ${localStorage.getItem(
          //   "tokenAccess"
          // )}`;
          return config;
        })
      // $api.interceptors.request.use((config) => {
      //   // присв.header с token сохр.в LS
      //   config.headers.Authorization = `Bearer ${localStorage.getItem(
      //     "tokenAccess"
      //   )}`;
      //   return config;
      // })
    );

    console.log(
      "123 : " +
        $api.interceptors.request.use((config) => {
          // присв.header с token сохр.в LS
          config.headers.Authorization = `Bearer ${localStorage.getItem(
            "tokenAccess"
          )}`;
          return config;
        })
      // $api.interceptors.request.use((config) => {
      //   // присв.header с token сохр.в LS
      //   console.log(`${config}`);
      //   config.headers.Authorization = `Bearer ${localStorage.getItem(
      //     "tokenAccess"
      //   )}`;
      //   console.log(
      //     "config.headers.Authorization : " + config.headers.Authorization
      //   );
      //   return config;
      // })
    );
    $api.interceptors.request.use((config) => {
      // присв.header с token сохр.в LS
      config.headers.Authorization = `Bearer ${localStorage.getItem(
        "tokenAccess"
      )}`;
      return config;
    });
    // console.log(
    //   "return : " +
    //     $api.post("/login", {
    //       email,
    //       /* username, */
    //       password,
    //     })
    // );
    return $api.post("/login", {
      email,
      /* username, */
      password,
    });
  }

  static async registration(
    email: string,
    // username: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    console.log("au.serv reg : " + password);
    // ! ошб. - settle.js:19 Uncaught (in promise), Запрос не выполнен с кодом состояния 404.
    // console.log(
    //   "$api.. : " +
    //     $api.post("/registration", {
    //       email,
    //       // username,
    //       password,
    //     })
    // );
    return $api.post<AuthResponse>("/registration", {
      email,
      // username,
      password,
    });
    // .then((res) => res.data.user.isActivated);
  }

  static async logout(): Promise<void> {
    return $api.post("/logout");
  }
}
// стат.fn для req на server
