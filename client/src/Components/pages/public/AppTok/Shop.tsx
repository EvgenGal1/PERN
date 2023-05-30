// пакеты
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
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

// `получить параметры поиска`
const getSearchParams = (searchParams: any) => {
  let category = searchParams.get("category");
  if (category && /[1-9][0-9]*/.test(category)) {
    category = parseInt(category);
  }
  let brand = searchParams.get("brand");
  if (brand && /[1-9][0-9]*/.test(brand)) {
    brand = parseInt(brand);
  }
  let page = searchParams.get("page");
  if (page && /[1-9][0-9]*/.test(page)) {
    page = parseInt(page);
  }
  return { category, brand, page };
};

// При начальной загрузке каталога мы проверяем наличие GET-параметров и если они есть — выполняем запрос на сервер с учетом выбранной категории, бренда и страницы.
// ^ observer `наблюдатель` - обётрка Комп.для слежен.за obser-значен., используемые Комп-ми и render при измен.
const Shop = observer(() => {
  // const { catalog }: any = useContext(AppContext);
  const context: any = useContext(AppContext);

  const [categoriesFetching, setCategoriesFetching] = useState(true);
  const [brandsFetching, setBrandsFetching] = useState(true);
  const [productsFetching, setProductsFetching] = useState(true);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchCategories()
      .then((data: any) => (context.categories = data))
      .finally(() => setCategoriesFetching(false));

    fetchBrands()
      .then((data: any) => (context.brands = data))
      .finally(() => setBrandsFetching(false));

    const { category, brand, page } = getSearchParams(searchParams);
    context.category = category;
    context.brand = brand;
    context.page = page ?? 1;

    fetchAllProducts(
      context.category,
      context.brand,
      context.page,
      context.limit
    )
      // fetchAllProducts(null, null, 1, context?.limit)
      .then((data: any) => {
        context.products = data.rows;
        context.count = data.count;
      })
      .finally(() => setProductsFetching(false));
    // eslint-disable-next-line
  }, []);

  // При каждом клике на категорию, бренд или номер страницы — мы добавляем элемент в историю браузера, ссылки в истории имеют вид /?page=1, /?page=2, /?page=3. При нажатии кнопки «Назад» браузера — мы отслеживаем изменение GET-параметров и изменяем состояние хранилища.
  useEffect(() => {
    const { category, brand, page } = getSearchParams(searchParams);

    if (category || brand || page) {
      if (category !== context.category) context.category = category;
      if (brand !== context.brand) context.brand = brand;
      if (page !== context.page) context.page = page ?? 1;
    } else {
      context.category = null;
      context.brand = null;
      context.page = 1;
    }
    // eslint-disable-next-line
  }, [location.search]);

  useEffect(() => {
    setProductsFetching(true);
    fetchAllProducts(
      context.category,
      context.brand,
      context.page,
      context.limit
    )
      .then((data) => {
        context.products = data.rows;
        context.count = data.count;
      })
      .finally(() => setProductsFetching(false));
    // eslint-disable-next-line
  }, [context.category, context.brand, context.page]);

  return (
    <Container>
      <Row className="mt-2">
        <Col md={3} className="mb-3">
          {categoriesFetching ? (
            <Spinner animation="border" />
          ) : (
            <CategoryBar />
          )}
        </Col>
        <Col md={9}>
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
