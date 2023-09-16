import React, { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { SHOP_ROUTE, SHOP_CATALOG_ROUTE } from "../../../../utils/consts";

const CategoryBar = observer(() => {
  const { catalog }: any = useContext(AppContext);

  const navigate = useNavigate();

  // при клике перенаправление на URL маршрут по параметрам поиска
  const onClickRedirectToSearchParamsURL = (id: number) => {
    // ^ стар.логика (е/и category = id то перевод в null, иначе id)
    // if (id === catalog.category) {
    //   catalog.category = null;
    // } else {
    //   catalog.category = id;
    // }

    // ^ нов.логика (проверка/вставка/замена id/разделителя(_)значений ч/з регулярные выражения)
    // е/и в category что-то есть
    if (catalog.category !== null) {
      // е/и нет разделителя (_) значений
      if (!String(catalog.category).includes("_")) {
        // е/и category = id, то перевод в null
        if (id === Number(catalog.category)) {
          catalog.category = null;
        }
        // е/и category не = id, то ч/з разделитель добавляем
        else {
          catalog.category = catalog.category + "_" + id;
        }
      }
      // е/и в строке есть разделитель (_) значений
      else {
        // е/и в строке есть id
        if (catalog.category.includes(String(id))) {
          // ^ Позитив.ретроспективная проверка: (?<=Y)X, ищет совпадение с X при условии, что перед ним ЕСТЬ Y.
          // регулярное выражение с перем.
          // let regexp = new RegExp(`(?<=_)` + String(id));

          // е/и перед id есть разделитель (_)
          // ^ str.match(regexp) - ищет совпадения с regexp в строке str. Вызов на строке. Альтер - regexp.exec(str) то же. Вызов на регул.выраж.
          if (
            catalog.category.match(
              // regexp // перем.
              // "(?<=_)" + id // конкатенация
              `(?<=_)${id}` // интерполяция
            )
          ) {
            // убираем разделитель впереди id и сам id из строки
            // ^ str.replace(str|regexp, str|func) - поиска(1ое знач.) и замена(на 2ое знач.)
            catalog.category = catalog.category.replace("_" + id, "");
          }
          // е/и перед id нет разделителя (_), то убираем id и разделитель после него
          else {
            catalog.category = catalog.category.replace(id + "_", "");
          }
        }
        // е/и в строке есть разелитель и нет id, то ч/з разделитель добавляем
        else {
          catalog.category = catalog.category + "_" + id;
        }
      }
    }
    // е/и category пуст, то добавляем id
    else {
      catalog.category = id;
    }

    // запись в перем.параметров из catalog
    const params: any = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit !== (20 || 0)) params.limit = catalog.limit;
    if (catalog.sortOrd !== ("ASC" || null)) params.sortOrd = catalog.sortOrd;
    if (catalog.sortField !== ("name" || null))
      params.sortField = catalog.sortField;

    // при наличии (category,brand) отправка на URL /catalog/list + params иначе главная
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

  // показ блока с Параметрами
  const handleClickChoiceParam = (event: any) => {
    event.currentTarget.classList.toggle("choice-param-show");
  };

  return (
    <>
      {/* Категории */}
      <div className="choice-param bbb-2" /* ef-bs */>
        <button className="choice-param__btn" onClick={handleClickChoiceParam}>
          Категория
        </button>
        <div className="choice-param__item">
          {catalog.categories.map((item: any) => (
            <label key={item.id}>
              <input
                onClick={() => onClickRedirectToSearchParamsURL(item.id)}
                type="checkbox"
                name={`category.${item.name}`}
                value={item.name}
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
});

export default CategoryBar;
