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
import Admin from "@Comp/pages/admin/Admin";
import AdminBrands from "@Comp/pages/admin/AdminBrands";
import AdminCategories from "@Comp/pages/admin/AdminCategories";
import AdminOrder from "@Comp/pages/admin/AdminOrder";
import AdminOrders from "@Comp/pages/admin/AdminOrders";
import AdminProducts from "@Comp/pages/admin/AdminProducts";
import User from "@Comp/pages/user/User";
import UserOrder from "@Comp/pages/user/features/UserOrder";
import UserOrders from "@Comp/pages/user/features/UserOrders";
import Auth from "@Comp/pages/auth/Auth";
import Basket from "@Comp/pages/user/Basket";
import Checkout from "@Comp/pages/auth/Checkout";
import Product from "@Comp/pages/shop/Product";
import SearchFilter from "@Comp/common/SearchFilter";
import Shop from "@Comp/pages/shop/Shop";
import AboutMe from "@Comp/pages/public/AboutMe";

export interface RouteConfig {
  path: string;
  Component: React.ComponentType;
  exact?: boolean;
  roles?: Array<{ role: string; level?: number }>;
}

// публичные маршруты > всех Пользователей (Магз., Логин, Регистр., Конкретн.Устр.с ID, ...,)
export const publicRoutes: RouteConfig[] = [
  // ^ {путь отраб.стр., Комп.стр.} (по url ADMIN_ROUTE(/admin) вызов Комп.Admin)
  // путь Магазина, Каталога(+доп.к URL), Поиска(+доп.к URL)
  { path: SHOP_ROUTE, Component: Shop, exact: true },
  { path: SHOP_CATALOG_ROUTE, Component: Shop },
  { path: FILTER_ROUTE, Component: SearchFilter },
  // Замена 2 Комп.Login|Register на один Комп.с разн.маршр. в строке запроса
  { path: LOGIN_ROUTE, Component: Auth },
  { path: REGISTER_ROUTE, Component: Auth },
  { path: PRODUCT_ROUTE + "/:id", Component: Product },
  { path: DEVICE_ROUTE + "/:id", Component: DevicePage },
  { path: DELIVERY_ROUTE, Component: Delivery },
  { path: CONTACTS_ROUTE, Component: Contacts },
  { path: NOTFOUND_ROUTE, Component: NotFound },
  { path: BASKET_ROUTE, Component: Basket },
  { path: CHECKOUT_ROUTE, Component: Checkout },
  { path: ABOUTME_ROUTE, Component: AboutMe },
];

// маршруты > Авториз.Пользователя с доступом по Роли/Уровню
export const authRoutes: RouteConfig[] = [
  {
    path: USER_ROUTE,
    Component: User,
    roles: [{ role: "USER", level: 1 }],
  },
  {
    path: USERORDERS_ROUTE,
    Component: UserOrders,
    roles: [{ role: "USER", level: 1 }],
  },
  {
    path: USERORDER_ROUTE,
    Component: UserOrder,
    roles: [{ role: "USER", level: 1 }],
  },
];

// маршруты > Админа с доступом по Роли/Уровню
export const adminRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: Admin,
    roles: [
      { role: "ADMIN", level: 3 },
      { role: "MODERATOR", level: 2 },
    ],
  },
  {
    path: ADMINORDERS_ROUTE,
    Component: AdminOrders,
    roles: [{ role: "ADMIN", level: 1 }],
  },
  {
    path: ADMINORDER_ROUTE,
    Component: AdminOrder,
    roles: [{ role: "ADMIN", level: 1 }],
  },
  {
    path: ADMINCATEGORIES_ROUTE,
    Component: AdminCategories,
    roles: [{ role: "ADMIN", level: 1 }],
  },
  {
    path: ADMINBRANDS_ROUTE,
    Component: AdminBrands,
    roles: [{ role: "ADMIN", level: 1 }],
  },
  {
    path: ADMINPRODUCTS_ROUTE,
    Component: AdminProducts,
    roles: [{ role: "ADMIN", level: 1 }],
  },
];
