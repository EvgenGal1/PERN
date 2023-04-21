// пакеты
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { observer } from "mobx-react-lite";
// логика/настр.
import { AppContext } from "../../../layout/AppTok/AppContext";
import {
  fetchCategories,
  fetchBrands,
  fetchAllProducts,
} from "../../../../http/Tok/catalogAPI_Tok";
// компоненты
import CategoryBar from "./CategoryBar";
import BrandBar from "./BrandBar";
import ProductList from "./ProductList";

const Shop = observer(() => {
  const { catalog }: any = useContext(AppContext);
  const [categoriesFetching, setCategoriesFetching] = useState(true);
  const [brandsFetching, setBrandsFetching] = useState(true);
  const [productsFetching, setProductsFetching] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) => (catalog.categories = data))
      .finally(() => setCategoriesFetching(false));

    fetchBrands()
      .then((data) => (catalog.brands = data))
      .finally(() => setBrandsFetching(false));

    fetchAllProducts(null, null, 1, catalog?.limit)
      .then((data) => {
        catalog.products = data.rows;
        catalog.count = data.count;
      })
      .finally(() => setProductsFetching(false));
  }, []);

  useEffect(() => {
    setProductsFetching(true);
    fetchAllProducts(
      catalog?.category,
      catalog?.brand,
      catalog?.page,
      catalog?.limit
    )
      .then((data) => {
        catalog.products = data.rows;
        catalog.count = data.count;
      })
      .finally(() => setProductsFetching(false));
  }, [/* catalog, */ catalog?.category, catalog?.brand, catalog?.page]);

  return (
    <Container>
      <Row className="mt-2">
        <Col md={3}>
          {categoriesFetching ? (
            <Spinner animation="border" />
          ) : (
            <CategoryBar />
          )}
        </Col>
        <Col md={9}>
          {/* <BrandBar />
          <ProductList /> */}
          <div>
            {brandsFetching ? <Spinner animation="border" /> : <BrandBar />}
          </div>
          <div>
            {productsFetching ? (
              <Spinner animation="border" />
            ) : (
              <ProductList />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;
