import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, createSearchParams } from "react-router-dom";
import { Form, Card, Col, Button } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";
// import { PRODUCT_ROUTE } from "../../../../utils/consts";
import {
  // updateProduct,
  // fetchProdRating,
  // createProdRating,
  // fetchCategories,
  // fetchBrands,
  fetchAllProducts,
} from "../../../../http/Tok/catalogAPI_Tok";
// компоненты
// import CategoryBar from "./CategoryBar";
// import BrandBar from "./BrandBar";

let defaultValue: any = { name: [], price: [], category: [], brand: [] };

const SearchItems = ({ show, setShow /* , children */ }: any) => {
  const { catalog } = useContext(AppContext);
  // console.log("catalog ", catalog);
  // console.log("catalog.category ", catalog.category);
  // console.log("catalog.categories ", catalog.categories);

  const navigate = useNavigate();

  // логика по блок.прокрутки body при modal Расшир.Поиске
  let body = document.querySelector("body");
  if (body != null) {
    body.style.overflowY = "hidden";
  }
  const changeShowValue = () => {
    if (body != null) {
      body.style.overflowY = "auto";
    }
  };

  // показ блока с Параметрами
  const handleClickChoiceParam = (event: any) => {
    event.currentTarget.classList.toggle("choice-param-show");
  };

  // console.log("ShrItms show ", show);
  // if (show) {
  //   navigate({
  //     pathname: "/search/filters",
  //     search: "?",
  //   });
  // } else {
  //   navigate({
  //     pathname: "/",
  //     search: "?",
  //   });
  // }

  // перенаправить по маршруту URL по параметру
  const handleClick = (id: number) => {
    // if (id === catalog.category) {
    //   catalog.category = null;
    // } else {
    //   catalog.category = id;
    // }
    // при каждом клике добавляем в историю браузера новый элемент
    // const params: any = {};
    // if (catalog.category) params.category = catalog.category;
    // if (catalog.brand) params.brand = catalog.brand;
    // if (catalog.page > 1) params.page = catalog.page;
    // if (catalog.limit !== (20 || 0)) params.limit = catalog.limit;
    // if (catalog.sortOrd !== ("ASC" || null)) params.sortOrd = catalog.sortOrd;
    // if (catalog.sortField !== ("name" || null))
    //   params.sortField = catalog.sortField;

    // при наличии (category,brand) отправка на URL /catalog/list/ иначе главная
    // if (catalog.brand || catalog.category) {
    //   navigate({
    //     pathname: "/catalog/list/",
    //     search: "?" + createSearchParams(params),
    //   });
    // } else {
    //   navigate({
    //     pathname: "/",
    //     search: "?" + createSearchParams(params),
    //   });
    // }

    // переправка на filter
    navigate({
      pathname: "/search/",
      search: "filters?", //+ createSearchParams(params),
    });
  };

  // ^ пробы логики URS параметров
  // const location = useLocation();
  // console.log("ShrItms location ", location);
  // console.log("ShrItms location.search ", location.search);
  // // if (name.toLowerCase().includes(location.search.toLowerCase())) {
  // // if (name.includes(location.search)) {
  // if (location.search.includes("brand")) {
  //   console.log("ShrItms IF ", 135);
  // }
  // if (location.search.includes("category")) {
  //   console.log("ShrItms IF ", 246);
  // }
  // var queryParams = new URLSearchParams(location.search);
  // console.log("queryParams ", queryParams);
  // for (const p of queryParams) {
  //   console.log(p);
  // }

  // const [products, setProducts] = useState([]);
  // // console.log("products 0 ", products);
  // // нач.загрузка всего
  // useEffect(() => {
  //   // if (products.length === 0) {
  //   fetchAllProducts(null, null, 1, 10000, "ASC", "name").then((data: any) => {
  //     console.log("MODAL data ", data);
  //     setProducts(data.rows);
  //   });
  //   // }
  //   // console.log("products 1 ", products);
  // }, []);

  // const filteredData = searchAll.filter(({ name, price, rating }: any) => {
  //   // const filteredData = catalog.products.filter(({ name, price, rating }: any) => {
  //   if (
  //     name.toLowerCase().includes(searchInput.toLowerCase()) ||
  //     String(price).includes(searchInput) ||
  //     String(rating).includes(searchInput)
  //   ) {
  //     return name;
  //   }
  // });
  // catalog.products = filteredData;

  //  ----------------------------------------------------------------------------------
  // const prob = ["rt", [1, 2], "erfs", [123, "asd"], ["as", "asd", 32]];
  // let prod2 = { cas: "as", asd: [1, 2, 3], erfs: ["asd", 12, 32] };
  // console.log("prod2 ", prod2);
  // console.log("prod2 ++ ", prod2.asd[2]);
  // console.log("prod2 ", prod2);
  //  ^ раб код масс в объ. ---------------------------------------------------------------------------
  // let data: any = {
  //   // name: "Ankit",
  //   // age: 24,
  //   // workingDay: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  //   cat: ["asd3", "das2", "asd1"],
  //   cat12: ["asd1"],
  // };
  // console.log("data 1 ", data);
  // for (const key in data) {
  //   console.log("111 ", 111);
  //   console.log("key ", key);
  //   let cat = "cat";
  //   // data[key]
  //   if (key === cat) {
  //     const element2: any = data[key].push(cat);
  //     console.log("element2 ", element2);
  //   }
  //   if (data.hasOwnProperty(key)) {
  //     const element: any = data[key];
  //     console.log(key + ": ", element);
  //     console.log("data[key] ", data[key]);
  //     // if (data[key] === cat) {
  //   }
  // }
  // console.log("data 2 ", data);
  //  ^ раб код масс в объ. ---------------------------------------------------------------------------
  //  ---------------------------------------------------------------------

  const [value, setValue] = useState(defaultValue);
  console.log("ShrItms value 000 ", value);

  // fn измен.парам.поиска в state
  function handleInputChange(event: any, id: any) {
    // перем.state
    let data = {
      ...value,
    };
    // е/и парам.выбран, в мас.знач.под name из inputa, добавл.id значен.
    if (event.target.checked) data[event.target.name].push(id);
    // е/и парам. НЕ выбран, из мас.знач.под name из inputa, отфилтровываем id значен.
    else {
      data[event.target.name] = data[event.target.name].filter(
        (item: any) => item !== id
      );
    }
    // запись в state
    setValue(data);
  }

  useEffect(() => {
    // console.log('value.category.join("&") ', value.category.join("&"));
    // let promez = value.category.join("&");
    // console.log("promez ", promez);
    // console.log("typeof promez ", promez.join("&"));
    // let result = promez.replace(",", "&");
    // console.log("result ", result);
    // console.log("0 ", 0);
    console.log("ShrItms usEf catalog ", catalog);
    if (value.category.length > 0) {
      console.log("ShrItms usEf value.category ", value.category);
      fetchAllProducts(
        // value.category.join("&"),
        value.category,
        null,
        1,
        10000,
        "ASC",
        "name"
      )
        .then((data: any) => {
          console.log("ShrItms usEf data ", data);
          // setProducts(data);
          catalog.products = data.rows;
          catalog.limit = Math.ceil(data.limit);
          // catalog.count = Math.ceil(data.count / data.limit);
          catalog.count = data.count;
        })
        .finally(
          () => console.log("ShrItms usEf 999 ", 999) /* setProducts(data) */
        );
    }
  });

  return (
    // <div className="--eg__prost">
    <div className="modal--eg__prost">
      <div
        // onClick={() => setShow(false)}
        className={`overlay ${show ? "show" : ""}`}
      ></div>
      <div className={`modal--eg ${show ? "show" : ""}`}>
        <svg
          onClick={() => {
            changeShowValue();
            setShow(false);
            // showValue = false;
          }}
          height="200"
          viewBox="0 0 200 200"
          width="200"
        >
          <title />
          <path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z" />
        </svg>
        {/* {children} */}
        {/* Блок с Параметрами */}
        <div className="modal-choice-param choice-param">
          {/* Колонка 1 */}
          <div className="choice-param__col">
            {/* Категории */}
            <div className="choice-param__item">
              <button
                className="choice-param__btn"
                onClick={handleClickChoiceParam}
              >
                Категория
              </button>
              <div className="choice-param__prm">
                {catalog.categories.map((item: any) => (
                  <label key={item.id}>
                    <input
                      onChange={(e) => handleInputChange(e, item.id)}
                      type="checkbox"
                      name="category"
                      id=""
                    />
                    <div>{item.name}</div>
                  </label>
                ))}
              </div>
            </div>
            {/* Бренды */}
            <div className="choice-param__item">
              <button
                className="choice-param__btn"
                onClick={handleClickChoiceParam}
              >
                Бренд
              </button>
              <div className="choice-param__prm">
                {catalog.brands.map((item: any) => (
                  <label
                    key={item.id}
                    //onClick={() => handleClick(item.id)}
                  >
                    <input type="checkbox" name={item.name} id="" />
                    <div>{item.name}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Колонка 2 */}
          <div className="choice-param__col">
            {/* Цены */}
            <div className="choice-param__item">
              <button
                className="choice-param__btn"
                onClick={handleClickChoiceParam}
              >
                Цена
              </button>
              <div className="choice-param__prm">СДЕЛАТЬ ВЫБОРКУ ЦЕН</div>
            </div>
            {/* Рейтинг */}
            <div className="choice-param__item">
              <button
                className="choice-param__btn"
                onClick={handleClickChoiceParam}
              >
                Рейтинг
              </button>
              <div className="choice-param__prm">СДЕЛАТЬ ВЫБОР РЕЙТИНГА</div>
            </div>
          </div>
          {/* Колонка 3 */}
          <div className="choice-param__col">
            {/* ЕЩЁ_1 */}
            <div className="choice-param__item">
              <button
                className="choice-param__btn"
                onClick={handleClickChoiceParam}
              >
                ЕЩЁ_1
              </button>
              <div className="choice-param__prm">ДОБАВИТЬ_1</div>
            </div>
            {/* ЕЩЁ_2 */}
            <div className="choice-param__item">
              <button
                className="choice-param__btn"
                onClick={handleClickChoiceParam}
              >
                ЕЩЁ_2
              </button>
              <div className="choice-param__prm">ДОБАВИТЬ_2</div>
            </div>
            {/* ЕЩЁ_3 */}
            <div className="choice-param__item">
              <button
                className="choice-param__btn"
                onClick={handleClickChoiceParam}
              >
                ЕЩЁ_3
              </button>
              <div className="choice-param__prm">ДОБАВИТЬ_3</div>
            </div>
          </div>
        </div>
        <div>
          <span style={{ marginBottom: "10px" }}>
            Отражать количество эл. Прописать отд.serv с возвратом просто суммы
            (подсчёт совпадений) и возврат данн.Товаров/Хар-ик. Для
            одного/нескольких/смешанных параметров
          </span>
          <Col>
            <Button
              // type="submit"
              size="sm"
              variant="danger"
              className="btn-danger--eg"
              style={{ width: "100%" }}
              onClick={(e) => {
                // handlerDeleteBulkValue(e);
              }}
            >
              Применить
            </Button>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default SearchItems;
