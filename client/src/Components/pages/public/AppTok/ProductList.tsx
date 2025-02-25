import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "@/context/AppContext";
import { PaginSortLimit } from "@Comp/common/PaginSortLimit";
import ProductItem from "./ProductItem";
import { ProductData } from "@/types/api/catalog.types";
import { useLocation, useSearchParams } from "react-router-dom";
import { productAPI } from "@/api/catalog/productAPI";
import { getSearchParams } from "../../../../scripts/helpers/getSearchParams";

const ProductList: React.FC /* <ProductListProps> */ = observer(() => {
  const { catalog } = useContext(AppContext);

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

    catalog.filters.category = category;
    catalog.filters.brand = brand;
    catalog.pagination.page = Number(page) ?? 1;
    catalog.pagination.limit = Number(limit) ?? 20;
    catalog.sortSettings.order = (sortOrd as "ASC" | "DESC") ?? "ASC";
    catalog.sortSettings.field =
      (sortField! as "name" | "price" | "rating" | "votes") ?? "name";

    const fetchData = async () => {
      setProductsFetching(true);
      try {
        const data = await productAPI.getAllProducts(
          // ! ошб.типа, логики и передачи
          catalog.filters.category!,
          catalog.filters.brand!,
          catalog.pagination.page,
          catalog.pagination.limit,
          catalog.sortSettings.order,
          catalog.sortSettings.field
        );
        // ! ошб.е/и пропис.true выше - Недостаточно памятидля загрюстр.
        // setProductsFetching(true);
        // console.log("ProdLs usEf PRD data ", data);
        catalog.products = data.rows;
        // catalog.limit = Math.ceil(data.limit);
        catalog.pagination.totalCount = data.count;
        // ?
        // catalog.setProducts(data.rows);
        // catalog.setLimit(Math.ceil(data.limit));
        // catalog.setCount(data.count);
      } catch (error) {
        console.error("Ошибка загрузки Продуктов:", error);
      } finally {
        setProductsFetching(false);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [location.search, catalog]);

  return (
    <>
      {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
      {catalog.products.length ? (
        <PaginSortLimit setFetching={setFetching} setChange={setChange} />
      ) : null}
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
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <>
              {catalog.products.length ? (
                catalog.products.map((item: ProductData) => (
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
      ) : null}
    </>
  );
});

export default ProductList;
