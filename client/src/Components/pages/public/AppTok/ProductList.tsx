import { useContext } from "react";
import { Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import ProductItem from "./ProductItem";
import { PaginSortLimit } from "../../../layout/AppTok/PaginSortLimit";

const ProductList = observer((props?: any) => {
  const { catalog }: any = useContext(AppContext);
  const { setChange, setFetching }: any = props;

  return (
    <>
      <Row className="mb-3">
        {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
        <PaginSortLimit setFetching={setFetching} setChange={setChange} />
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
        {catalog.products.length ? (
          catalog.products.map((item: any) => (
            <ProductItem key={item.id} data={item} />
          ))
        ) : (
          <p className="m-3">По вашему запросу ничего не найдено</p>
        )}
      </Row>
      {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
      <PaginSortLimit setFetching={setFetching} setChange={setChange} />
    </>
  );
});

export default ProductList;
