import {
  DEVICE_ROUTE,
  DELIVERY_ROUTE,
  CONTACTS_ROUTE,
  NOTFOUND_ROUTE,
  SHOP_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  PRODUCT_ROUTE,
  BASKET_ROUTE,
  USER_ROUTE,
  USERORDER_ROUTE,
  USERORDERS_ROUTE,
  CHECKOUT_ROUTE,
  ADMIN_ROUTE,
} from "../../../utils/consts";

// общ.эл.
import DevicePage from "../../pages/public/DevicePage";
import Delivery from "../../pages/public/Delivery";
import Contacts from "../../pages/public/Contacts";
import NotFound from "../../pages/public/NotFound";
// ^ tokmakov
// import Login from "../../pages/public/AppTok/Login";
// import Signup from "../../pages/public/AppTok/Signup";
import Shop from "../../pages/public/AppTok/Shop";
import Auth from "../../pages/public/AppTok/Auth";
import Product from "../../pages/public/AppTok/Product";
import Basket from "../../pages/public/AppTok/Basket";
import User from "../../pages/auth/User";
import UserOrder from "../../pages/public/AppTok/UserOrder.js";
import UserOrders from "../../pages/public/AppTok/UserOrders.js";
import Checkout from "../../pages/public/AppTok/Checkout.js";
import Admin from "../../pages/admin/Admin";
// ^ UlbiTV
// import Auth_UTV from "../../pages/public/AppUTVst/Auth";
// import BasketUtVst from "../../pages/auth/Basket";

// ! https://tokmakov.blog.msk.ru/blog/item/673 разобрать примеры и 677
// 2 МАРШРУТА ++

// Доступ для любых польз.(Магз., Логин, Регистр., Конкретн.Устр.с ID)
export const publicRoutes = [
  // {путь отраб.стр., Комп.стр.} (по url ADMIN_ROUTE(/admin) вызов Комп.Admin)
  { /* "/", */ path: SHOP_ROUTE, Component: Shop },
  // Замена 2 Комп.Login|Signup на один Комп.с разн.путями
  { path: LOGIN_ROUTE, Component: /* Login */ Auth },
  { path: SIGNUP_ROUTE, Component: /* Signup */ Auth },
  { path: BASKET_ROUTE, Component: Basket },
  { path: PRODUCT_ROUTE + "/:id", Component: Product },
  { path: DEVICE_ROUTE + "/:id", Component: DevicePage },
  { path: DELIVERY_ROUTE, Component: Delivery },
  { path: CONTACTS_ROUTE, Component: Contacts },
  { path: NOTFOUND_ROUTE, Component: NotFound },
  // login|registr один Комп. но с разным маршр. в строке запроса
  // { path: UTV_LOGIN_ROUTE, Component: Auth_UTV },
  // { path: UTV_REGISTRATION_ROUTE, Component: Auth_UTV },
];

// Доступ для Авториз.польз.(Корзина, Польз.)
export const authRoutes = [
  // { path: BASKET_ROUTE, Component: Basket },
  { path: USER_ROUTE, Component: User },
  // { path: BASKET_UTVst_ROUTE, Component: BasketUtVst },
];

// Доступ для Админа (Админ панель)
export const adminRoutes = [{ path: ADMIN_ROUTE, Component: Admin }];
