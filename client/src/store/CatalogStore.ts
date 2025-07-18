// ^ хранилище Каталога (Категории, Бренды, Продукты, фильтры/пагинация/сортировка, загрузка)

import { action, makeAutoObservable, observable, runInAction, spy } from "mobx";

import type {
  ProductData,
  CategoryData,
  BrandData,
  PropertyData,
} from "@/types/api/catalog.types";
import { categoryAPI } from "@/api/catalog/categoryAPI";
import { brandAPI } from "@/api/catalog/brandAPI";
import { productAPI } from "@/api/catalog/productAPI";
import { ratingAPI } from "@/api/catalog/ratingAPI";
import { SHOP_CATALOG_ROUTE, SHOP_ROUTE } from "@/utils/consts";

class CatalogStore {
  // масс.данн.Категории/Бренды/Продукты с авто отслеж./обновл.данн.у наблюдателей
  @observable categories: CategoryData[] = [];
  @observable brands: BrandData[] = [];
  // Общ.масс.Продуктов, Один Продукт
  @observable products: ProductData[] = [];
  @observable product: ProductData | null = null;
  // фильтры Категории/Бренды с глубоким авто отслеж./обновл.данн.влож.объ/полей у наблюдателей
  @observable.deep filters = {
    category: null as string | null,
    brand: null as string | null,
  };
  // пагинация стр. - текущая, кол-во Продуктов на стр., общ.кол-во Продуктов
  @observable.deep pagination = {
    page: 1,
    limit: 10,
    totalCount: 0,
  };
  // сортировка по - полю(имя/цена/рейтинг/голоса), порядку(возврастанию/убыванию)
  @observable.deep sortSettings = {
    field: "name" as "name" | "price" | "rating" | "votes",
    order: "ASC" as "ASC" | "DESC",
  };
  // состояние загрузки
  @observable isLoading = false;

  // хеш URL параметров запроса (последний)
  private lastUrlParamsHash = "";
  // хеш Свойства Продукта
  private propsCache = new Map<number, PropertyData[]>();

  constructor() {
    // автообраб.измен.в.ф.с обёрткой в декораторы - observable/`наблюдаемый` и action/`действие`
    makeAutoObservable(
      // объ.клс.наблюдения
      this,
      // опред.конкретн.св-в
      {},
      // оптимиз.: откл.автопривязки контекста this к мтд. е/и нет колбеков, откл.глубок.наблюд. > больших объ.по умолч.
      { autoBind: false, deep: false }
    );

    // логирование изменений
    spy((event) => {
      if (event.type === "action") console.log("Action:", event.name);
    });

    // чтение данн.из localStorage при инициализации
    this.loadFromLocalStorage();
  }

  // LOCALSTORE ----------------------------------------------------------------------------------

  // загр.данн.из LS
  @action private loadFromLocalStorage() {
    const storedData = localStorage.getItem("catalogStore");
    if (!storedData) return;

    try {
      const parsedData = JSON.parse(storedData);
      Object.assign(this, parsedData);
    } catch (error) {
      console.error("Ошибка Загрузки CatalogStore из LS : ", error);
      this.clearLocalStorage();
    }
  }

  // сохр.данн.в LS
  @action private saveToLocalStorage() {
    try {
      // с зашитой от undefined/null или методов
      const data = {
        categories: this.categories.filter(Boolean),
        brands: this.brands.filter(Boolean),
        products: this.products.filter(Boolean),
        product: this.product ? { ...this.product } : null,
        filters: { ...this.filters },
        pagination: { ...this.pagination },
        sortSettings: { ...this.sortSettings },
      };
      localStorage.setItem("catalogStore", JSON.stringify(data));
    } catch (error) {
      console.error("Ошибка Сохранения catalogStore в LS : ", error);
    }
  }

  // удал.данн.из LS
  @action private clearLocalStorage() {
    localStorage.removeItem("catalogStore");
  }

  // ASYNC ----------------------------------------------------------------------------------

