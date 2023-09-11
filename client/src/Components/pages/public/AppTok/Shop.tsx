// пакеты
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
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
import Search from "./Search";
import ProductList from "./ProductList";

// `получить параметры поиска`
const getSearchParams = (searchParams: any) => {
  let category = searchParams.get("category");
  // ^ стар.логика (для 1го значения)
  // if (category && /[1-9][0-9]*/.test(category)) {
  // category = parseInt(category);
  // ^ нов.логика (для неск.значен.ч/з разделитель(_))
  if (category && /(_?[0-9]+)*/.test(category)) {
    category = "" + category;
  }
  let brand = searchParams.get("brand");
  // if (brand && /[1-9][0-9]*/.test(brand)) {
  //   brand = parseInt(brand);
  if (brand && /(_?[0-9]+)*/.test(brand)) {
    brand = "" + brand;
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
  // if (sortOrd && /[a-z][A-Z]*/.test(sortOrd)) {
  //   sortOrd = parseInt(sortOrd);
  // }
  let sortField = searchParams.get("sortField");
  // if (sortField && /[a-z][A-Z]*/.test(sortField)) {
  //   sortField = parseInt(sortField);
  // }
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
// ^ оборач.комп. в observer`наблюдатель` из mobx и отслеж.использ.знач. для renderа при измен.
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
    console.log("SHP usEf 000 ", "000");
    console.log("SHP usEf catalog.categories ", catalog.categories);
    console.log(catalog.categories);
    console.log("SHP usEf catalog.brands ", catalog.brands);
    console.log(catalog.brands);

    fetchCategories()
      .then((data: any) => (catalog.categories = data))
      .finally(() => setCategoriesFetching(false));

    fetchBrands()
      .then((data: any) => (catalog.brands = data))
      .finally(() => setBrandsFetching(false));

    console.log("SHP usEf 000 111 ", "000", 111);
    const { category, brand, page, limit, sortOrd, sortField } =
      getSearchParams(searchParams);

    console.log("SHP usEf 000 location ", location);

    catalog.category = category;
    catalog.brand = brand;
    catalog.page = page ?? 1;
    catalog.limit = limit ?? 0;
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
        console.log("SHP usEf 000 data ", data);
        catalog.products = data.rows;
        catalog.limit = Math.ceil(data.limit);
        // catalog.count = Math.ceil(data.count / data.limit);
        catalog.count = data.count;
      })
      .finally(() => setProductsFetching(false));
    // eslint-disable-next-line
  }, []);

  // При каждом клике на категорию, бренд или номер страницы — мы добавляем элемент в историю браузера, ссылки в истории имеют вид /?page=1, /?page=2, /?page=3. При нажатии кнопки «Назад» браузера — мы отслеживаем изменение GET-параметров и изменяем состояние хранилища.
  useEffect(() => {
    const { category, brand, page, limit, sortOrd, sortField } =
      getSearchParams(searchParams);
    console.log("SHP usEf 1 location ", location);
    console.log(
      "SHP usEf 1 location 000 pathname|search : ",
      location.pathname,
      "|",
      location.search
    );

    if (category || brand || page || limit) {
      // console.log("SHP usEf 1 IF  ", 11);
      if (category !== catalog.category) catalog.category = category;
      if (brand !== catalog.brand) catalog.brand = brand;
      if (page !== catalog.page) catalog.page = page ?? 1;
      if (limit !== catalog.limit) catalog.limit = limit ?? 20;
      if (sortOrd !== catalog.sortOrd) catalog.sortOrd = sortOrd ?? "ASC";
      if (sortField !== catalog.sortField)
        catalog.sortField = sortField ?? "name";
    } else {
      // console.log("SHP usEf 1 ELSE  ", 22);
      catalog.category = null;
      catalog.brand = null;
      catalog.page = 1;
      // eslint-disable-next-line no-self-assign
      catalog.sortOrd = catalog.sortOrd; //null; //"ASC";
      // eslint-disable-next-line no-self-assign
      catalog.sortField = catalog.sortField; // null; //"name";
    }

    console.log(
      "SHP usEf 1 location === pathname|search : ",
      location.pathname,
      "|",
      location.search
    );
    // eslint-disable-next-line
  }, [location.search]);

  // при клике на категорию, бренд, номер страницы или при нажатии кнопки  «Назад» браузера — получам с сервера список товаров, потому что это уже другой список
  useEffect(() => {
    // useLayoutEffect(() => {
    setProductsFetching(true);
    fetchAllProducts(
      catalog.category,
      catalog.brand,
      catalog.page,
      catalog.limit,
      catalog.sortOrd,
      catalog.sortField
    )
      .then((data) => {
        console.log("SHP usEf 2 data ", data);
        catalog.products = data.rows;
        // catalog.count = Math.ceil(data.count /  data.limit);
        catalog.count = data.count;
        catalog.limit = data.limit;
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
    catalog.page,
  ]);

  // // ФИЛЬТРАЦИЯ
  // // inp.поиска
  // const [searchInput, setSearchInput] = useState("");
  // // результ.фильтра
  // const [filteredResults, setFilteredResults] = useState([]);
  // // `Поиск элементов`
  // const searchItems = (searchValue: any) => {
  //   // ~ асинхр.usSt не даёт нов.знач.
  //   // setSearchInput(searchValue);
  //   // ~ стра.версия
  //   // const filteredData = catalog.products.filter((item: any) => {
  //   //   return Object.values(item).join("").toLowerCase().includes(searchInput.toLowerCase());
  //   // });
  //   // return name.toLowerCase().includes(searchInput.toLowerCase());
  //   // ~ нов.версия
  //   if (searchValue !== "") {
  //     const filteredData = catalog.products.filter(
  //       ({ name, price, rating }: any) => {
  //         if (
  //           name.toLowerCase().includes(searchValue.toLowerCase()) ||
  //           String(price).includes(searchValue) ||
  //           String(rating).includes(searchValue)
  //         ) {
  //           return name;
  //         }
  //       }
  //     );
  //     setFilteredResults(filteredData);
  //   } else {
  //     setFilteredResults(catalog.products);
  //   }
  // };

  return (
    <Container>
      <Row className="mt-2">
        <Col md={3} className="mb-3">
          {categoriesFetching ? (
            <Spinner animation="border" />
          ) : (
            <CategoryBar />
          )}
          {brandsFetching ? <Spinner animation="border" /> : <BrandBar />}
        </Col>
        <Col md={9}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* БРАНДЫ */}
            {/* {brandsFetching ? <Spinner animation="border" /> : <BrandBar />} */}
            {/* INP.ПОИСКА */}
            <Search />
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
