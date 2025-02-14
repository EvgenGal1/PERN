import {
  ADMINBRANDS_ROUTE,
  ADMINCATEGORIES_ROUTE,
  ADMINORDERS_ROUTE,
  ADMINORDER_ROUTE,
  ADMINPRODUCTS_ROUTE,
  ADMIN_ROUTE,
  BASKET_ROUTE,
  CHECKOUT_ROUTE,
  CONTACTS_ROUTE,
  DELIVERY_ROUTE,
  DEVICE_ROUTE,
  FILTER_ROUTE,
  LOGIN_ROUTE,
  NOTFOUND_ROUTE,
  PRODUCT_ROUTE,
  REGISTER_ROUTE,
  SHOP_CATALOG_ROUTE,
  SHOP_ROUTE,
  USERORDERS_ROUTE,
  USERORDER_ROUTE,
  USER_ROUTE,
} from "../../../utils/consts";

// общ.эл.
import Contacts from "../../pages/public/Contacts";
import Delivery from "../../pages/public/Delivery";
import DevicePage from "../../pages/public/DevicePage";
import NotFound from "../../pages/public/NotFound";
// ^ tokmakov
// import Login from "../../pages/public/AppTok/Login";
// import Register from "../../pages/public/AppTok/Register";
import Admin from "../../pages/admin/Admin";
import AdminBrands from "../../pages/admin/AdminBrands";
import AdminCategories from "../../pages/admin/AdminCategories";
import AdminOrder from "../../pages/admin/AdminOrder";
import AdminOrders from "../../pages/admin/AdminOrders";
import AdminProducts from "../../pages/admin/AdminProducts";
import User from "../../pages/auth/User";
import UserOrder from "../../pages/auth/UserOrder";
import UserOrders from "../../pages/auth/UserOrders";
import Auth from "../../pages/public/AppTok/Auth";
import Basket from "../../pages/public/AppTok/Basket";
import Checkout from "../../pages/public/AppTok/Checkout";
import Product from "../../pages/public/AppTok/Product";
import SearchFilter from "../../pages/public/AppTok/SearchFilter";
import Shop from "../../pages/public/AppTok/Shop";

// ! https://tokmakov.blog.msk.ru/blog/item/673 разобрать примеры и 677
// 2 МАРШРУТА ++

// Доступ для любых польз.(Магз., Логин, Регистр., Конкретн.Устр.с ID, ...,)
export const publicRoutes = [
  // ^ {путь отраб.стр., Комп.стр.} (по url ADMIN_ROUTE(/admin) вызов Комп.Admin)
  // путь Магазина, Каталога(+доп.к URL), Поиска(+доп.к URL)
  { /* "/", */ path: SHOP_ROUTE, Component: Shop },
  { path: SHOP_CATALOG_ROUTE, Component: Shop },
  { path: FILTER_ROUTE, Component: SearchFilter },
  // Замена 2 Комп.Login|Register на один Комп.с разн.маршр. в строке запроса
  { path: LOGIN_ROUTE, Component: /* Login */ Auth },
  { path: REGISTER_ROUTE, Component: /* Register */ Auth },
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
  { path: USERORDERS_ROUTE, Component: UserOrders },
  { path: USERORDER_ROUTE, Component: UserOrder },
];

// Доступ для Админа (Админ панель)
export const adminRoutes = [
  { path: ADMIN_ROUTE, Component: Admin },
  { path: ADMINORDERS_ROUTE, Component: AdminOrders },
  { path: ADMINORDER_ROUTE, Component: AdminOrder },
  { path: ADMINCATEGORIES_ROUTE, Component: AdminCategories },
  { path: ADMINBRANDS_ROUTE, Component: AdminBrands },
  { path: ADMINPRODUCTS_ROUTE, Component: AdminProducts },
];
