// ^ маршруты с доступами

// константы путей
import {
  ADMINBRANDS_ROUTE,
  ADMINCATEGORIES_ROUTE,
  ADMINORDERS_ROUTE,
  ADMINORDER_ROUTE,
  ADMINPRODUCTS_ROUTE,
  ADMIN_ROUTE,
  BASKET_ROUTE,
  CHECKOUT_ROUTE,
  ABOUTME_ROUTE,
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
} from "@/utils/consts";
// общ.эл.
import Contacts from "@Comp/pages/public/Contacts";
import Delivery from "@Comp/pages/public/Delivery";
import DevicePage from "@Comp/pages/public/DevicePage";
import NotFound from "@Comp/pages/public/NotFound";
// import Login from "../../pages/public/AppTok/Login";
// import Register from "../../pages/public/AppTok/Register";
import Admin from "@Comp/pages/admin/Admin";
import AdminBrands from "@Comp/pages/admin/AdminBrands";
import AdminCategories from "@Comp/pages/admin/AdminCategories";
import AdminOrder from "@Comp/pages/admin/AdminOrder";
import AdminOrders from "@Comp/pages/admin/AdminOrders";
import AdminProducts from "@Comp/pages/admin/AdminProducts";
import User from "@Comp/pages/auth/User";
import UserOrder from "@Comp/pages/auth/UserOrder";
import UserOrders from "@Comp/pages/auth/UserOrders";
import Auth from "@Comp/pages/public/AppTok/Auth";
import Basket from "@Comp/pages/public/AppTok/Basket";
import Checkout from "@Comp/pages/public/AppTok/Checkout";
import Product from "@Comp/pages/public/AppTok/Product";
import SearchFilter from "@Comp/common/SearchFilter";
import Shop from "@Comp/pages/public/AppTok/Shop";
import AboutMe from "@Comp/pages/public/AboutMe";

// доступ для любых польз.(Магз., Логин, Регистр., Конкретн.Устр.с ID, ...,)
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
  { path: ABOUTME_ROUTE, Component: AboutMe },
];

// доступ для Авториз.польз.(Польз.)
export const authRoutes = [
  { path: USER_ROUTE, Component: User },
  { path: USERORDERS_ROUTE, Component: UserOrders },
  { path: USERORDER_ROUTE, Component: UserOrder },
];

// доступ для Админа (Админ панель)
export const adminRoutes = [
  { path: ADMIN_ROUTE, Component: Admin },
  { path: ADMINORDERS_ROUTE, Component: AdminOrders },
  { path: ADMINORDER_ROUTE, Component: AdminOrder },
  { path: ADMINCATEGORIES_ROUTE, Component: AdminCategories },
  { path: ADMINBRANDS_ROUTE, Component: AdminBrands },
  { path: ADMINPRODUCTS_ROUTE, Component: AdminProducts },
];
