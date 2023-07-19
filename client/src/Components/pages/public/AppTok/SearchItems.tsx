import { useState, useEffect, useContext } from "react";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { fetchAllProducts } from "../../../../http/Tok/catalogAPI_Tok";

let defaultValue: any = { name: [], price: [], category: [], brand: [] };

const SearchItems = ({ show, setShow, children }: any) => {
  const { catalog }: any = useContext(AppContext);

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

  const [products, setProducts] = useState([]);
  // console.log("products 0 ", products);

  // нач.загрузка всего
  useEffect(() => {
    // if (products.length === 0) {
    fetchAllProducts(null, null, 1, 10000, "ASC", "name").then((data: any) => {
      console.log("MODAL data ", data);
      setProducts(data.rows);
    });
    // }
    // console.log("products 1 ", products);
  }, []);

  const [value, setValue] = useState(/* {} */ /* [] */ defaultValue);
  const handleInputChange = (event: any, id: number, item: any) => {
    if (event.target.checked) {
      let data = {
        ...value,
      };
      for (const key in data) {
        if (key === item) {
          const element2 = data[key].push(id);
        }
      }
      setValue(data);
    }
  };

  useEffect(() => {
    if (value.category.length > 0) {
      console.log("MODAL usEf AND 1 ", 1);
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
          console.log("MODAL AND data ", data);
          // setProducts(data);
          catalog.products = data.rows;
          catalog.limit = Math.ceil(data.limit);
          catalog.count = Math.ceil(data.count / data.limit);
        })
        .finally(() => console.log("999 ", 999) /* setProducts(data) */);
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
                  <label
                    key={item.id}
                    //onClick={() => handleClick(item.id)}
                    // onChange={(e) => handleInputChange(e, item.id, item)}
                  >
                    <input
                      // onChange={(e) => handleInputChange(e, item.id, item)}
                      onChange={(e) =>
                        handleInputChange(e, item.id, "category")
                      }
                      type="checkbox"
                      name={item.name}
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
      </div>
    </div>
  );
};

export default SearchItems;
