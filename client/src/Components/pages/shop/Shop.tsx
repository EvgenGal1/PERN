// пакеты
import React, { useContext, useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

// логика/настр.
import { AppContext } from "@/context/AppContext";

// компоненты
import BrandBar from "./BrandBar";
import CategoryBar from "./CategoryBar";
import Search from "@Comp/common/Search";
import ProductList from "./ProductList";
// пути/helpеры/fn(поиск знач.стр.в масс.)
import { FILTER_ROUTE } from "@/utils/consts";
import { findValueFromStringInArray } from "@/scripts/helpers/findValueFromStringInArray";

// ^ оборач.комп. в observer`наблюдатель` из mobx и отслеж.использ.знач. для renderа при измен.
const Shop: React.FC = observer(() => {
  const { catalog } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      // загр.данн.Каталога/Брендов при пустых масс.
      const promises: any = [];
      if (catalog.categories.length === 0)
        promises.push(catalog.loadCategories());
      if (catalog.brands.length === 0) promises.push(catalog.loadBrands());
      // попытка восстановить сессию
      const catalogStore = localStorage.getItem("catalogStore") ?? "";
      // Всегда загружаем Продукты, но с проверкой параметров
      if (!catalogStore) promises.push(catalog.loadAllProducts());
      await Promise.all(promises);
    };

    loadInitialData();
  }, [
    /* catalog */
    catalog.filters.category,
    catalog.filters.brand,
    catalog.pagination.page,
    catalog.pagination.limit,
    catalog.sortSettings.field,
    catalog.sortSettings.order,
  ]);

  // перенаправление на Filter с/без парам.поиска
  const redirectToFilter = () => {
    const params: Record<string, string> = {};
    if (catalog.filters.category) {
      const result = findValueFromStringInArray(
        catalog.filters.category,
        catalog.categories
      );
      if (result) params.category = result;
    }
    if (catalog.filters.brand) {
      const result = findValueFromStringInArray(
        catalog.filters.brand,
        catalog.brands
      );
      if (result) params.brand = result;
    }

    navigate({
      pathname:
        catalog.filters.brand || catalog.filters.category
          ? FILTER_ROUTE
          : FILTER_ROUTE,
      search: "?" + createSearchParams(params),
    });
  };

  return (
    <>
      <div className="search">
        <Search />
      </div>
      <div className="row-mlr--eg mt-3">
        <aside className="col-md-3">
          <div className="mt-0">
            <CategoryBar />
          </div>
          <div className="mt-3">
            <BrandBar />
          </div>
          {(catalog.filters.category || catalog.filters.brand) !== null && (
            <div className="mt-3">
              <button
                type="button"
                onClick={redirectToFilter}
                className="btn--eg btn-primary--eg w-100"
              >
                [параметры поиска]
              </button>
            </div>
          )}
        </aside>
        <div className="col-md-9">
          <ProductList />
        </div>
      </div>
    </>
  );
});

export default Shop;
