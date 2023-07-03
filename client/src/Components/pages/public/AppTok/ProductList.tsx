import { useContext, useEffect, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { Row, Pagination, Card, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
  const { catalog }: any = useContext(AppContext);
  console.log("catalog.count ", catalog.count);

  const navigate = useNavigate();

  const handleLimitClick = (limit: number) => {
    catalog.limit = limit;
    const params: any = {};
    // при каждом клике добавляем в историю браузера новый элемент
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit) params.limit = catalog.limit;
    navigate({
      pathname: "/",
      search: "?" + createSearchParams(params),
    });
  };

  // обраб.КЛИК по № СТР.
  const handlePageClick = (page: number) => {
    catalog.page = page;
    // при каждом клике добавляем в историю браузера новый элемент
    const params: any = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit) params.limit = catalog.limit;
    navigate({
      pathname: "/",
      search: "?" + createSearchParams(params),
    });
  };

  // содер.Комп.`Страница`
  const pages: any = [];
  for (let page = 1; page <= catalog.pages; page++) {
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

  // ФИЛЬТРАЦИЯ
  // inp.поиска // ~ асинхр.usSt не даёт нов.знач.
  const [searchInput, setSearchInput] = useState("");
  // результ.фильтра
  const [filteredResults, setFilteredResults] = useState([]);
  // `Поиск элементов`
  const searchItems = (searchValue: any) => {
    // ~ асинхр.usSt не даёт нов.знач.
    // setSearchInput(searchValue);
    // ~ стра.версия
    // const filteredData = catalog.products.filter((item: any) => {
    //   return Object.values(item).join("").toLowerCase().includes(searchInput.toLowerCase());
    // });
    // return name.toLowerCase().includes(searchInput.toLowerCase());
    // ~ нов.версия
    if (/* searchInput */ searchValue !== "") {
      const filteredData = catalog.products.filter(
        ({ name, price, rating }: any) => {
          if (
            name.toLowerCase().includes(searchValue.toLowerCase()) ||
            String(price).includes(searchValue) ||
            String(rating).includes(searchValue)
          ) {
            return name;
          }
        }
      );
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(catalog.products);
    }
  };

  return (
    <>
      <Row className="mb-3">
        <div className="search">
          {/* INP.ПОИСКА */}
          <input
            className="search__eg"
            placeholder="Поиск..."
            onChange={(e) => {
              searchItems(e.target.value);
              // ~ асинхр.usSt не даёт нов.знач. Запись напрямую
              setSearchInput(e.target.value);
            }}
          />
        </div>
        {/* СПИСОК ПРОДУКТОВ */}
        {searchInput.length > 0 ? (
          // ПО ПОИСКУ
          filteredResults.length !== 0 ? (
            filteredResults.map((item: any) => {
              return <ProductItem key={item.id} data={item} />;
            })
          ) : (
            <p className="m-3">По вашему запросу ничего не найдено</p>
          )
        ) : catalog.products.length ? (
          // ПО УМОЛЧАНИЮ
          catalog.products.map((item: any) => (
            <ProductItem key={item.id} data={item} />
          ))
        ) : (
          <p className="m-3">По вашему запросу ничего не найдено</p>
        )}
      </Row>
      {/* ПАГИНАЦИЯ */}
      {catalog.pages > 1 && (
        <Pagination className="pagination__eg">{pages}</Pagination>
      )}
      {/* LIMIT. КОЛ-ВО ЭЛ. НА СТР. */}
      <>
        {catalog.count > 10 && (
          <Button
            size="sm"
            onClick={() => /* changeLimit */ handleLimitClick(10)}
            className="btn-primary__eg"
            style={{ marginRight: "15px" }}
          >
            10
          </Button>
        )}
        {catalog.count > 25 && (
          <Button
            size="sm"
            onClick={() => /* changeLimit */ handleLimitClick(25)}
            className="btn-primary__eg"
            style={{ marginRight: "15px" }}
          >
            25
          </Button>
        )}
        {catalog.count > 50 && (
          <Button
            size="sm"
            onClick={() => /* changeLimit */ handleLimitClick(50)}
            className="btn-primary__eg"
            style={{ marginRight: "15px" }}
          >
            50
          </Button>
        )}
        {catalog.count > 100 && (
          <Button
            size="sm"
            onClick={() => /* changeLimit */ handleLimitClick(100)}
            className="btn-primary__eg"
            style={{ marginRight: "15px" }}
          >
            100
          </Button>
        )}
      </>
    </>
  );
});

export default ProductList;
