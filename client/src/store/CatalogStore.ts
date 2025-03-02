// ^ хранилище Каталога (Категории, Бренды, Продукты, фильтры/пагинация/сортировка, загрузка)
import { makeAutoObservable, runInAction } from "mobx";

import {
  ProductData,
  CategoryData,
  BrandData,
} from "@/types/api/catalog.types";
import { categoryAPI } from "@/api/catalog/categoryAPI";
import { brandAPI } from "@/api/catalog/brandAPI";
import { productAPI } from "@/api/catalog/productAPI";
import { SHOP_CATALOG_ROUTE, SHOP_ROUTE } from "@/utils/consts";

class CatalogStore {
  // масс.ответа
  categories: CategoryData[] = [];
  brands: BrandData[] = [];
  products: ProductData[] = [];
  // фильтры - Категория/Бренд
  filters = {
    category: null as string | null,
    brand: null as string | null,
  };
  // пагинация стр. - текущая, кол-во Продуктов на стр., общ.кол-во Продуктов
  pagination = {
    page: 1,
    limit: 10,
    totalCount: 0,
  };
  // сортировка по - полю(имя/цена/рейтинг/голоса), порядку(возврастанию/убыванию)
  sortSettings = {
    field: "name" as "name" | "price" | "rating" | "votes",
    order: "ASC" as "ASC" | "DESC",
  };
  // состояние загрузки
  isLoading = false;
  // отдел.флаги загр.от повтор.загр.
  isFetchingCategories = false;
  isFetchingBrands = false;

  constructor() {
    // автообраб.измен.в.ф.с обёрткой в декораторы - observable/`наблюдаемый` и action/`действие`
    makeAutoObservable(this);
    // автопривязка контекста this к мтд., оптимиз.> больших объ.
    this, {}, { autoBind: true, deep: false };
    // > автоотслеж.зависимости и автовыполн.кода при измен.наблюдаемых данных
    // autorun(() => { if (this.shouldFetch) { this.fetchProducts(); } });
  }

  // мтд.получ.данн.с БД (получ.Все Категории ч/з внутр.API с настр. загр./обраб./ошб./логг.)
  async fetchCategories(): Promise<void> {
    // проверка на пустой массив и флаг загр.Категории
    if (this.isFetchingCategories || this.categories.length > 0) return;
    // загр.вкл.
    this.isFetchingCategories = true;
    try {
      //  ч/з внутр.мтд.API req к БД
      const data = await categoryAPI.getAllCategories();
      // групп.асинхр.обнов.сост.в одном атомарное изменение > сложн.req от лишних обновлений | от ошб./предупреждения [MobX] о строг.режиме
      runInAction(() => {
        // запись данн.БД в хранилище
        this.categories = data;
      });
    } catch (error) {
      // лог.ошб.
      console.error("Ошибка загрузки Категорий:", error);
    } finally {
      runInAction(() => {
        // загр.выкл.
        this.isFetchingCategories = false;
      });
    }
  }

  async fetchBrands(): Promise<void> {
    if (this.isFetchingBrands || this.brands.length > 0) return;
    this.isFetchingBrands = true;
    try {
      const data = await brandAPI.getAllBrands();
      runInAction(() => {
        this.brands = data;
      });
    } catch (error) {
      console.error("Ошибка загрузки Брендов:", error);
    } finally {
      runInAction(() => {
        this.isFetchingBrands = false;
      });
    }
  }

  // объедин.мтд.загр.Категорий/Брендов
  async fetchInitialCatalog(): Promise<void> {
    if (this.isLoading || (this.categories.length && this.brands.length))
      return;
    this.isLoading = true;
    try {
      await Promise.all([this.fetchCategories(), this.fetchBrands()]);
    } catch (error) {
      console.error("Ошибка загрузки данных Каталога:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // загр.Продуктов
  async fetchProducts(): Promise<void> {
    if (this.isLoading || this.products.length) this.isLoading = true;
    this.isLoading = true;
    try {
      const { rows, count } = await productAPI.getAllProducts(
        this.filters.category?.toString(),
        this.filters.brand?.toString(),
        this.pagination.page,
        this.pagination.limit,
        this.sortSettings.order,
        this.sortSettings.field
      );
      runInAction(() => {
        this.products = rows;
        this.pagination.totalCount = count;
      });
    } catch (error) {
      console.error("Ошибка загрузки продуктов:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // мтд.фильтра Категорий
  setCategory(category: string | null) {
    if (this.filters.category !== category) {
      this.filters.category = category;
      this.resetPagination();
      this.fetchProducts();
      this.updateUrlParams();
    }
  }

  // мтд.фильтра Брендов
  setBrand(brand: string | null) {
    if (this.filters.brand !== brand) {
      this.filters.brand = brand;
      this.resetPagination();
      this.fetchProducts();
      this.updateUrlParams();
    }
  }

  // мтд. Пагинации
  setPage(page: number) {
    if (this.pagination.page !== page) {
      this.pagination.page = page;
      this.fetchProducts();
      this.updateUrlParams();
    }
  }

  // мтд. измен.кол-во эл.на стр.
  setLimit(limit: number) {
    if (this.pagination.limit !== limit) {
      this.pagination.limit = limit;
      this.resetPagination();
      this.fetchProducts();
      this.updateUrlParams();
    }
  }

  // мтд. Сортировки
  setSortSettings(
    field: "name" | "price" | "rating" | "votes",
    order: "ASC" | "DESC"
  ) {
    if (this.sortSettings.field === field && this.sortSettings.order === order)
      return;
    this.sortSettings.field = field;
    this.sortSettings.order = order;
    this.resetPagination();
    this.fetchProducts();
    this.updateUrlParams();
  }

  // обнуления стр.при измен.фильтров
  resetPagination() {
    this.pagination.page = 1;
  }

  // мтд.> обнов.парам.в URL
  updateUrlParams(pathname?: string) {
    const params: Record<string, string> = {};
    if (this.filters.category) params.category = this.filters.category;
    if (this.filters.brand) params.brand = this.filters.brand;
    if (this.pagination.page > 1) params.page = this.pagination.page.toString();
    if (this.pagination.limit !== 10)
      params.limit = this.pagination.limit.toString();
    if (this.sortSettings.order !== "ASC")
      params.order = this.sortSettings.order;
    if (this.sortSettings.field !== "name")
      params.field = this.sortSettings.field;

    const search = new URLSearchParams(params).toString();
    let varpathname = pathname
      ? pathname
      : this.filters.category || this.filters.brand
        ? SHOP_CATALOG_ROUTE
        : SHOP_ROUTE;

    window.history.replaceState(null, "", `${varpathname}?${search}`);
  }
}

export default CatalogStore;
