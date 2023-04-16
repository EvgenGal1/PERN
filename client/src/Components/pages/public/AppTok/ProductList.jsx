import { useContext } from "react";
import { Row } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";
import ProductItem from "./ProductItem";

const ProductList = () => {
  const { products } = useContext(AppContext);

  return (
    <Row className="d-flex">
      {products.map((item) => (
        <ProductItem key={item.id} data={item} />
      ))}
    </Row>
  );
};

export default ProductList;
