import { useContext, useEffect, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { Row, Pagination, Card } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
  const { catalog }: any = useContext(AppContext);

  const navigate = useNavigate();

  // ФИЛЬТРАЦИЯ
  // inp.поиска // ~ асинхр.usSt не даёт нов.знач.
  const [searchInput, setSearchInput] = useState("");
  // результ.фильтра
  const [filteredResults, setFilteredResults] = useState([]);

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

  // КЛИК по СТР.
  const handleClick = (page: number) => {
    catalog.page = page;
    // при каждом клике добавляем в историю браузера новый элемент
    const params: any = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    navigate({
      pathname: "/",
      search: "?" + createSearchParams(params),
    });
  };

  // СТРАНИЦЫ
  const pages: any = [];
  for (let page = 1; page <= catalog.pages; page++) {
    pages.push(
      <Pagination.Item
        key={page}
        active={page === catalog.page}
        activeLabel=""
        onClick={() => handleClick(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

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
      {catalog.pages > 1 && (
        <Pagination className="pagination__eg">{pages}</Pagination>
      )}
    </>
  );
});

export default ProductList;
