import { useState, useContext, useEffect } from "react";
import { Button, Form, Pagination } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";

export const PaginSortLimit = (props?: any) => {
  const { setFetching, setChange }: any = props;
  const { catalog }: any = useContext(AppContext);

  // обраб.КЛИК по № СТР.
  const handlePageClick = (page: any) => {
    // setCurrentPage(page);
    catalog.currentPage = page;
    if (typeof setFetching) {
      setFetching(true);
    }
  };
  // содер.Комп.`Страница`
  const pages: any = [];
  for (let page = 1; page <= catalog.totalPages; page++) {
    pages.push(
      <Pagination.Item
        key={page}
        active={page === catalog.currentPage}
        activeLabel=""
        onClick={() => handlePageClick(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  // ЛИМИТ. изменен.сост.ограничения
  const changeLimitState = (limit: number) => {
    catalog.limit = limit;
    setChange((state: any) => !state);
  };

  // СОРТИРОВКА ПО ПОЛЮ. изменен.сост.параметра
  const changeSortField = (e: string) => {
    if (e === "name") catalog.sortField = e;
    if (e === "price") catalog.sortField = e;
    if (e === "rating") catalog.sortField = e;
    setChange((state: any) => !state);
  };
  // СОРТИРОВКА ПО ПОРЯДКА. изменен.сост.порядка
  const changeSortOrder = () => {
    if (catalog.sortOrd === "ASC") catalog.sortOrd = "DESC";
    else catalog.sortOrd = "ASC";
    setChange((state: any) => !state);
  };

  return (
    <div className="pagin-sort-limit">
      {/* ПАГИНАЦИЯ */}
      {catalog.totalPages > 1 && (
        <Pagination style={{ margin: "0" }} className="pagination__eg">
          {pages}
        </Pagination>
      )}
      {/* СОРТИРОВКА ПО ПОЛЮ */}
      <Form.Select
        size="sm"
        className="select__eg"
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
        className="btn-primary__eg"
      >
        <span className="mini-1__eg">порядок</span>{" "}
        {catalog.sortOrd === "ASC" ? (
          <span>
            <span className="mini-2__eg">А-Я | 1-9</span> ▲
          </span>
        ) : (
          <span>
            <span className="mini-2__eg">Я-А | 9-1</span> ▼
          </span>
        )}
      </Button>
      {/* LIMIT. КОЛ-ВО ЭЛ. НА СТР. */}
      <div className="limit__eg" style={{ display: "flex" }}>
        <Button
          size="sm"
          onClick={() => changeLimitState(10)}
          className={`btn-primary__eg${catalog.limit === 10 ? " active" : ""}`}
        >
          10
        </Button>
        <Button
          size="sm"
          onClick={() => changeLimitState(25)}
          className={`btn-primary__eg${catalog.limit === 25 ? " active" : ""}`}
        >
          25
        </Button>
        <Button
          size="sm"
          onClick={() => changeLimitState(50)}
          className={`btn-primary__eg${catalog.limit === 50 ? " active" : ""}`}
        >
          50
        </Button>
        <Button
          size="sm"
          onClick={() => changeLimitState(100)}
          className={`btn-primary__eg${catalog.limit === 100 ? " active" : ""}`}
        >
          100
        </Button>
      </div>
    </div>
  );
};
