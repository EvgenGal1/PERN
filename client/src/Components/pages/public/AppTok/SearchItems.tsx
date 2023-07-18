import { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import { Form, Card, Col } from "react-bootstrap";

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

const defaultValue = { name: "", price: "", category: "", brand: "" };

const SearchItems = ({ show, setShow, children }: any) => {
  // ~ console.log("body ", body);
  // перем./логика/fn по блокировки прокрутки body
  let body = document.querySelector("body");
  if (body != null) {
    body.style.overflowY = "hidden";
  }
  const changeShowValue = () => {
    if (body != null) {
      body.style.overflowY = "auto";
    }
  };

  const { catalog }: any = useContext(AppContext);
  // ~ console.log("catalog ", catalog);

  const [products, setProducts] = useState([]);
  // ~ console.log("products 0 ", products);

  // нач.загрузка всего
  useEffect(() => {
    fetchAllProducts(null, null, 1, 10000, "ASC", "name").then((data: any) => {
      // ~ console.log("MODAL data ", data);
      setProducts(data.rows);
    });
  }, []);

  const handleClick = (id: number) => {
    if (id === catalog.category) {
      catalog.category = null;
    } else {
      catalog.category = id;
    }
    // при каждом клике добавляем в историю браузера новый элемент
    const params: any = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit) params.limit = catalog.limit;
    if (catalog.sortOrd) params.sortOrd = catalog.sortOrd;
    if (catalog.sortField) params.sortField = catalog.sortField;
    // navigate({
    //   pathname: "/",
    //   search: "?" + createSearchParams(params),
    // });
  };

  const [value, setValue] = useState(defaultValue);
  const handleInputChange = (event: any) => {
    const data = { ...value, [event.target.name]: event.target.value };
    // setValue(data);
    // setValid(isValid(data));
  };

  const handleClickChoiceParam = (event: any) => {
    event.currentTarget.classList.toggle("choice-param-show");
  };

  return (
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
      </div>
    </div>
  );
};

export default SearchItems;
