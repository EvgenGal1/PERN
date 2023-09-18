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

let defaultValueName: any = { category: "", brand: "", name: "", price: "" };
let defaultItemId: any = { category: "", brand: "", name: "", price: "" };
let defaultIdCatalog: any = {
  category: true,
  brand: true,
  name: true,
  price: true,
};

// ^ написать fn (в helperы) по проверке/вставке/замене чего либо (str<>num<>obj) в чём либо (str<>arr<>obj). принимает 3+1 парам.(что, в чём, fn(ревёрс, удал, добав, наличие), ? разделитель)
// запись name в state по знач.стр. поиск name в масс.объ. по совпадению id и значения из строки и подтягивания name в отд.перем. ч/з разделитель
export function findValueFromStringInArray(string: string, array: any) {
  // перем. разбития строка на части, масс.Имён
  const digits = string.split("_");
  const names: any[] = [];
  // перебор масс.по кол-ву знач.в строке
  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i]);
    // ищем объект с соответствующим id
    const matchingObject = array.find((obj: any) => obj.id === digit);
    // е/и есть соответ. и такого имени ещё нет, добав.name в масс
    if (matchingObject && !names.includes(matchingObject.name)) {
      names.push(matchingObject.name);
    }
  }
  // соед.имена ч/з разделитель
  const result = names.join("_");
  return result;
}

