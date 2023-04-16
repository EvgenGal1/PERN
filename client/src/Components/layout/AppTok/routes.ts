import {
  SHOP_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  UTV_LOGIN_ROUTE,
  UTV_REGISTRATION_ROUTE,
  DEVICE_ROUTE,
  DELIVERY_ROUTE,
  CONTACTS_ROUTE,
  NOTFOUND_ROUTE,
  USER_ROUTE,
  BASKET_Tok_ROUTE,
  BASKET_UTVst_ROUTE,
  ADMIN_ROUTE,
} from "../../../utils/consts";
import Shop from "../../pages/public/AppTok/ShopNew";
import Basket from "../../pages/public/AppTok/Basket";
import Auth from "../../pages/public/AppUTVst/Auth";
import Login from "../../pages/public/AppTok/Login";
import Signup from "../../pages/public/AppTok/Signup";
import DevicePage from "../../pages/public/DevicePage";
import Delivery from "../../pages/public/Delivery";
import Contacts from "../../pages/public/Contacts";
import NotFound from "../../pages/public/NotFound";
import User from "../../pages/auth/User";
import BasketTok from "../../pages/public/AppTok/Basket";
import BasketUtVst from "../../pages/auth/Basket";
import Admin from "../../pages/admin/Admin";

// ! https://tokmakov.blog.msk.ru/blog/item/673 разобрать примеры и 677
// 2 МАРШРУТА ++

// Доступ для любых польз.(Магз., Логин, Регистр., Конкретн.Устр.с ID)
export const publicRoutes = [
  // объ. Ссылка отраб.стр., Комп.стр. (по url Admin вызов комп. админа)
  { /* path: "/", */ path: SHOP_ROUTE, Component: Shop },
  // login|registr один Комп. но с разным маршр. в строке запроса
  { path: /* LOGIN_ROUTE */ "/login", Component: Login },
  { path: SIGNUP_ROUTE, Component: Signup },
  { path: UTV_LOGIN_ROUTE, Component: Auth },
  { path: UTV_REGISTRATION_ROUTE, Component: Auth },
  { path: DEVICE_ROUTE + "/:id", Component: DevicePage },
  { path: DELIVERY_ROUTE, Component: Delivery },
  { path: CONTACTS_ROUTE, Component: Contacts },
  // { path: NOTFOUND_ROUTE, Component: NotFound },
];

// Доступ для Авториз.польз.(Админ панель, Корзина, Польз.)
export const authRoutes = [
  { path: ADMIN_ROUTE, Component: Admin },
  { path: BASKET_Tok_ROUTE, Component: BasketTok },
  { path: BASKET_UTVst_ROUTE, Component: BasketUtVst },
  { path: USER_ROUTE, Component: User },
];

// Доступ для Админа (Админ панель)
export const adminRoutes = [{ path: ADMIN_ROUTE, Component: Admin }];
