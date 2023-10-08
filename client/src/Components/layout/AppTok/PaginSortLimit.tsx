import { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { Pagination } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";
import { SHOP_ROUTE, SHOP_CATALOG_ROUTE } from "../../../utils/consts";

export const PaginSortLimit = (props: any) => {
  const { catalog }: any = useContext(AppContext);
  const { setFetching, setChange }: any = props;
  const navigate = useNavigate();

  // созд.парам.поиска в строку URL
  const fnCreateSearchParams = () => {
    const params: any = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit !== (20 || 0)) params.limit = catalog.limit;
    if (catalog.sortOrd !== ("ASC" || null)) params.sortOrd = catalog.sortOrd;
    if (catalog.sortField !== ("name" || null))
      params.sortField = catalog.sortField;

    // при наличии (category,brand) отправка на URL /catalog/list иначе главная
    if (catalog.brand || catalog.category) {
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
    if (page !== catalog.page) {
      catalog.page = page;
      setFetching(true);
    }
    if (!props.admin) {
      fnCreateSearchParams();
    }
  };
  // содер.Комп.`Страница`
  const pages: any = [];
  for (let page = 1; page <= Math.ceil(catalog.count / catalog.limit); page++) {
    pages.push(
      <Pagination.Item
        key={page}
        active={page === catalog.page}
        activeLabel=""
        onClick={() => handlePageClick(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  // СОРТИРОВКА ПО ПОЛЮ. изменен.сост.параметра
  const changeSortField = (e: string) => {
    if (e === "name") catalog.sortField = e;
    if (e === "price") catalog.sortField = e;
    if (e === "rating") catalog.sortField = e;
    // ! не раб.сорт.с БД
    if (e === "votes") catalog.sortField = e;
    if (!props.admin) {
      fnCreateSearchParams();
    }
    setChange((state: any) => !state);
  };
  // СОРТИРОВКА ПО ПОРЯДКА. изменен.сост.порядка
  const changeSortOrder = () => {
    if (catalog.sortOrd === "ASC" || catalog.sortOrd === null)
      catalog.sortOrd = "DESC";
    else catalog.sortOrd = "ASC";
    if (!props.admin) {
      fnCreateSearchParams();
    }
    setChange((state: any) => !state);
  };

  // ЛИМИТ. изменен.сост.ограничения
  const changeLimitState = (limit: number) => {
    if (limit !== catalog.limit) {
      catalog.limit = limit;
    } else catalog.limit = 20;
    if (!props.admin) {
      fnCreateSearchParams();
    }
    setChange((state: any) => !state);
  };

  return (
    <div className="pagin-sort-limit">
      {/* ПАГИНАЦИЯ */}
      {catalog.count > catalog.limit && (
        <Pagination className="pagination--eg">{pages}</Pagination>
      )}
      {/* СОРТИРОВКА ПО ПОЛЮ */}
      <select
        className="select--eg" /* ef-bs */
        defaultValue={catalog.sortField}
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
        {catalog.sortOrd === "ASC" || catalog.sortOrd === null ? (
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
                catalog.limit === 10 ? " active" : ""
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
                catalog.limit === 25 ? " active" : ""
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
                catalog.limit === 50 ? " active" : ""
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
                catalog.limit === 100 ? " active" : ""
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
                catalog.limit === 500 ? " active" : ""
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
