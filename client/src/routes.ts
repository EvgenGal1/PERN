import {
  SHOP_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  DEVICE_ROUTE,
  DELIVERY_ROUTE,
  CONTACTS_ROUTE,
  NOTFOUND_ROUTE,
  USER_ROUTE,
  BASKET_ROUTE,
  ADMIN_ROUTE,
} from "./utils/consts";
import Shop from "./Components/pages/public/Shop";
import Auth from "./Components/pages/public/Auth";
import DevicePage from "./Components/pages/public/DevicePage";
import Delivery from "./Components/pages/public/Delivery";
import Contacts from "./Components/pages/public/Contacts";
import NotFound from "./Components/pages/public/NotFound";
import User from "./Components/pages/auth/User";
import Basket from "./Components/pages/auth/Basket";
import Admin from "./Components/pages/admin/Admin";

// ! https://tokmakov.blog.msk.ru/blog/item/673 разобрать примеры и 677
// 2 МАРШРУТА ++

// Доступ для любых польз.(Магз., Логин, Регистр., Конкретн.Устр.с ID)
export const publicRoutes = [
  // объ. Ссылка отраб.стр., Комп.стр. (по url Admin вызов комп. админа)
  { /* path: "/", */ path: SHOP_ROUTE, Component: Shop },
  // login|registr один Комп. но с разным маршр. в строке запроса
  { path: LOGIN_ROUTE, Component: Auth },
  { path: REGISTRATION_ROUTE, Component: Auth },
  { path: DEVICE_ROUTE + "/:id", Component: DevicePage },
  { path: DELIVERY_ROUTE, Component: Delivery },
  { path: CONTACTS_ROUTE, Component: Contacts },
  { path: NOTFOUND_ROUTE, Component: NotFound },
];

// Доступ для Авториз.польз.(Админ панель, Корзина, Польз.)
export const authRoutes = [
  { path: ADMIN_ROUTE, Component: Admin },
  { path: BASKET_ROUTE, Component: Basket },
  { path: USER_ROUTE, Component: User },
];

// Доступ для Админа (Админ панель)
export const adminRoutes = [{ path: ADMIN_ROUTE, Component: Admin }];