const SearchFilter = () => {
  const { catalog } = useContext(AppContext);

  const navigate = useNavigate();

  // параметры поиска ч/з разделитель (Названия/Id)
  const [valueNameStat, setValueNameStat] = useState(defaultValueName);
  const [itemIdStat, setItemIdStat] = useState(defaultItemId);
  // признак перезаписи параметров Каталога из Магазина (запись в itemIdStat один раз)
  const [
    overwrittenСatalogParamsFromStore,
    setOverwrittenCatalogParamsFromStore,
  ] = useState(defaultIdCatalog);
  // console.log("FILTER    000 valueNameStat ", valueNameStat);
  // console.log("FILTER    000 itemIdStat ", itemIdStat);
  // console.log("FILTER    000 overwrittenСatalogParamsFromStore ", overwrittenСatalogParamsFromStore);

  // е/и в cataloge что-то есть (str|id параметры)
  if (catalog.category || catalog.brand) {
    // category есть и не записанные
    if (catalog.category && overwrittenСatalogParamsFromStore.category) {
      // запись str|id из парам.catalog Магазина в state itemIdStat один раз от повтор.перезаписи
      itemIdStat.category = catalog.category;
      setOverwrittenCatalogParamsFromStore(
        (overwrittenСatalogParamsFromStore.category = false)
      );
      const result = findValueFromStringInArray(
        catalog.category,
        catalog.categories
      );
      valueNameStat.category = result;
    }
    if (catalog.brand && overwrittenСatalogParamsFromStore.brand) {
      itemIdStat.brand = catalog.brand;
      setOverwrittenCatalogParamsFromStore(
        (overwrittenСatalogParamsFromStore.brand = false)
      );
      const result = findValueFromStringInArray(catalog.brand, catalog.brands);
      valueNameStat.brand = result;
    }
  }

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

  // изменить и дополнить по параметрам поиска для Filtra
  const changeAndAddBySearchParamsForFilter = (event: any, item: any) => {
    // перем.state
    let dataValueName = {
      ...valueNameStat,
    };
    let dataItemId = {
      ...itemIdStat,
    };

    const itemId = item.id;
    // const itemName = item.name;

    // const eventCheck = event.target.checked; // ? надо применять когда сравн.по id
    const eventName = event.target.name;
    const eventValue = event.target.value;

    let valueNameElem = dataValueName[eventName];
    let itemIdElem = dataItemId[eventName];

    // проверка/вставка/замена id/разделителя(_)значений для кажд.парам.ч/з регулярные выражения
    if ((valueNameElem && itemIdElem) !== "") {
      if (!valueNameElem.includes("_") && !itemIdElem.includes("_")) {
        valueNameElem =
          eventValue === valueNameElem ? "" : valueNameElem + "_" + eventValue;
        itemIdElem =
          String(itemId) === String(itemIdElem)
            ? ""
            : itemIdElem + "_" + itemId;
      } else if (
        valueNameElem.includes(eventValue) &&
        itemIdElem.includes(String(itemId))
      ) {
        valueNameElem = valueNameElem.match(`(?<=_)${eventValue}`)
          ? valueNameElem.replace("_" + eventValue, "")
          : valueNameElem.replace(eventValue + "_", "");
        itemIdElem = itemIdElem.match(`(?<=_)${itemId}`)
          ? itemIdElem.replace("_" + itemId, "")
          : itemIdElem.replace(itemId + "_", "");
      } else {
        valueNameElem = valueNameElem + "_" + eventValue;
        itemIdElem = itemIdElem + "_" + itemId;
      }
    } else {
      valueNameElem = eventValue;
      itemIdElem = String(itemId);
    }

    // запись name/id в state
    dataValueName[eventName] = valueNameElem;
    setValueNameStat(dataValueName);
    dataItemId[eventName] = itemIdElem;
    setItemIdStat(dataItemId);

    // дополнить URL /filter? параметрами поиска
    const params: any = {};
    if (dataValueName.category) params.category = dataValueName.category;
    if (dataValueName.brand) params.brand = dataValueName.brand;
    navigate({
      // pathname: FILTER_ROUTE,
      search: "?" + createSearchParams(params),
    });
  };

  // при клике "Показать" перенаправление в Магазин по параметрам поиска
  const redirectsOnSearchParamsToStore = () => {
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

  useEffect(() => {});

  return (
    <div className="modal--eg__filter">
      <div
        // onClick={() => setShow(false)}
        // className={`overlay ${show ? "show" : ""}`}
        className={`overlay show `}
      ></div>
      {/* <div className={`modal--eg ${show ? "show" : ""}`}> */}
      <div className={`modal--eg show`}>
        {/* кнп.Выход */}
        <svg
          className="modal__bnt-out"
          onClick={() => {
            // unlockBodyScroll();
            onClickResetToShop();
          }}
          height="200"
          viewBox="0 0 200 200"
          width="200"
        >
          <title>СБРОС</title>
          <path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z" />
        </svg>
        {/* Блоки с Параметрами */}
        <div className="modal__choice-param choice-param__all">
          {/* Колонка 1 */}
          <div className="choice-param__col">
            {/* Категории */}
            <div className="choice-param bbb-1">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                Категория
              </button>
              <div className="choice-param__item">
                {catalog.categories.map((item: any) => (
                  <label key={item.id}>
                    <input
                      type="checkbox"
                      name="category"
                      value={item.name}
                      checked={itemIdStat["category"].includes(String(item.id))}
                      onChange={(e) =>
                        changeAndAddBySearchParamsForFilter(e, item)
                      }
                    />
                    <span>
                      {item.name}-{item.id}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {/* Бренды */}
            <div className="choice-param bbb-1">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                Бренд
              </button>
              <div className="choice-param__item">
                {catalog.brands.map((item: any) => (
                  <label key={item.id}>
                    <input
                      type="checkbox"
                      name="brand"
                      value={item.name}
                      checked={itemIdStat["brand"].includes(String(item.id))}
                      onChange={(e) =>
                        changeAndAddBySearchParamsForFilter(e, item)
                      }
                    />
                    <span>
                      {item.name}-{item.id}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Колонка 2 */}
          <div className="choice-param__col">
            {/* Цены */}
            <div className="choice-param bbb-1">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                Цена
              </button>
              <div className="choice-param__item">СДЕЛАТЬ ВЫБОРКУ ЦЕН</div>
            </div>
            {/* Рейтинг */}
            <div className="choice-param  bbb-1">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                Рейтинг
              </button>
              <div className="choice-param__item">СДЕЛАТЬ ВЫБОР РЕЙТИНГА</div>
            </div>
          </div>
          {/* Колонка 3 */}
          <div className="choice-param__col">
            {/* ЕЩЁ_1 */}
            <div className="choice-param bbb-1">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                ЕЩЁ_1
              </button>
              <div className="choice-param__item">ДОБАВИТЬ_1</div>
            </div>
            {/* ЕЩЁ_2 */}
            <div className="choice-param bbb-1">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                ЕЩЁ_2
              </button>
              <div className="choice-param__item">ДОБАВИТЬ_2</div>
            </div>
            {/* ЕЩЁ_3 */}
            <div className="choice-param bbb-1">
              <button className="choice-param__btn" onClick={ShowChoiceParam}>
                ЕЩЁ_3
              </button>
              <div className="choice-param__item">ДОБАВИТЬ_3</div>
            </div>
          </div>
        </div>
        <div className="modal__bnt-interactiv">
          {/* // ~ времянка */}
          <div style={{ margin: "15px" }}>
            Отражать количество эл. Прописать отд.serv с возвратом просто суммы
            (подсчёт совпадений) и возврат данн.Товаров/Хар-ик. Для
            одного/нескольких/смешанных параметров
          </div>
          {/* кнп.Показать */}
          <div>
            <button
              className="btn--eg btn-danger--eg"
              // onClick={(e) => {
              // handlerDeleteBulkValue(e);
              // }}
            >
              Отменить
            </button>
            <button
              className="btn--eg btn-primary--eg"
              // onClick={(e) => {
              // handlerDeleteBulkValue(e);
              // }}
            >
              Показать `количество`
            </button>
            <button
              className="btn--eg btn-danger--eg"
              // onClick={(e) => {
              // handlerDeleteBulkValue(e);
              // }}
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
