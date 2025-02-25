import React, { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { Pagination } from "react-bootstrap";

import { AppContext } from "../../../context/AppContext";
import { SHOP_ROUTE, SHOP_CATALOG_ROUTE } from "../../../utils/consts";

export const PaginSortLimit = (props: any) => {
  const { catalog }: any = useContext(AppContext);
  const navigate = useNavigate();
  const { setFetching, setChange }: any = props;

  // созд.парам.поиска в строку URL
  const fnCreateSearchParams = () => {
    const params: any = {};
    if (catalog.filters.category) params.category = catalog.filters.category;
    if (catalog.filters.brand) params.brand = catalog.filters.brand;
    if (catalog.pagination.page > 1) params.page = catalog.pagination.page;
    if (catalog.pagination.limit !== 20 || catalog.pagination.limit !== 0)
      params.limit = catalog.pagination.limit;
    if (
      catalog.sortSettings.order !== "ASC" ||
      catalog.sortSettings.order !== null
    )
      params.order = catalog.sortSettings.order;
    if (
      catalog.sortSettings.field !== "name" ||
      catalog.sortSettings.field !== null
    )
      params.field = catalog.sortSettings.field;

    // при наличии (category,brand) отправка на URL /catalog/list иначе главная
    if (catalog.filters.brand || catalog.filters.category) {
      navigate({
        pathname: SHOP_CATALOG_ROUTE,
        search: "?" + createSearchParams(params),
      });
    } else {
      navigate({
        pathname: SHOP_ROUTE,
        search: "?" + createSearchParams(params),
      });
    }
  };

  // обраб.КЛИК по № СТР.
  const handlePageClick = (page: number) => {
    if (page !== catalog.pagination.page) {
      catalog.pagination.page = page;
      setFetching(true);
    }
    if (!props.admin) {
      fnCreateSearchParams();
    }
  };
  // содер.Комп.`Страница`
  const pages: any = [];
  for (
    let page = 1;
    page <= Math.ceil(catalog.count / catalog.pagination.limit);
    page++
  ) {
    pages.push(
      <Pagination.Item
        key={page}
        active={page === catalog.pagination.page}
        activeLabel=""
        onClick={() => handlePageClick(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  // СОРТИРОВКА ПО ПОЛЮ. изменен.сост.параметра
  const changeSortField = (e: string) => {
    if (e === "name") catalog.sortSettings.field = e;
    if (e === "price") catalog.sortSettings.field = e;
    if (e === "rating") catalog.sortSettings.field = e;
    // ! не раб.сорт.с БД
    if (e === "votes") catalog.sortSettings.field = e;
    if (!props.admin) {
      fnCreateSearchParams();
    }
    setChange((state: any) => !state);
  };
  // СОРТИРОВКА ПО ПОРЯДКА. изменен.сост.порядка
  const changeSortOrder = () => {
    if (
      catalog.sortSettings.order === "ASC" ||
      catalog.sortSettings.order === null
    )
      catalog.sortSettings.order = "DESC";
    else catalog.sortSettings.order = "ASC";
    if (!props.admin) {
      fnCreateSearchParams();
    }
    setChange((state: any) => !state);
  };

  // ЛИМИТ. изменен.сост.ограничения
  const changeLimitState = (limit: number) => {
    if (limit !== catalog.pagination.limit) {
      catalog.pagination.limit = limit;
    } else catalog.pagination.limit = 20;
    if (!props.admin) {
      fnCreateSearchParams();
    }
    setChange((state: any) => !state);
  };

  return (
    <div className="pagin-sort-limit">
      {/* ПАГИНАЦИЯ */}
      {catalog.count}
      {catalog.count > catalog.pagination.limit && (
        <Pagination className="pagination--eg">{pages}</Pagination>
      )}
      {/* СОРТИРОВКА ПО ПОЛЮ */}
      <select
        className="select--eg" /* ef-bs */
        defaultValue={catalog.sortSettings.field}
        onChange={(e) => changeSortField(e.target.value)}
      >
        <option value="name">Название</option>
        <option value="price">Цена</option>
        <option value="rating">Рейтинг</option>
        {/* // ! не раб.сорт.с БД */}
        <option value="votes">Голоса</option>
      </select>

      {/* СОРТИРОВКА ПО ПОРЯДКУ */}
      <button
        onClick={() => changeSortOrder()}
        type="button"
        className="btn--eg btn-primary--eg"
      >
        <span className="mini-1--eg">
          порядок
          {/* Узкий пробел */}
          &ensp;
        </span>
        {catalog.sortSettings.order === "ASC" ||
        catalog.sortSettings.order === null ? (
          <span>
            <span className="mini-2--eg">А-Я | 1-9 </span>▲
          </span>
        ) : (
          <span>
            <span className="mini-2--eg">Я-А | 9-1 </span>▼
          </span>
        )}
      </button>
      {/* LIMIT. КОЛ-ВО ЭЛ. НА СТР. */}
      {catalog.count > 10 ? (
        <div className="limit--eg" style={{ display: "flex" }}>
          {catalog.count > 10 ? (
            <button
              type="button"
              onClick={() => changeLimitState(10)}
              className={`btn--eg btn-primary--eg${
                catalog.pagination.limit === 10 ? " active" : ""
              }`}
            >
              10
            </button>
          ) : (
            ""
          )}
          {catalog.count > 10 ? (
            <button
              type="button"
              onClick={() => changeLimitState(25)}
              className={`btn--eg btn-primary--eg${
                catalog.pagination.limit === 25 ? " active" : ""
              }`}
            >
              25
            </button>
          ) : (
            ""
          )}
          {catalog.count > 25 ? (
            <button
              type="button"
              onClick={() => changeLimitState(50)}
              className={`btn--eg btn-primary--eg${
                catalog.pagination.limit === 50 ? " active" : ""
              }`}
            >
              50
            </button>
          ) : (
            ""
          )}
          {catalog.count > 50 ? (
            <button
              type="button"
              onClick={() => changeLimitState(100)}
              className={`btn--eg btn-primary--eg${
                catalog.pagination.limit === 100 ? " active" : ""
              }`}
            >
              100
            </button>
          ) : (
            ""
          )}
          {catalog.count > 100 ? (
            <button
              type="button"
              onClick={() => changeLimitState(500)}
              className={`btn--eg btn-primary--eg${
                catalog.pagination.limit === 500 ? " active" : ""
              }`}
            >
              500
            </button>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
