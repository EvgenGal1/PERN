import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, createSearchParams } from "react-router-dom";
import { Col, Button } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { fetchAllProducts } from "../../../../http/Tok/catalogAPI_Tok";
import {
  SHOP_ROUTE,
  SHOP_CATALOG_ROUTE,
  FILTER_ROUTE,
} from "../../../../utils/consts";

let defaultValueArr: any = { name: [], price: [], category: [], brand: [] };
let defaultValueName: any = { category: "", brand: "", name: "", price: "" };
let defaultItemId: any = { category: "", brand: "", name: "", price: "" };
let defaultIdCatalog: any = {
  category: true,
  brand: true,
  name: true,
  price: true,
};

const SearchFilter = (/* { show, setShow , children }: any */) => {
  const { catalog } = useContext(AppContext);
  console.log("FILTER    000 catalog ", catalog);
  console.log("FILTER    111 catalog.categories ", catalog.categories);
  console.log("FILTER    022 catalog.category ", catalog.category);
  console.log(
    "FILTER    333 catalog.categories[catalog.category] ",
    catalog.categories[catalog.category]
  );
  console.log(
    "FILTER    444 catalog.categories[Number - catalog.category] ",
    catalog.categories[Number(catalog.category)]
  );
  console.log("catalog.categories.id ", catalog.categories.id);
  console.log(
    "FILTER    555 catalog.categories.id = catalog.category ",
    (catalog.categories.id = catalog.category)
  );
  // console.log(
  //   "catalog.categories[Number(catalog.category)].name ",
  //   catalog.categories[Number(catalog.category)].name
  // );

  const navigate = useNavigate();

  // параметры поиска (Названия/Id)
  const [valueNameStat, setValueNameStat] = useState(defaultValueName);
  console.log("FILTER    000 valueNameStat ", valueNameStat);
  const [itemIdStat, setItemIdStat] = useState(defaultItemId);
  console.log("FILTER    000 itemIdStat ", itemIdStat);
  // признак перезаписи параметров Каталога из Магазина (запись в itemIdStat один раз)
  const [
    overwrittenСatalogParamsFromStore,
    setOverwrittenCatalogParamsFromStore,
  ] = useState(defaultIdCatalog);
  console.log(
    "FILTER    000 overwrittenСatalogParamsFromStore ",
    overwrittenСatalogParamsFromStore
  );
  // е/и в cataloge что-то есть (str|id параметры)
  if (catalog.category || catalog.brand) {
    // let catCategory,
    //   catBrand = "";
    // let catCategory = catalog.category;
    // let catBrand = catalog.brand;
    // console.log("catCategory | catBrand 000 ", catCategory, "|", catBrand);
    // category есть и не записанные
    if (catalog.category && overwrittenСatalogParamsFromStore.category) {
      // itemIdStat.category = catalog.category;
      // catCategory = catalog.category;
      // catalog.category = "";
      //
      // itemIdStat.category = catCategory;
      // catCategory = "";
      //
      //
      // запись str|id из парам.catalog Магазина в state itemIdStat один раз от повтор.перезаписи
      itemIdStat.category = catalog.category;
      setOverwrittenCatalogParamsFromStore(
        (overwrittenСatalogParamsFromStore.category = false)
      );
      // получ.Имя Categorии из Магазина по параметрам из Catalogа // ! не раб. получ по indexy (catalog.category) из масс.categories
      // const nameCategory = catalog.categories[Number(catalog.category)].name;
      // valueNameStat.category = nameCategory;
      //
      let splitCat = catalog.category.split("_");
      console.log("splitCat ", splitCat);

      let nameCategory = "";
      for (let nameSpl of splitCat) {
        console.log("nameSpl ", nameSpl);
        // eslint-disable-next-line no-loop-func
        catalog.categories.map((item: any) => {
          console.log("item ", item);
          // if (item.id === Number(catalog.category)) {
          if (item.id === Number(nameSpl)) {
            // if (item.id === Number(splitCat)) {
            console.log("12345 item.name ", 12345, item.name);
            console.log("nameCategory <<>> ", nameCategory);
            if (nameCategory === "") {
              console.log("1 ", 1);
              nameCategory = item.name;
            } else {
              console.log("2 ", 2);
              nameCategory = nameCategory + "_" + item.name;
            }
            console.log("nameCategory === ", nameCategory);
            valueNameStat.category = nameCategory;
          }
          return nameCategory;
          // Array.prototype.map () ожидает возврата от функции стрелки
        });
      }
      //

      for (var i = 0; i < splitCat.length; i++) {}

      // Function declared in a loop contains unsafe references to variable(s) 'nameCategory', 'nameCategory'
      // Функция, объявленная в цикле, содержит небезопасные ссылки на переменные (ы) «Namecategory», «NameCategory»
      // console.log("nameCategory ", nameCategory);
      // valueNameStat.category = nameCategory;
    }
    if (catalog.brand && overwrittenСatalogParamsFromStore.brand) {
      // itemIdStat.brand = catalog.brand;
      // catBrand = catalog.brand;
      // catalog.brand = "";
      //
      // itemIdStat.brand = catBrand;
      // catBrand = "";
      //
      itemIdStat.brand = catalog.brand;
      setOverwrittenCatalogParamsFromStore(
        (overwrittenСatalogParamsFromStore.brand = false)
      );
    }
  }
  // console.log("catCategory | catBrand === ", catCategory, "|", catBrand);

  // блок./разблок.прокрутки body при modal Расшир.Поиске
  let body = document.querySelector("body");
  if (body != null) {
    body.style.overflowY = "hidden";
  }
  const unlockBodyScroll = () => {
    if (body != null) {
      body.style.overflowY = "auto";
    }
  };

  // показ блока с Параметрами
  const ShowChoiceParam = (event: any) => {
    event.currentTarget.classList.toggle("choice-param-show");
  };

  // записать параметров поиска в состояние
  const recordSearchParamsInState = (
    event: any,
    // itemId: number,
    // itemName?: string,
    item: any
  ) => {
    // перем.state
    let dataValueName = {
      ...valueNameStat,
    };
    let dataItemId = {
      ...itemIdStat,
    };
    console.log("FLT 000 dataValueName ", dataValueName, typeof dataValueName);
    console.log("FLT 000 dataItemId ", dataItemId, typeof dataItemId);

    const itemId = item.id;
    const itemName = item.name;
    // console.log("FLT itemId itemName item ", itemId, itemName, item);
    // id: 2; name: "Сердца"

    const eventCheck = event.target.checked;
    const eventName = event.target.name;
    const eventValue = event.target.value;
    // console.log(
    //   "FLT check name value event ",
    //   eventCheck,
    //   eventName,
    //   eventValue,
    //   event
    // );
    // event.target.value - Сердца, Custom, Atlant, Горои и т.д.
    // event.target.name - brand, category и т.д.
    // event.target.checked

    let valueNameElem = dataValueName[eventName];
    let itemIdElem = dataItemId[eventName];
    console.log("FLT valueNameElem ", valueNameElem, "=");
    console.log("FLT itemIdElem ", itemIdElem, "=");
    // "", "Сердца_Горои", "Custom" || "", "2_5", "1"

    // if (eventCheck) {
    // console.log("check 000  ", eventCheck);
    // ^ написать fn по проверке/вставке/замене чего либо (str<>num<>obj) в чём либо (str<>arr<>obj). принимает 3+1 парам.(что, в чём, fn(ревёрс, удал, добав, наличие), ? разделитель)
    if (valueNameElem !== "")
      if (!valueNameElem.includes("_")) {
        console.log("FLT без _  ", 0);
        valueNameElem =
          eventValue === valueNameElem ? "" : valueNameElem + "_" + eventValue;
        itemIdElem =
          String(itemId) === String(itemIdElem)
            ? ""
            : itemIdElem + "_" + itemId;
      } else if (valueNameElem.includes(eventValue)) {
        console.log("FLT includes значение  ", 1);
        valueNameElem = valueNameElem.match(`(?<=_)${eventValue}`)
          ? valueNameElem.replace("_" + eventValue, "")
          : valueNameElem.replace(eventValue + "_", "");
        itemIdElem = itemIdElem.match(`(?<=_)${itemId}`)
          ? itemIdElem.replace("_" + itemId, "")
          : itemIdElem.replace(itemId + "_", "");
      } else {
        console.log("FLT есть _, нет Id ", 3);
        valueNameElem = valueNameElem + "_" + eventValue;
        itemIdElem = itemIdElem + "_" + itemId;
      }
    else {
      console.log("FLT пусто ", 101);
      valueNameElem = eventValue;
      itemIdElem = String(itemId);
    }
    // }
    console.log("FLT dataValueName[eventName] ", dataValueName[eventName]);
    console.log("FLT valueNameElem === ", valueNameElem);

    dataValueName[eventName] = valueNameElem;
    setValueNameStat(dataValueName);
    dataItemId[eventName] = itemIdElem;
    setItemIdStat(dataItemId);
  };

  // при клике "Применить" перенаправление в Магазин по параметрам поиска
  const onClickRedirectsOnSearchParametersToStore = () => {
    // `разблокировка прокрутки тела`
    unlockBodyScroll();
    // запись в перем.параметров из state
    const params: any = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    // ? не нужно ? т.к. это не прам.поиска, а выборка/отражение/сортировка
    // if (catalog.page > 1) params.page = catalog.page;
    // if (catalog.limit !== (20 || 0 || 10000)) params.limit = catalog.limit;
    // if (catalog.sortOrd !== ("ASC" || null)) params.sortOrd = catalog.sortOrd;
    // if (catalog.sortField !== ("name" || null)) params.sortField = catalog.sortField;

    // console.log("FILTER    catalog ", catalog);
    // console.log("FILTER    params ", params);

    // при наличии (category,brand) отправка на URL /catalog/list/ иначе главная
    if (catalog.brand || catalog.category) {
      navigate({
        pathname: FILTER_ROUTE,
        search: "?" + createSearchParams(params),
      });
    } else {
      navigate({
        pathname: FILTER_ROUTE,
        search: "?" + createSearchParams(params),
      });
    }
  };

  // сброс блок.body, states и возврат в Магазин
  const onClickResetToShop = () => {
    unlockBodyScroll();
    defaultValueName = { category: "", brand: "", name: "", price: "" };
    defaultItemId = { category: "", brand: "", name: "", price: "" };
    defaultIdCatalog = {
      category: true,
      brand: true,
      name: true,
      price: true,
    };
    setValueNameStat(defaultValueName);
    setItemIdStat(defaultItemId);
    setOverwrittenCatalogParamsFromStore(defaultIdCatalog);
    navigate({
      pathname: SHOP_ROUTE,
      // search: "?" + createSearchParams(params),
    });
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

  const [value, setValue] = useState(defaultValueArr);
  // console.log("FILTER    value 000 ", value);

  // fn измен.парам.поиска в state объект с массивами
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
        {/* кнп.Выход */}
        <svg
          onClick={() => {
            // unlockBodyScroll();
            onClickResetToShop();
          }}
          height="200"
          viewBox="0 0 200 200"
          width="200"
        >
          <title />
          <path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z" />
        </svg>
        {/* {children} */}
        {/* Блоки с Параметрами */}
        <div
          className="modal-choice-param choice-param__all"
          style={{ display: "flex" }}
        >
          {/* Колонка 1 */}
          <div className="choice-param__col" style={{ flex: "1" }}>
            {/* Категории */}
            <div className="choice-param__item">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                Категория
              </button>
              <div className="choice-param__prm">
                {catalog.categories.map((item: any) => (
                  <label key={item.id}>
                    <input
                      // onChange={(e) => handleInputChange(e, item.id)}
                      onChange={(e) => recordSearchParamsInState(e, item)}
                      type="checkbox"
                      name="category"
                      value={item.name}
                      // checked={selectedItems.has(item.key)}
                      checked={
                        // String(catalog.category).includes(String(item.id)) ||
                        // itemIdStat[item.name].includes(String(item.id))
                        //
                        // String(catalog.category).includes(String(item.id)) ||
                        //   ? true
                        //   : false
                        // haveCatalog["category"].includes(String(item.id)) ||
                        overwrittenСatalogParamsFromStore["category"] ||
                        itemIdStat["category"].includes(String(item.id))
                      }
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Бренды */}
            <div className="choice-param__item">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                Бренд
              </button>
              <div className="choice-param__prm">
                {catalog.brands.map((item: any) => (
                  <label key={item.id}>
                    <input
                      onClick={(e) => recordSearchParamsInState(e, item.id)}
                      type="checkbox"
                      name="brand"
                      value={item.name}
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Колонка 2 */}
          <div className="choice-param__col" style={{ flex: "1" }}>
            {/* Цены */}
            <div className="choice-param__item">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                Цена
              </button>
              <div className="choice-param__prm">СДЕЛАТЬ ВЫБОРКУ ЦЕН</div>
            </div>
            {/* Рейтинг */}
            <div className="choice-param__item">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                Рейтинг
              </button>
              <div className="choice-param__prm">СДЕЛАТЬ ВЫБОР РЕЙТИНГА</div>
            </div>
          </div>
          {/* Колонка 3 */}
          <div className="choice-param__col" style={{ flex: "1" }}>
            {/* ЕЩЁ_1 */}
            {/* <div className="choice-param__item">
              <button
                className="choice-param__btn"
                onClick={ShowChoiceParam}
              >
                ЕЩЁ_1
              </button>
              <div className="choice-param__prm">ДОБАВИТЬ_1</div>
            </div> */}
            <div className="choice-param" style={{ marginTop: "15px" }}>
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                Бренды
              </button>
              <div className="choice-param__item">
                {catalog.brands.map((item: any) => (
                  <label key={item.id}>
                    <input
                      // onClick={() => onClickRedirectToSearchParamsURL(item.id)}
                      onClick={(e) => recordSearchParamsInState(e, item.id)}
                      type="checkbox"
                      // name={`brand.${item.name}`}
                      name="brand"
                      value={item.name}
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* ЕЩЁ_2 */}
            <div className="choice-param__item">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                ЕЩЁ_2
              </button>
              <div className="choice-param__prm">ДОБАВИТЬ_2</div>
            </div>
            {/* ЕЩЁ_3 */}
            <div className="choice-param__item">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                ЕЩЁ_3
              </button>
              <div className="choice-param__prm">ДОБАВИТЬ_3</div>
            </div>
          </div>
        </div>
        {/* кнп.Применить */}
        <div>
          {/* // ~ времянка */}
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
