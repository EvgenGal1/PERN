// пакеты
import React, { useContext } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

// логика/настр.
import { AppContext } from "../../../layout/AppTok/AppContext";

// компоненты
import CategoryBar from "./CategoryBar";
import BrandBar from "./BrandBar";
import Search from "./Search";
import ProductList from "./ProductList";
// пути/helpеры/fn(поиск знач.стр.в масс.)
import { FILTER_ROUTE } from "../../../../utils/consts";
import { findValueFromStringInArray } from "../../../../scripts/helpers/findValueFromStringInArray";

// При начальной загрузке каталога мы проверяем наличие GET-параметров и если они есть — выполняем запрос на сервер с учетом выбранной категории, бренда и страницы.
// ^ оборач.комп. в observer`наблюдатель` из mobx и отслеж.использ.знач. для renderа при измен.
const Shop = observer(() => {
  const { catalog }: any = useContext(AppContext);
  const navigate = useNavigate();

  // перенаправление на Filter с/без парам.поиска
  const redirectToFilter = () => {
    const params: any = {};
    if (catalog.category) {
      const result = findValueFromStringInArray(
        catalog.category,
        catalog.categories
      );
      params.category = result;
    }
    if (catalog.brand) {
      const result = findValueFromStringInArray(catalog.brand, catalog.brands);
      params.brand = result;
    }

    if (catalog.brand || catalog.category) {
      navigate({
        pathname: FILTER_ROUTE,
        search: "?" + createSearchParams(params),
      });
    } else {
      navigate({
        pathname: FILTER_ROUTE,
      });
    }
  };

  return (
    <div className="container">
      <div className="search">
        <Search />
      </div>
      <div className="row-mlr--eg mt-3">
        <div className="col-md-3">
          <div className="mt-0">
            <CategoryBar />
          </div>
          <div className="mt-3">
            <BrandBar />
          </div>
          {(catalog.category || catalog.brand) !== null && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => redirectToFilter()}
                className="btn--eg btn-primary--eg w-100"
              >
                [расширенный поиск]
              </button>
            </div>
          )}
        </div>
        <div className="col-md-9">
          <ProductList />
        </div>
      </div>
    </div>
  );
});

export default Shop;
