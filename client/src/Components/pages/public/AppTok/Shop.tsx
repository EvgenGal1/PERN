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
  let limit = searchParams.get("limit");
  if (limit && /[1-9][0-9]*/.test(limit)) {
    limit = parseInt(limit);
  }
  return { category, brand, page, limit };
};

// При начальной загрузке каталога мы проверяем наличие GET-параметров и если они есть — выполняем запрос на сервер с учетом выбранной категории, бренда и страницы.
// ^ observer `наблюдатель` - обётрка Комп.для слежен.за obser-значен., используемые Комп-ми и render при измен.
const Shop = observer(() => {
  const { catalog }: any = useContext(AppContext);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [categoriesFetching, setCategoriesFetching] = useState(true);
  const [brandsFetching, setBrandsFetching] = useState(true);
  const [productsFetching, setProductsFetching] = useState(true);

  useEffect(() => {
    console.log("usEf ", 1);
    fetchCategories()
      .then((data: any) => (catalog.categories = data))
      .finally(() => setCategoriesFetching(false));

    fetchBrands()
      .then((data: any) => (catalog.brands = data))
      .finally(() => setBrandsFetching(false));

    const { category, brand, page, limit } = getSearchParams(searchParams);
    catalog.category = category;
    catalog.brand = brand;
    catalog.page = page ?? 1;
    catalog.limit = limit ?? 15;

    fetchAllProducts(
      catalog.category,
      catalog.brand,
      catalog.page,
      catalog.limit
    )
      // fetchAllProducts(null, null, 1, catalog?.limit)
      .then((data: any) => {
        catalog.products = data.rows;
        catalog.count = data.count;
      })
      .finally(() => setProductsFetching(false));
    // eslint-disable-next-line
  }, []);

  // При каждом клике на категорию, бренд или номер страницы — мы добавляем элемент в историю браузера, ссылки в истории имеют вид /?page=1, /?page=2, /?page=3. При нажатии кнопки «Назад» браузера — мы отслеживаем изменение GET-параметров и изменяем состояние хранилища.
  useEffect(() => {
    console.log("usEf ", 2);
    const { category, brand, page, limit } = getSearchParams(searchParams);
    console.log("category, brand, page, limit ", category, brand, page, limit);

    if (category || brand || page || limit) {
      if (category !== catalog.category) catalog.category = category;
      if (brand !== catalog.brand) catalog.brand = brand;
      if (page !== catalog.page) catalog.page = page ?? 1;
      if (limit !== catalog.limit) catalog.limit = limit;
    } else {
      catalog.category = null;
      catalog.brand = null;
      catalog.page = 1;
      catalog.limit = 15;
    }
    // eslint-disable-next-line
  }, [location.search]);

  // при клике на категорию, бренд, номер страницы или при нажатии кнопки  «Назад» браузера — получам с сервера список товаров, потому что это уже другой список
  useEffect(() => {
    console.log("usEf ", 3);
    setProductsFetching(true);
    fetchAllProducts(
      catalog.category,
      catalog.brand,
      catalog.page,
      catalog.limit
    )
      .then((data) => {
        console.log("data ", data);
        catalog.products = data.rows;
        catalog.count = data.count;
      })
      .finally(() => setProductsFetching(false));
    // eslint-disable-next-line
  }, [catalog.category, catalog.brand, catalog.page, catalog.limit]);

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
