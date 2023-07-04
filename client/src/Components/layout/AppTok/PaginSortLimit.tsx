import { useContext, useState } from "react";
import { Button, Pagination } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";

export const PaginSortLimit = (props: any) => {
  const { totalPages, pages, setChange } = props;
  const { catalog }: any = useContext(AppContext);

  // limit. кол-во эл. на странице
  // const [limiting, setLimiting] = useState(10);
  // ЛИМИТ. изменен.сост.ограничения
  const changeLimitState = (limit: number) => {
    // setLimiting(limit);
    catalog.limit = limit;
    setChange((state: any) => !state);
  };

  // сост.сортировки
  // const [sortOrd, setSortOrd] = useState("ASC");
  // СОРТИРОВКА. изменен.сост.порядка
  const changeSortState = () => {
    console.log("1 ", 1);
    if (/* sortOrd */ catalog.sortOrd === "ASC") {
      console.log("2 ", 2);
      // setSortOrd("DESC");
      catalog.sortOrd = "DESC";
      setChange((state: any) => !state);
    } else {
      console.log("3 ", 3);
      // setSortOrd("ASC");
      catalog.sortOrd = "ASC";
      setChange((state: any) => !state);
    }
  };
  console.log("PgSrtLim catalog.limit ", catalog.limit);
  console.log("PgSrtLim catalog.sortOrd ", catalog.sortOrd);
  return (
    <div
      className="pagin-sort-limit"
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "1rem 0 1rem",
      }}
    >
      {/* ПАГИНАЦИЯ */}
      {totalPages > 1 && (
        <Pagination style={{ margin: "0" }} className="pagination__eg">
          {pages}
        </Pagination>
      )}
      {/* СОРТИРОВКА */}
      <Button
        size="sm"
        onClick={() => changeSortState()}
        variant="primary"
        className="btn-primary__eg"
      >
        названиz {/* sortOrd */ catalog.sortOrd === "ASC" ? "А-Я ▲" : "Я-А ▼"}
      </Button>
      {/* LIMIT. КОЛ-ВО ЭЛ. НА СТР. */}
      <div style={{ display: "flex" }}>
        <Button
          size="sm"
          onClick={() => changeLimitState(10)}
          className={`btn-primary__eg${
            /* limiting */ catalog.limit === 10 ? " active" : ""
          }`}
          style={{ marginLeft: "15px" }}
        >
          10
        </Button>
        <Button
          size="sm"
          onClick={() => changeLimitState(25)}
          className={`btn-primary__eg${
            /* limiting */ catalog.limit === 25 ? " active" : ""
          }`}
          style={{ marginLeft: "15px" }}
        >
          25
        </Button>
        <Button
          size="sm"
          onClick={() => changeLimitState(50)}
          className={`btn-primary__eg${
            /* limiting */ catalog.limit === 50 ? " active" : ""
          }`}
          style={{ marginLeft: "15px" }}
        >
          50
        </Button>
        <Button
          size="sm"
          onClick={() => changeLimitState(100)}
          className={`btn-primary__eg${
            /* limiting */ catalog.limit === 100 ? " active" : ""
          }`}
          style={{ marginLeft: "15px" }}
        >
          100
        </Button>
      </div>
    </div>
  );
};
