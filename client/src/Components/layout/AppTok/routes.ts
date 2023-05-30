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
  ADMINORDER_ROUTE,
  ADMINORDERS_ROUTE,
  ADMINCATEGORIES_ROUTE,
  ADMINBRANDS_ROUTE,
  ADMINPRODUCTS_ROUTE,
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
import UserOrder from "../../pages/auth/UserOrder";
import UserOrders from "../../pages/auth/UserOrders";
import Checkout from "../../pages/public/AppTok/Checkout";
import Admin from "../../pages/admin/Admin";
import AdminOrder from "../../pages/public/AppTok/AdminOrder";
import AdminOrders from "../../pages/public/AppTok/AdminOrders";
import AdminCategories from "../../pages/admin/AdminCategories";
import AdminBrands from "../../pages/admin/AdminBrands";
import AdminProducts from "../../pages/admin/AdminProducts";

// ! https://tokmakov.blog.msk.ru/blog/item/673 разобрать примеры и 677
// 2 МАРШРУТА ++

// Доступ для любых польз.(Магз., Логин, Регистр., Конкретн.Устр.с ID, ...,)
export const publicRoutes = [
  // ^ {путь отраб.стр., Комп.стр.} (по url ADMIN_ROUTE(/admin) вызов Комп.Admin)
  // Замена 2 Комп.Login|Signup на один Комп.с разн.маршр. в строке запроса
  { /* "/", */ path: SHOP_ROUTE, Component: Shop },
  { path: LOGIN_ROUTE, Component: /* Login */ Auth },
  { path: SIGNUP_ROUTE, Component: /* Signup */ Auth },
  { path: PRODUCT_ROUTE + "/:id", Component: Product },
  { path: DEVICE_ROUTE + "/:id", Component: DevicePage },
  { path: DELIVERY_ROUTE, Component: Delivery },
  { path: CONTACTS_ROUTE, Component: Contacts },
  { path: NOTFOUND_ROUTE, Component: NotFound },
  { path: BASKET_ROUTE, Component: Basket },
  { path: CHECKOUT_ROUTE, Component: Checkout },
];

// Доступ для Авториз.польз.(Польз.)
export const authRoutes = [
  { path: USER_ROUTE, Component: User },
  { path: USERORDER_ROUTE, Component: UserOrders },
  { path: USERORDERS_ROUTE, Component: UserOrder },
];

// Доступ для Админа (Админ панель)
export const adminRoutes = [
  { path: ADMIN_ROUTE, Component: Admin },
  { path: ADMINORDER_ROUTE, Component: AdminOrders },
  { path: ADMINORDERS_ROUTE, Component: AdminOrder },
  { path: ADMINCATEGORIES_ROUTE, Component: AdminCategories },
  { path: ADMINBRANDS_ROUTE, Component: AdminBrands },
  { path: ADMINPRODUCTS_ROUTE, Component: AdminProducts },
];
