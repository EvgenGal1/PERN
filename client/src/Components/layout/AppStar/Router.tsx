// Страницы
import { Prob0 } from "../../pages/starPodhod/Prob0";
import { Prob1 } from "../../pages/starPodhod/Prob1";
import { Prob2 } from "../../pages/starPodhod/Prob2";
import { AboutMe } from "../../pages/starPodhod/AboutMe";
// НОВ.ПРОЕКТ
import { NewPro } from "../../../projects/NewPro/NewPro";
// NRJWT
import NRJWT from "../../../projects/client/NRJWT";

// ^ НОВ.ПОДХОД
import {
  MAIN_ROUTE,
  NAWPRO_ROUTE,
  PROB0_ROUTE,
  PROB1_ROUTE,
  PROB2_ROUTE,
  ABOUTME_ROUTE,
  NRJWT_ROUTE,
} from "../../../utils/constsStar";
import { Main } from "../../pages/starPodhod/Main";

// ^ СТАР.ПОДХОД.
// Комп.,anim.,Routes,Route переезд в AppRouteStar
// Header,Router,Footer подкл в projects/App

// ^ НОВ.ПОДХОД
// Доступ для любых польз.(Магз., Логин, Регистр., Конкретн.Устр.с ID)
export const publicRoutes = [
  // объ. Ссылка отраб.стр., Комп.стр. (по url Admin вызов комп. админа)
  { path: MAIN_ROUTE, Component: Main },
  { path: "/NewPro" /* NAWPRO_ROUTE */, Component: NewPro },
  { path: PROB0_ROUTE /* + "/*" */, Component: Prob0 },
  { path: PROB1_ROUTE, Component: Prob1 },
  { path: PROB2_ROUTE, Component: Prob2 },
  { path: ABOUTME_ROUTE, Component: AboutMe },
];

// Доступ для Авториз.польз.(Админ панель, Корзина, Польз.)
export const authRoutes = [
  { path: NRJWT_ROUTE, Component: NRJWT },
  // { path: BASKET_ROUTE, Component: Basket },
  // { path: USER_ROUTE, Component: User },
];

// Доступ для Админа (Админ панель)
// export const adminRoutes = [{ path: ADMIN_ROUTE, Component: Admin }];
