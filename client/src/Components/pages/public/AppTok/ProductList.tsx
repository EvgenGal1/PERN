import { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { Row, Pagination } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
  const context: any = useContext(AppContext);
  console.log("context ", context);
  const navigate = useNavigate();

  const handleClick = (page: number) => {
    console.log("prod.page hndlClk ", page);
    context.page = page;
    // при каждом клике добавляем в историю браузера новый элемент
    const params: any = {};
    if (context.category) params.category = context.category;
    if (context.brand) params.brand = context.brand;
    if (context.page > 1) params.page = context.page;
    navigate({
      pathname: "/",
      search: "?" + createSearchParams(params),
    });
  };

  const pages: any = [];
  console.log("prod.pages mass ", pages);
  for (let page = 1; page <= context.pages; page++) {
    console.log("prod.page for ", page);
    pages.push(
      <Pagination.Item
        key={page}
        active={page === context.page}
        activeLabel=""
        onClick={() => handleClick(page)}
      >
        {page}
      </Pagination.Item>
    );
  }
  console.log("prod.pages 3 ", pages);

  return (
    <>
      <Row className="d-flex mb-3">
        {context.products.length ? (
          context.products.map((item: any) => (
            <ProductItem key={item.id} data={item} />
          ))
        ) : (
          <p className="m-3">По вашему запросу ничего не найдено</p>
        )}
      </Row>
      стр.не отраж.
      {context.pages > 1 && (
        <Pagination className="pagination_eg">{pages}</Pagination>
      )}
      списать с AdminProducts
    </>
  );
});

export default ProductList;
