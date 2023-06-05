import { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { Row, Pagination } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
  const { catalog }: any = useContext(AppContext);
  const navigate = useNavigate();

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
        {catalog.products.length ? (
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
