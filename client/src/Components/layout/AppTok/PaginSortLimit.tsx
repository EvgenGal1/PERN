import { useContext } from "react";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";
import { Button, Form, Pagination } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";

export const PaginSortLimit = (props: any) => {
  const { catalog }: any = useContext(AppContext);
  const { setFetching, setChange }: any = props;
  const navigate = useNavigate();
  const location = useLocation();

  // созд.парам.поиска в строку URL
  const fnCreateSearchParams = () => {
    console.log("fnSerch -- ", 0);
    const params: any = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit !== (20 || 0)) params.limit = catalog.limit;
    if (catalog.sortOrd !== ("ASC" || null)) params.sortOrd = catalog.sortOrd;
    if (catalog.sortField !== ("name" || null))
      params.sortField = catalog.sortField;

    // при наличии (category,brand) отправка на URL /catalog/list/ иначе главная
    if (catalog.brand || catalog.category) {
      navigate({
        pathname: "/catalog/list/",
        search: "?" + createSearchParams(params),
      });
    } else {
      navigate({
        pathname: "/",
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
  for (let page = 1; page <= catalog.count; page++) {
    // console.log("PaSoLi FOR catalog.count ===== ", catalog.count);
    // console.log("PaSoLi FOR catalog.limit ===== ", catalog.limit);
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
    console.log("SortField 1 ", 1);
    if (e === "name") catalog.sortField = e;
    if (e === "price") catalog.sortField = e;
    if (e === "rating") catalog.sortField = e;
    if (!props.admin) {
      fnCreateSearchParams();
    }
    setChange((state: any) => !state);
  };
  // СОРТИРОВКА ПО ПОРЯДКА. изменен.сост.порядка
  const changeSortOrder = () => {
    console.log("SortOrder 1 ", 1);
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
      {catalog.count > 1 && (
        <Pagination
          style={{ margin: "0", flexWrap: "wrap" }}
          className="pagination--eg"
        >
          {pages}
        </Pagination>
      )}
      {/* СОРТИРОВКА ПО ПОЛЮ */}
      <Form.Select
        size="sm"
        className="select--eg"
        defaultValue={catalog.sortField}
        onChange={(e) => changeSortField(e.target.value)}
      >
        <option value="name">Название</option>
        <option value="price">Цена</option>
        <option value="rating">Рейтинг</option>
      </Form.Select>
      {/* СОРТИРОВКА ПО ПОРЯДКУ */}
      <Button
        size="sm"
        onClick={() => changeSortOrder()}
        variant="primary"
        className="btn-primary--eg"
      >
        <span className="mini-1--eg">порядок</span>{" "}
        {catalog.sortOrd === "ASC" || catalog.sortOrd === null ? (
          <span>
            <span className="mini-2--eg">А-Я | 1-9</span> ▲
          </span>
        ) : (
          <span>
            <span className="mini-2--eg">Я-А | 9-1</span> ▼
          </span>
        )}
      </Button>
      {/* LIMIT. КОЛ-ВО ЭЛ. НА СТР. */}
      <div className="limit--eg" style={{ display: "flex" }}>
        <Button
          size="sm"
          onClick={() => changeLimitState(10)}
          className={`btn-primary--eg${catalog.limit === 10 ? " active" : ""}`}
        >
          10
        </Button>
        <Button
          size="sm"
          onClick={() => changeLimitState(25)}
          className={`btn-primary--eg${catalog.limit === 25 ? " active" : ""}`}
        >
          25
        </Button>
        <Button
          size="sm"
          onClick={() => changeLimitState(50)}
          className={`btn-primary--eg${catalog.limit === 50 ? " active" : ""}`}
        >
          50
        </Button>
        <Button
          size="sm"
          onClick={() => changeLimitState(100)}
          className={`btn-primary--eg${catalog.limit === 100 ? " active" : ""}`}
        >
          100
        </Button>
      </div>
    </div>
  );
};
