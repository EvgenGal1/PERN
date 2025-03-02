import { useContext } from "react";

import { AppContext } from "@/context/AppContext";

export const PaginSortLimit = () => {
  const { catalog } = useContext(AppContext);

  // обраб.КЛИК по № СТР.
  const handlePageClick = (page: number) => {
    catalog.setPage(page);
  };

  // СОРТИРОВКА ПО ПОЛЮ. изменен.сост.параметра
  const changeSortField = (field: "name" | "price" | "rating" | "votes") => {
    catalog.setSortSettings(field, catalog.sortSettings.order);
  };

  // СОРТИРОВКА ПО ПОРЯДКА. изменен.сост.порядка
  const changeSortOrder = () => {
    catalog.setSortSettings(
      catalog.sortSettings.field,
      catalog.sortSettings.order === "ASC" ? "DESC" : "ASC"
    );
  };

  // ЛИМИТ. изменен.сост.ограничения
  const changeLimitState = (limit: number) => {
    catalog.setLimit(limit);
  };

  return (
    <div className="pagin-sort-limit">
      {/* ПАГИНАЦИЯ */}
      <div>
        {catalog.pagination.totalCount > catalog.pagination.limit && (
          <ul className="pagination--eg pagination">
            {Array.from({
              length: Math.ceil(
                catalog.pagination.totalCount / catalog.pagination.limit
              ),
            }).map((_, index) => {
              const isActive = index + 1 === catalog.pagination.page;
              return (
                <li
                  key={index}
                  className={`page-item ${isActive ? "active" : ""}`}
                  onClick={() => handlePageClick(index + 1)}
                >
                  <a href="#" className="page-link">
                    {index + 1}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* СОРТИРОВКА ПО ПОЛЮ */}
      <div className="sort-field-container df df-aic">
        <span className="mda">Сортировка по :</span>
        {/* огромные экраны */}
        <button
          onClick={() => changeSortField("name")}
          className="btn--eg btn-primary--eg"
        >
          Названию
        </button>
        <button
          onClick={() => changeSortField("price")}
          className="btn--eg btn-primary--eg"
        >
          Цене
        </button>
        <button
          onClick={() => changeSortField("rating")}
          className="btn--eg btn-primary--eg"
        >
          Рейтингу
        </button>
        {/* большие экраны */}
        <div className="text-mode select-wrapper">
          <select
            className="text-mode colsch-primary--eg"
            value={catalog.sortSettings.field}
            onChange={(e) =>
              changeSortField(
                e.target.value as "name" | "price" | "rating" | "votes"
              )
            }
          >
            <option value="name">Название</option>
            <option value="price">Цена</option>
            <option value="rating">Рейтинг</option>
            <option value="votes">Голоса</option>
          </select>
        </div>
        {/* маленьке экраны */}
        <div className="symbol-mode select-wrapper">
          <select
            className="symbol-mode colsch-primary--eg"
            value={catalog.sortSettings.field}
            onChange={(e) =>
              changeSortField(
                e.target.value as "name" | "price" | "rating" | "votes"
              )
            }
          >
            <option value="name">A-Z</option>
            <option value="price">$</option>
            <option value="rating">⭐</option>
            <option value="votes">👍</option>
          </select>
        </div>
      </div>

      {/* СОРТИРОВКА ПО ПОРЯДКУ */}
      <button
        onClick={changeSortOrder}
        type="button"
        className="btn--eg btn-primary--eg"
      >
        <span className="mini-1--eg">Порядок&ensp;</span>
        {catalog.sortSettings.order === "ASC" ? (
          <span>
            <span className="mini-2--eg">
              <span className="mini-3--eg">А-Я | </span>1-9{" "}
            </span>
            ▲
          </span>
        ) : (
          <span>
            <span className="mini-2--eg">
              <span className="mini-3--eg">Я-А | </span>9-1{" "}
            </span>
            ▼
          </span>
        )}
      </button>

      {/* LIMIT. КОЛ-ВО ЭЛ. НА СТР. */}
      {catalog.pagination.totalCount > 10 && (
        <div className="limit--eg">
          {[10, 25, 50, 100, 500, 1000].map(
            (limit) =>
              catalog.pagination.totalCount > limit && (
                <button
                  key={limit}
                  type="button"
                  onClick={() => changeLimitState(limit)}
                  className={`btn--eg btn-primary--eg${catalog.pagination.limit === limit ? " active" : ""}`}
                >
                  {limit}
                </button>
              )
          )}
        </div>
      )}
    </div>
  );
};
