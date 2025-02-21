import { useContext, useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

import { productAPI } from "@/api/catalog/productAPI";
import { findValueFromStringInArray } from "@/scripts/helpers/findValueFromStringInArray";
import { FILTER_ROUTE, SHOP_CATALOG_ROUTE, SHOP_ROUTE } from "@/utils/consts";
import { AppContext } from "@/context/AppContext";

// перем. Имён, Id, фильтров из Каталога, кол-ва Продуктов
let defaultValueName: any = { category: "", brand: "", name: "", price: "" };
let defaultItemId: any = { category: "", brand: "", name: "", price: "" };
let defaultIdCatalog: any = {
  category: true,
  brand: true,
  name: true,
  price: true,
};
let countProduct: number | string = "";

const SearchFilter: React.FC = () => {
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
  // console.log(
  //   "FILTER    000 overwrittenСatalogParamsFromStore ",
  //   overwrittenСatalogParamsFromStore
  // );

  // е/и в cataloge что-то есть (str|id параметры)
  if (catalog.filters.category || catalog.filters.brand) {
    // category есть и не записанные
    if (
      catalog.filters.category &&
      overwrittenСatalogParamsFromStore.category
    ) {
      // запись str|id из парам.catalog Магазина в state itemIdStat один раз от повтор.перезаписи
      itemIdStat.category = catalog.filters.category;
      setOverwrittenCatalogParamsFromStore(
        (overwrittenСatalogParamsFromStore.category = false)
      );
      // нахожд.name по id из строки и запись в state
      const result = findValueFromStringInArray(
        catalog.filters.category,
        catalog.categories
      );
      valueNameStat.category = result;
    }
    if (catalog.filters.brand && overwrittenСatalogParamsFromStore.brand) {
      itemIdStat.brand = catalog.filters.brand;
      setOverwrittenCatalogParamsFromStore(
        (overwrittenСatalogParamsFromStore.brand = false)
      );
      const result = findValueFromStringInArray(
        catalog.filters.brand,
        catalog.brands
      );
      valueNameStat.brand = result;
    }
  }

  // изменить и дополнить по параметрам поиска для Filtra
  const changeAndAddBySearchParamsForFilter = (event: any, item: any) => {
    // перем.state
    const dataValueName = {
      ...valueNameStat,
    };
    const dataItemId = {
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
    // ? нужно ли ? это в Filtre
    // if (catalog.pagination.page > 1) params.page = catalog.pagination.page;
    // if (catalog.pagination.limit !== (20 || 0)) params.limit = catalog.pagination.limit;
    // if (catalog.sortSettings.order !== ("ASC" || null)) params.order = catalog.sortSettings.order;
    // if (catalog.sortSettings.field !== ("name" || null))
    // params.field = catalog.sortSettings.field;

    navigate({ search: "?" + createSearchParams(params) });
  };

  // блок./разблок.прокрутки body при modal Расшир.Поиске
  const body = document.querySelector("body");
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

  // сбросить Filterы
  const resetFilterDefault = (sign?: string) => {
    countProduct = 0;
    defaultValueName = { category: "", brand: "", name: "", price: "" };
    defaultItemId = { category: "", brand: "", name: "", price: "" };
    setValueNameStat(defaultValueName);
    setItemIdStat(defaultItemId);
    // востан.признак перезаписи
    if (sign === "all") {
      defaultIdCatalog = {
        category: true,
        brand: true,
        name: true,
        price: true,
      };
      setOverwrittenCatalogParamsFromStore(defaultIdCatalog);
    }
    navigate({ pathname: FILTER_ROUTE });
  };

  // возврат в Магазин назад или с/без парам.поиска и сброс states/блок.body
  const returnToShop = (param?: string) => {
    unlockBodyScroll();
    resetFilterDefault("all");
    // в Магаз по Стар.парам.поиска
    if (param === "returnHowWasToStore") {
      const params: any = {};
      if (catalog.filters.category) params.category = catalog.filters.category;
      if (catalog.filters.brand) params.brand = catalog.filters.brand;
      if (catalog.pagination.page > 1) params.page = catalog.pagination.page;
      if (catalog.pagination.limit !== 10 && catalog.pagination.limit !== 0)
        params.limit = catalog.pagination.limit;
      if (
        catalog.sortSettings.order !== "ASC" ||
        catalog.sortSettings.order !== null
      )
        params.order = catalog.sortSettings.order;
      if (
        catalog.sortSettings.field !== "name" ||
        catalog.sortSettings.field !== null
      )
        params.field = catalog.sortSettings.field;
      navigate({
        pathname: SHOP_CATALOG_ROUTE,
        search: "?" + createSearchParams(params),
      });
    }

    // в Магаз по Нов.парам.поиска
    else if (param === "searchParams") {
      const params: any = {};
      if (itemIdStat.category) params.category = itemIdStat.category;
      if (itemIdStat.brand) params.brand = itemIdStat.brand;
      if (catalog.pagination.page > 1) params.page = catalog.pagination.page;
      if (catalog.pagination.limit !== 10 && catalog.pagination.limit !== 0)
        params.limit = catalog.pagination.limit;
      if (
        catalog.sortSettings.order !== "ASC" ||
        catalog.sortSettings.order !== null
      )
        params.order = catalog.sortSettings.order;
      if (
        catalog.sortSettings.field !== "name" ||
        catalog.sortSettings.field !== null
      )
        params.field = catalog.sortSettings.field;
      navigate({
        pathname: SHOP_CATALOG_ROUTE,
        search: "?" + createSearchParams(params),
      });
    }
    // пустой сброс в магаз без парам.поиска
    else {
      navigate({ pathname: SHOP_ROUTE });
    }
  };

  // получение кол-ва Продуктов ч/з usEf
  useEffect(() => {
    productAPI
      .getAllProducts(
        itemIdStat.category,
        itemIdStat.brand,
        catalog.pagination.page,
        // 10000,
        catalog.pagination.limit,
        // ! ошб.типа, логики и передачи
        catalog.sortSettings.order!,
        catalog.sortSettings.field!
      )
      .then((data) => {
        // console.log("FLT usEf 000 data ", data);
        countProduct = data.count;
      })
      .finally(/* () => console.log("countProduct ", countProduct) */);
  }, [itemIdStat]);

  return (
    <div className="modal--eg__filter">
      <div className={`overlay show `}></div>
      <div className={`modal--eg show`}>
        {/* кнп.Выход */}
        <svg
          className="modal__bnt-out"
          onClick={() => {
            returnToShop("returnHowWasToStore");
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
                    <span>{item.name}</span>
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
                    <span>{item.name}</span>
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
          <div>
            <button
              className="btn--eg btn-danger--eg"
              onClick={() => {
                returnToShop("returnHowWasToStore");
              }}
            >
              Отменить и возврат
            </button>
            <button
              className="btn--eg btn-primary--eg"
              onClick={() => {
                returnToShop("searchParams");
              }}
            >
              {/* // ! отражен результат ч/з usEf с отставанием в 1 шаг */}
              Показать {countProduct /* data.count */}
            </button>
            <button
              className="btn--eg btn-danger--eg"
              onClick={() => {
                resetFilterDefault();
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