  // мтд.получ.данн.с БД (получ.Все Категории ч/з внутр.API с настр. загр./обраб./ошб./логг.)
  @action async fetchCategories(): Promise<void> {
    try {
      //  ч/з внутр.мтд.API req к БД
      const data = await categoryAPI.getAllCategories();
      // групп.асинхр.обнов.сост.в одном атомарное изменение > сложн.req от лишних обновлений | от ошб./предупреждения [MobX] о строг.режиме
      runInAction(() => {
        // запись данн.из БД в хранилище
        this.categories = Array.isArray(data) ? data : [];
        // сохр.данн.в LS
        this.saveToLocalStorage();
      });
    } catch (error) {
      // лог.ошб.
      console.error("Ошибка загрузки Категорий:", error);
    } finally {
      runInAction(() => {});
    }
  }

  @action async fetchBrands(): Promise<void> {
    try {
      const data = await brandAPI.getAllBrands();
      runInAction(() => {
        this.brands = Array.isArray(data) ? data : [];
        this.saveToLocalStorage();
      });
    } catch (error) {
      console.error("Ошибка загрузки Брендов:", error);
    } finally {
      runInAction(() => {});
    }
  }

  // объедин.мтд.загр.Категорий/Брендов
  @action async fetchInitialCatalog(): Promise<void> {
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

  // загр.Всех Продуктов
  @action async fetchAllProducts(): Promise<void> {
    // созд.нов.хеш, сравн.с послед.хешем, обнов.хеш при изменен.
    const { category, brand } = this.filters;
    const { page, limit } = this.pagination;
    const { order, field } = this.sortSettings;
    const currentHash = this.getHashUrlParams(
      category,
      brand,
      page,
      limit,
      order,
      field
    );
    if (this.isLoading && currentHash === this.lastUrlParamsHash) return;
    this.lastUrlParamsHash = currentHash;
    // нач.загр.
    this.isLoading = true;

    try {
      const productsAll = await productAPI.getAllProducts(
        category,
        brand,
        page,
        limit,
        order,
        field
      );
      runInAction(() => {
        this.products = productsAll.rows;
        this.pagination.totalCount = productsAll.pagination.count;
        // сохр.данн.в LS
        this.saveToLocalStorage();
      });
    } catch (error) {
      console.error("Ошибка загрузки Всех Продуктов:", error);
      runInAction(() => {
        this.lastUrlParamsHash = "";
      });
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // загр.Одного Продукта
  @action async fetchProductById(id: number): Promise<void> {
    if (this.product?.id === id) return;
    this.isLoading = true;
    try {
      const product = await productAPI.getOneProduct(id);
      runInAction(() => {
        // сохр.в Один Продукт
        this.product = product;
        // обнов.в Общ.Продуктах
        this.mergeProductIntoList(product);
        // сохр.данн.в LS
        this.saveToLocalStorage();
      });
    } catch (error) {
      console.error("Ошибка загрузки Одного Продукта:", error);
      runInAction(() => (this.product = null));
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // загр.Св-тв Продукта
  @action async fetchProductProperties(productId: number): Promise<void> {
    // возврат при наличии хеша
    if (this.propsCache.has(productId)) {
      this.updateProductProperties(productId);
      return;
    }
    this.isLoading = true;

    try {
      const props = await productAPI.getAllProperty(productId);
      runInAction(() => {
        // сохр.в хеш, обнов.связанные Свойства в Общ.Продуктах и Одном Продукте, сохр.в LS
        this.propsCache.set(productId, props);
        this.updateProductProperties(productId, props);
        this.saveToLocalStorage();
      });
    } catch (error) {
      console.error("Ошибка Загрузки Свойств Продукта:", error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // обнов.Рейтинга Продукта
  @action async fetchUpdateProductRating(
    userId: number,
    productId: number,
    rating: number
  ): Promise<any> {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      const ratingData = await ratingAPI.createProductRating(
        userId,
        productId,
        rating
      );
      runInAction(() => {
        // обнов.Рейтинг в Общ.Продуктах и Одном Продукте
        this.updateProductRatingInState(productId, ratingData.rating);
        this.saveToLocalStorage();
      });
      // return ratingData;
    } catch (error) {
      console.error("Ошибка обновления Рейтинга:", error);
      throw error;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // ДОП.МТД. (ПРОДУКТЫ/СВОЙСТВА/РЕЙТИНГ) ----------------------------------------------------------------------------------

  // объедин.Продукт в Общ.Продуктах
  private mergeProductIntoList(product: ProductData) {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index >= 0) this.products[index] = product;
    else this.products.push(product);
  }

  // обнов.везде Св-ва Продукта
  private updateProductProperties(productId: number, props?: PropertyData[]) {
    const properties = props || this.propsCache.get(productId);
    if (!properties) return;

    // обнов. Свойства в Общ./Одном Продукте
    this.products = this.products.map((p) =>
      p.id === productId ? { ...p, props: [...properties] } : p
    );
    if (this.product?.id === productId) {
      this.product = { ...this.product, props: [...properties] };
    }
  }

  // обнов.везде Рейтинг Продукта
  private updateProductRatingInState(productId: number, rating: number) {
    this.products = this.products.map((p) =>
      p.id === productId ? { ...p, rating } : p
    );
    if (this.product?.id === productId) {
      this.product = { ...this.product, rating };
    }
  }

  // ГЕТТЕРЫ ----------------------------------------------------------------------------------

  // получение Одного Продукта в хран-ще
  getProductById(id: number): ProductData | null {
    return this.products.find((p) => p.id === id) || null;
  }

  // хеширование/последний хеш URL параметров запроса
  private getHashUrlParams(
    category: string | null,
    brand: string | null,
    page: number,
    limit: number,
    order: "ASC" | "DESC",
    field: "name" | "price" | "rating" | "votes"
  ): string {
    return JSON.stringify({
      category,
      brand,
      page,
      limit,
      order,
      field,
    });
  }

  // СЕТТЕРЫ ----------------------------------------------------------------------------------

  // мтд.фильтра Категорий
  @action setCategory(category: string | null) {
    if (this.filters.category !== category) {
      this.filters.category = category;
      this.resetPagination();
      this.fetchAllProducts();
      this.updateUrlParams();
    }
  }

  // мтд.фильтра Брендов
  @action setBrand(brand: string | null) {
    if (this.filters.brand !== brand) {
      this.filters.brand = brand;
      this.resetPagination();
      this.fetchAllProducts();
      this.updateUrlParams();
    }
  }

  // мтд. Пагинации
  @action setPage(page: number) {
    if (this.pagination.page !== page) {
      this.pagination.page = page;
      this.fetchAllProducts();
      this.updateUrlParams();
    }
  }

  // мтд. измен.кол-во эл.на стр.
  @action setLimit(limit: number) {
    if (this.pagination.limit !== limit) {
      this.pagination.limit = limit;
      this.resetPagination();
      this.fetchAllProducts();
      this.updateUrlParams();
    }
  }

  // мтд. Сортировки
  @action setSortSettings(
    field: "name" | "price" | "rating" | "votes",
    order: "ASC" | "DESC"
  ) {
    if (this.sortSettings.field === field && this.sortSettings.order === order)
      return;
    this.sortSettings.field = field;
    this.sortSettings.order = order;
    this.resetPagination();
    this.fetchAllProducts();
    this.updateUrlParams();
  }

  // обнуления стр.при измен.фильтров
  @action resetPagination() {
    this.pagination.page = 1;
    this.pagination.totalCount = 0;
  }

  // мтд.> обнов.парам.в URL
  @action updateUrlParams(pathname?: string) {
    const { category, brand } = this.filters;
    const { page, limit } = this.pagination;
    const { order, field } = this.sortSettings;

    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (brand) params.append("brand", brand);
    if (page > 1) params.append("page", page.toString());
    if (limit !== 10) params.append("limit", limit.toString());
    if (order !== "ASC") params.append("order", order);
    if (field !== "name") params.append("field", field);

    const path = pathname
      ? pathname
      : category || brand
        ? SHOP_CATALOG_ROUTE
        : SHOP_ROUTE;
    const url = `${path}?${params.toString()}`;

    if (window.location.pathname + window.location.search !== url) {
      window.history.replaceState(null, "", url);
    }
  }
}

export default CatalogStore;
