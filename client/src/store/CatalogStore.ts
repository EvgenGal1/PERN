// ^ хранилище Каталога (Категории, Бренды, Продукты, фильтры/пагинация/сортировка, загрузка)

import { action, makeAutoObservable, observable, runInAction, spy } from "mobx";

import type {
  CatalogStoreData,
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
  // общ.масс.данн. Продуктов, отдел.Продукт
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

  // хеширование/последний хеш URL параметров запроса
  private getHashUrlParams(params: Record<string, unknown>): string {
    return JSON.stringify(params);
  }
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
    const storedData = localStorage.getItem("catalogStore");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as Partial<CatalogStoreData>;
        this.categories = parsedData.categories || [];
        this.brands = parsedData.brands || [];
        this.products = parsedData.products || [];
        this.product = parsedData.product ?? null;
        this.filters = parsedData.filters || { category: null, brand: null };
        this.pagination = parsedData.pagination || {
          page: 1,
          limit: 10,
          totalCount: 0,
        };
        this.sortSettings = parsedData.sortSettings || {
          field: "name",
          order: "ASC",
        };
      } catch (error) {
        console.error("Ошибка чтения catalogStore из LS:", error);
        this.clearLocalStorage();
      }
    }
  }

  // LOCALSTORE ----------------------------------------------------------------------------------

  // сохр.данн.в LS
  @action saveToLocalStorage() {
    // с зашитой от undefined или методов
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
  }

  // удал.данн.из LS
  @action clearLocalStorage() {
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
    // созд.нов.хеш, сравн.со стар.хешем, обновление хеша
    const params = {
      category: this.filters.category,
      brand: this.filters.brand,
      page: this.pagination.page,
      limit: this.pagination.limit,
      order: this.sortSettings.order,
      field: this.sortSettings.field,
    };
    const hash = this.getHashUrlParams(params);
    if (this.isLoading && hash === this.lastUrlParamsHash) return;
    this.lastUrlParamsHash = hash;
    // нач.загр.
    this.isLoading = true;
    try {
      const productsAll = await productAPI.getAllProducts(
        this.filters.category?.toString(),
        this.filters.brand?.toString(),
        this.pagination.page,
        this.pagination.limit,
        this.sortSettings.order,
        this.sortSettings.field
      );
      runInAction(() => {
        this.products = productsAll.rows;
        this.pagination.totalCount = productsAll.pagination.count;
        // сохр.данн.в LS
        this.saveToLocalStorage();
      });
    } catch (error) {
      console.error("Ошибка загрузки Всех Продуктов:", error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // загр.Одного Продукта
  @action async fetchProductById(id: number): Promise<void> {
    if (this.product?.id === id) return;
    this.isLoading = true;
    try {
      const productOne = await productAPI.getOneProduct(id);
      runInAction(() => {
        // сохр.в отдел.Продукт
        this.product = productOne;
        // иммутаб.обнов.в общем списке
        this.products = this.products.some((p) => p.id === id)
          ? this.products.map((p) => (p.id === id ? productOne : p))
          : [...this.products, productOne];
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
  @action async fetchProductProps(productId: number): Promise<void> {
    // возврат при наличии хеша
    if (this.propsCache.has(productId)) {
      this.updateProductPropsInState(productId);
      return;
    }
    this.isLoading = true;
    try {
      const props = await productAPI.getAllProperty(productId);
      runInAction(() => {
        // сохр.в хеш, обнов.связанные Свойства в общ.Продуктах и Продукте, сохр.в LS
        this.propsCache.set(productId, props);
        this.updateProductPropsInState(productId, props);
        this.saveToLocalStorage();
      });
    } catch (error) {
      console.error("Ошибка загрузки Свойств Продукта:", error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // обнов.Рейтинга Продукта
  @action async updateProductRating(
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
        // иммутаб.обнов.Рейтинг в общ.Продуктах и Продукте
        this.products = this.products.map((p) =>
          p.id === productId ? { ...p, rating: ratingData.rating } : p
        );
        if (this.product?.id === productId) {
          this.product = { ...this.product, rating: ratingData.rating };
        }
      });
      this.saveToLocalStorage();
      // return ratingData;
    } catch (error) {
      console.error("Ошибка обновления Рейтинга:", error);
      throw error;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  // ДОП.МТД.ПРОДУКТЫ/СВОЙСТВ ----------------------------------------------------------------------------------

  // проверка Продуктов в хран-ще
  getProductById(id: number): ProductData | null {
    return this.products.find((p) => p.id === id) || null;
  }

  // обнов. Св-ва Продукта
  private updateProductPropsInState(productId: number, props?: PropertyData[]) {
    const actualProps = props || this.propsCache.get(productId);
    if (!actualProps) return;
    // обнов. Свойства в общ./отдел. Продукте
    this.products = this.products.map((p) =>
      p.id === productId ? { ...p, props: [...actualProps] } : p
    );
    if (this.product?.id === productId)
      this.product = { ...this.product, props: [...actualProps] };
  }

  // СЕТТЕРЫ ----------------------------------------------------------------------------------

  // мтд.фильтра Категорий
  setCategory(category: string | null) {
    if (this.filters.category !== category) {
      this.filters.category = category;
      this.resetPagination();
      this.fetchAllProducts();
      this.updateUrlParams();
    }
  }

  // мтд.фильтра Брендов
  setBrand(brand: string | null) {
    if (this.filters.brand !== brand) {
      this.filters.brand = brand;
      this.resetPagination();
      this.fetchAllProducts();
      this.updateUrlParams();
    }
  }

  // мтд. Пагинации
  setPage(page: number) {
    if (this.pagination.page !== page) {
      this.pagination.page = page;
      this.fetchAllProducts();
      this.updateUrlParams();
    }
  }

  // мтд. измен.кол-во эл.на стр.
  setLimit(limit: number) {
    if (this.pagination.limit !== limit) {
      this.pagination.limit = limit;
      this.resetPagination();
      this.fetchAllProducts();
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
    this.fetchAllProducts();
    this.updateUrlParams();
  }

  // обнуления стр.при измен.фильтров
  resetPagination() {
    this.pagination.page = 1;
    this.pagination.totalCount = 0;
  }

  // мтд.> обнов.парам.в URL
  updateUrlParams(pathname?: string) {
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

// dddddddd;
// dddddddd;
// dddddddd;
// dddddddd;
// dddddddd;
// dddddddd;
// asdasd
// asdasd
// asdasd
// asdasd
// asdasd
// asdasd
// asdasd
// asdasd

export default CatalogStore;
