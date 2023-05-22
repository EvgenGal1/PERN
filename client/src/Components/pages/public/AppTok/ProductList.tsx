import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Pagination } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
  const context: any = useContext(AppContext);
  const navigate = useNavigate();

  const handleClick = (page: number) => {
    context.page = page; // при каждом клике добавляем в историю браузера новый элемент
    navigate("/", {
      state: {
        category: context.category,
        brand: context.brand,
        page: context.page,
      },
    });
  };

  const pages = [];
  for (let page = 1; page <= context.pages; page++) {
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
      {context.pages > 1 && <Pagination>{pages}</Pagination>}
    </>
  );
});

export default ProductList;
