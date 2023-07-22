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

let defaultValue: any = { name: [], price: [], category: [], brand: [] };

const SearchItems = ({ show, setShow, children }: any) => {
  const { catalog }: any = useContext(AppContext);
  // console.log("catalog ", catalog);
  // console.log("catalog.category ", catalog.category);
  // console.log("catalog.categories ", catalog.categories);

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
  // const [value, setValue] = useState<string[]>([] /* defaultValue */);
  const [value, setValue] = useState(/* {} */ /* [] */ defaultValue);
  console.log("value ", value);
  const handleInputChange = (event: any, id: number, item: any) => {
    console.log("id ", id);
    console.log("event ", event);
    console.log("item ", item);
    console.log("event.target.checked ", event.target.checked);
    // console.log("event.target.name ", event.target.name);
    // console.log("event.target.value ", event.target.value);
    if (event.target.checked) {
      // let data: any[] = [];
      let data = {
        // const data = [
        ...value,
        // [event.target.name]: /* event.target.value */ id,
        // [item], /* event.target.value */ [].push(id),
        // item, [id],
        // item[id],
        // [item].push(id),
        // ];
      };
      for (const key in data) {
        // console.log("key ", key);
        // let cat = "cat";
        // data[key]
        // console.log('data[key] ', data[key]);
        if (key === item) {
          // data[key]
          const element2 = data[key].push(id);
          console.log("element2 ", element2);
        }
      }
      // data.{item}
      // data: item;
      setValue(data);
    }
    // setValid(isValid(data));
  };

  // console.log("value.category ", value.category);
  // console.log("typeof value.category ", typeof value.category);
  useEffect(() => {
    // console.log('value.category.join("&") ', value.category.join("&"));
    // let promez = value.category.join("&");
    // console.log("promez ", promez);
    // console.log("typeof promez ", promez.join("&"));
    // let result = promez.replace(",", "&");
    // console.log("result ", result);
    // console.log("0 ", 0);
    if (value.category.length > 0) {
      console.log("MODAL usEf AND 1 ", 1);
      console.log("value.category ", value.category);
      console.log("typeof value.category ", typeof value.category);
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
