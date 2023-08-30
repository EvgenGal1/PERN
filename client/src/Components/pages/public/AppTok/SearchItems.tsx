import { useState, useEffect, useContext } from "react";
import { Col, Button } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { fetchAllProducts } from "../../../../http/Tok/catalogAPI_Tok";
// компоненты
// import CategoryBar from "./CategoryBar";
// import BrandBar from "./BrandBar";

let defaultValue: any = { name: [], price: [], category: [], brand: [] };

const SearchItems = ({ show, setShow }: any) => {
  const { catalog } = useContext(AppContext);

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

  const [value, setValue] = useState(defaultValue);
  console.log("value 000 ", value);

  function handleInputChange(event: any, id: any) {
    // перем.state
    let data = {
      ...value,
    };
    // е/и парам.выбран, в мас.знач.под key из inputa, добавл.id парам.
    if (event.target.checked) data[event.target.name].push(id);
    // е/и парам. НЕ выбран, из мас.знач.под key из inputa, отфилтровываем id парам.
    else {
      data[event.target.name] = data[event.target.name].filter(
        (item: any) => item !== id
      );
    }
    // запись в state
    setValue(data);
  }

  useEffect(() => {
    if (value.category.length > 0) {
      fetchAllProducts(value.category, null, 1, 10000, "ASC", "name").then(
        (data: any) => {
          // console.log("MODAL AND data ", data);
          // setProducts(data);
          catalog.products = data.rows;
          catalog.limit = Math.ceil(data.limit);
          catalog.count = data.count;
        }
      );
    }
  });

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
