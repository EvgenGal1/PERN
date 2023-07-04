import { Button, Pagination } from "react-bootstrap";

export const PaginSortLimit = ({
  totalPages,
  pages,
  sortOrd,
  mutateSort,
  handleLimitClick,
  limiting,
}: any) => {
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
        onClick={() => mutateSort()}
        variant="primary"
        className="btn-primary__eg"
      >
        по названию {sortOrd === "ASC" ? "▲" : "▼"}
      </Button>
      {/* LIMIT. КОЛ-ВО ЭЛ. НА СТР. */}
      <div style={{ display: "flex" }}>
        <Button
          size="sm"
          onClick={() => handleLimitClick(10)}
          className={`btn-primary__eg${limiting === 10 ? " active" : ""}`}
          style={{ marginLeft: "15px" }}
        >
          10
        </Button>
        <Button
          size="sm"
          onClick={() => handleLimitClick(25)}
          className={`btn-primary__eg${limiting === 25 ? " active" : ""}`}
          style={{ marginLeft: "15px" }}
        >
          25
        </Button>
        <Button
          size="sm"
          onClick={() => handleLimitClick(50)}
          className={`btn-primary__eg${limiting === 50 ? " active" : ""}`}
          style={{ marginLeft: "15px" }}
        >
          50
        </Button>
        <Button
          size="sm"
          onClick={() => handleLimitClick(100)}
          className={`btn-primary__eg${limiting === 100 ? " active" : ""}`}
          style={{ marginLeft: "15px" }}
        >
          100
        </Button>
      </div>
    </div>
  );
};
