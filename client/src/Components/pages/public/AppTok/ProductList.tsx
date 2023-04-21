import { useContext } from "react";
import { Row, Pagination } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import ProductItem from "./ProductItem";

const ProductList = /* observer( */ () => {
  const { products }: any = useContext(AppContext);
  // ! ошб. Cannot read properties of undefined (reading 'pages')
  // const { catalog }: any = useContext(AppContext);

  // const handleClick = (page: number) => {
  //   catalog.page = page;
  // };

  // const pages = [];
  // for (let page = 1; page <= catalog.pages; page++) {
  //   pages.push(
  //     <Pagination.Item
  //       key={page}
  //       active={page === catalog.page}
  //       activeLabel=""
  //       onClick={() => handleClick(page)}
  //     >
  //       {page}
  //     </Pagination.Item>
  //   );
  // }

  return (
    <Row className="d-flex">
      {products.map((item: any) => (
        <ProductItem key={item.id} data={item} />
      ))}
      {/* {catalog.products.length ? (
        catalog.products.map((item: any) => (
          <ProductItem key={item.id} data={item} />
        ))
      ) : (
        <p className="m-3">По вашему запросу ничего не найдено</p>
      )} */}
    </Row>
  );
}; /* ) */

export default ProductList;
