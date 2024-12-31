import React, { useState, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useLocation, useSearchParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import { fetchAllProducts } from "../../../../http/Tok/catalogAPI_Tok";
import { AppContext } from "../../../layout/AppTok/AppContext";
import { PaginSortLimit } from "../../../layout/AppTok/PaginSortLimit";
import { getSearchParams } from "../../../../scripts/helpers/getSearchParams";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
  const { catalog }: any = useContext(AppContext);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  // признак загрузки данных. // ! врем.откл.
  const [productsFetching, setProductsFetching] = useState(true);

  // врем.заглушки для PaginSortLimit
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fetching, setFetching] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [change, setChange] = useState(false);

  useEffect(() => {
    console.log("ProdLs usEf 000 ", 0);
    const { category, brand, page, limit, sortOrd, sortField } =
      getSearchParams(searchParams);

    console.log("ProdLs usEf location ", location);

    catalog.category = category;
    catalog.brand = brand;
    catalog.page = page ?? 1;
    catalog.limit = limit ?? 0;
    catalog.sortOrd = sortOrd ?? "ASC";
    catalog.sortField = sortField ?? "name";

    const fetchData = async () => {
      try {
        const data = await fetchAllProducts(
          catalog.category,
          catalog.brand,
          catalog.page,
          catalog.limit,
          catalog.sortOrd,
          catalog.sortField
        );
        // ! ошб.е/и пропис.true выше - Недостаточно памятидля загрюстр.
        setProductsFetching(true);
        console.log("ProdLs usEf PRD data ", data);
        catalog.products = data.rows;
        catalog.limit = Math.ceil(data.limit);
        catalog.count = data.count;
      } catch (error) {
        console.error("Ошибка загрузки Продуктов:", error);
      } finally {
        setProductsFetching(false);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, [location.search]);

  return (
    <>
      {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
      {catalog.products.length ? (
        <PaginSortLimit setFetching={setFetching} setChange={setChange} />
      ) : (
        ""
      )}
      <div className="row-mlr--eg mb-3">
        {/* СПИСОК ПРОДУКТОВ */}
        {/* {searchInput.length > 0 ? (
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
        )} */}
        {/*  */}
        <>
          {productsFetching ? (
            <div style={{ textAlign: "center" }}>
              <Spinner animation="border" variant="danger" />
            </div>
          ) : (
            <>
              {catalog.products.length ? (
                catalog.products.map((item: any) => (
                  <ProductItem key={item.id} data={item} />
                ))
              ) : (
                <p className="m-3">По вашему запросу ничего не найдено</p>
              )}
            </>
          )}
        </>
      </div>
      {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
      {catalog.products.length ? (
        <PaginSortLimit setFetching={setFetching} setChange={setChange} />
      ) : (
        ""
      )}
    </>
  );
});

export default ProductList;
