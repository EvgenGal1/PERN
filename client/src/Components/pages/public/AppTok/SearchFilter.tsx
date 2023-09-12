import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, createSearchParams } from "react-router-dom";
import { Col, Button } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { fetchAllProducts } from "../../../../http/Tok/catalogAPI_Tok";
import { SHOP_ROUTE, SHOP_CATALOG_ROUTE } from "../../../../utils/consts";

let defaultValue: any = { name: [], price: [], category: [], brand: [] };

const SearchFilter = (/* { show, setShow , children }: any */) => {
  const { catalog } = useContext(AppContext);

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

  // перенаправить по маршруту URL по параметру
  const handleClick = (/* id: number */) => {
    // при каждом клике добавляем в историю браузера новый элемент
    const params: any = {};

    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit !== (20 || 0 || 10000)) params.limit = catalog.limit;
    if (catalog.sortOrd !== ("ASC" || null)) params.sortOrd = catalog.sortOrd;
    if (catalog.sortField !== ("name" || null))
      params.sortField = catalog.sortField;

    // при наличии (category,brand) отправка на URL /catalog/list/ иначе главная
    if (catalog.brand || catalog.category) {
      navigate({
        pathname: SHOP_CATALOG_ROUTE,
        search: "?" + createSearchParams(params),
      });
    } else {
      navigate({
        pathname: SHOP_ROUTE,
        search: "?" + createSearchParams(params),
      });
    }
  };

  // ^ пробы логики URS параметров
  // const location = useLocation();
  // console.log("FILTER    location ", location);
  // console.log("FILTER    location.search ", location.search);
  // // if (name.toLowerCase().includes(location.search.toLowerCase())) {
  // // if (name.includes(location.search)) {
  // if (location.search.includes("brand")) {
  //   console.log("FILTER    IF ", 135);
  // }
  // if (location.search.includes("category")) {
  //   console.log("FILTER    IF ", 246);
  // }
  // var queryParams = new URLSearchParams(location.search);
  // console.log("queryParams ", queryParams);
  // for (const p of queryParams) {
  //   console.log(p);
  // }

  const [value, setValue] = useState(defaultValue);
  // console.log("FILTER    value 000 ", value);

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
    console.log("FILTER    usEf catalog ", catalog);
    if (value.category.length > 0) {
      console.log("FILTER    usEf value.category ", value.category);
      // fetchAllProducts(
      //   // value.category.join("&"),
      //   value.category,
      //   null,
      //   1,
      //   10000,
      //   "ASC",
      //   "name"
      // )
      //   .then((data: any) => {
      //     console.log("FILTER    usEf data ", data);
      //     // setProducts(data);
      //     catalog.products = data.rows;
      //     catalog.limit = Math.ceil(data.limit);
      //     // catalog.count = Math.ceil(data.count / data.limit);
      //     catalog.count = data.count;
      //   })
      //   .finally(
      //     () => console.log("FILTER    usEf 999 ", 999) /* setProducts(data) */
      //   );
    }
  });

  return (
    <div className="modal--eg__prost">
      <div
        // onClick={() => setShow(false)}
        // className={`overlay ${show ? "show" : ""}`}
        className={`overlay show `}
      ></div>
      {/* <div className={`modal--eg ${show ? "show" : ""}`}> */}
      <div className={`modal--eg show`}>
        <svg
          onClick={() => {
            changeShowValue();
            handleClick();
            // setShow(false);
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
        <div
          className="modal-choice-param choice-param__all"
          style={{ display: "flex" }}
        >
          {/* Колонка 1 */}
          <div className="choice-param__col" style={{ flex: "1" }}>
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
          <div className="choice-param__col" style={{ flex: "1" }}>
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
          <div className="choice-param__col" style={{ flex: "1" }}>
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
        {/* // ~ времянка */}
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
              // onClick={(e) => {
              // handlerDeleteBulkValue(e);
              // }}
            >
              Применить
            </Button>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
