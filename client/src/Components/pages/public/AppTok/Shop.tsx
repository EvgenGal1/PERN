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
  let sortOrd = searchParams.get("sortOrd");
  if (sortOrd && /[a-z][A-Z]*/.test(sortOrd)) {
    sortOrd = parseInt(sortOrd);
  }
  let sortField = searchParams.get("sortField");
  if (sortField && /[a-z][A-Z]*/.test(sortField)) {
    sortField = parseInt(sortField);
  }
  return {
    category,
    brand,
    page,
    limit,
    sortOrd,
    sortField,
  };
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

  // обнов.списка/сост.после добав., редактир., удал.
  const [change, setChange] = useState(false);

  // первая загрузка?
  useEffect(() => {
    fetchCategories()
      .then((data: any) => (catalog.categories = data))
      .finally(() => setCategoriesFetching(false));

    fetchBrands()
      .then((data: any) => (catalog.brands = data))
      .finally(() => setBrandsFetching(false));

    const { category, brand, page, limit, sortOrd, sortField } =
      getSearchParams(searchParams);
    catalog.category = category;
    catalog.brand = brand;
    catalog.page = page ?? 1;
    catalog.limit = limit ?? 15;
    catalog.sortOrd = sortOrd ?? "ASC";
    catalog.sortField = sortField ?? "name";

    fetchAllProducts(
      catalog.category,
      catalog.brand,
      catalog.page,
      catalog.limit,
      catalog.sortOrd,
      catalog.sortField
    )
      .then((data: any) => {
        catalog.products = data.rows;
        catalog.count = data.count;
        catalog.totalPages = Math.ceil(data.count / catalog.limit);
      })
      .finally(() => setProductsFetching(false));
    // eslint-disable-next-line
  }, []);

  // При каждом клике на категорию, бренд или номер страницы — мы добавляем элемент в историю браузера, ссылки в истории имеют вид /?page=1, /?page=2, /?page=3. При нажатии кнопки «Назад» браузера — мы отслеживаем изменение GET-параметров и изменяем состояние хранилища.
  useEffect(() => {
    const { category, brand, page, limit, sortOrd, sortField } =
      getSearchParams(searchParams);

    if (category || brand || page || limit) {
      if (category !== catalog.category) catalog.category = category;
      if (brand !== catalog.brand) catalog.brand = brand;
      if (page !== catalog.page) catalog.page = page ?? 1;
      if (limit !== catalog.limit) catalog.limit = limit;
      if (sortOrd !== catalog.sortOrd) catalog.sortOrd = sortOrd;
      if (sortField !== catalog.sortField) catalog.sortField = sortField;
    } else {
      catalog.category = null;
      catalog.brand = null;
      catalog.page = 1;
      catalog.limit = 15;
      catalog.sortOrd = "ASC";
      catalog.sortField = "name";
    }
    // eslint-disable-next-line
  }, [location.search]);

  // при клике на категорию, бренд, номер страницы или при нажатии кнопки  «Назад» браузера — получам с сервера список товаров, потому что это уже другой список
  useEffect(() => {
    setProductsFetching(true);
    fetchAllProducts(
      catalog.category,
      catalog.brand,
      catalog.currentPage,
      catalog.limit,
      catalog.sortOrd,
      catalog.sortField
    )
      .then((data) => {
        catalog.products = data.rows;
        catalog.count = data.count;
        catalog.totalPages = Math.ceil(data.count / catalog.limit);
      })
      .finally(() => setProductsFetching(false));
    // eslint-disable-next-line
  }, [
    change,
    catalog,
    catalog.category,
    catalog.brand,
    catalog.page,
    catalog.limit,
    catalog.sortOrd,
    catalog.sortField,
    catalog.currentPage,
  ]);

  // ФИЛЬТРАЦИЯ
  // inp.поиска
  const [searchInput, setSearchInput] = useState("");
  // результ.фильтра
  const [filteredResults, setFilteredResults] = useState([]);
  // `Поиск элементов`
  const searchItems = (searchValue: any) => {
    // ~ асинхр.usSt не даёт нов.знач.
    // setSearchInput(searchValue);
    // ~ стра.версия
    // const filteredData = catalog.products.filter((item: any) => {
    //   return Object.values(item).join("").toLowerCase().includes(searchInput.toLowerCase());
    // });
    // return name.toLowerCase().includes(searchInput.toLowerCase());
    // ~ нов.версия
    if (/* searchInput */ searchValue !== "") {
      const filteredData = catalog.products.filter(
        ({ name, price, rating }: any) => {
          if (
            name.toLowerCase().includes(searchValue.toLowerCase()) ||
            String(price).includes(searchValue) ||
            String(rating).includes(searchValue)
          ) {
            return name;
          }
        }
      );
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(catalog.products);
    }
  };

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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* БРАНДЫ */}
            {brandsFetching ? <Spinner animation="border" /> : <BrandBar />}
            {/* INP.ПОИСКА */}
            <div className="search">
              <input
                className="search__eg"
                placeholder="Поиск..."
                onChange={(e) => {
                  searchItems(e.target.value);
                  // ~ асинхр.usSt не даёт нов.знач. Запись напрямую
                  setSearchInput(e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            {productsFetching ? (
              <Spinner animation="border" />
            ) : (
              <ProductList
                setChange={setChange}
                setFetching={setProductsFetching}
              />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;
