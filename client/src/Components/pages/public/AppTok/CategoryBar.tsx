import React, { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";

const CategoryBar = observer(() => {
  const { catalog }: any = useContext(AppContext);

  const navigate = useNavigate();

  // перенаправить по маршруту URL по параметру
  const handleClick = (id: number) => {
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
        // е/и в строке нет id, то ч/з разделитель добавляем
        else {
          catalog.category = catalog.category + "_" + id;
        }
      }
    }
    // е/и category пуст, то добавляем id
    else {
      catalog.category = id;
    }

    // при каждом клике добавляем в историю браузера новый элемент
    const params: any = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit !== (20 || 0)) params.limit = catalog.limit;
    if (catalog.sortOrd !== ("ASC" || null)) params.sortOrd = catalog.sortOrd;
    if (catalog.sortField !== ("name" || null))
      params.sortField = catalog.sortField;

    // при наличии (category,brand) отправка на URL /catalog/list/ иначе главная
    if (catalog.brand || catalog.category) {
      navigate({
        pathname: "/catalog/list",
        search: "?" + createSearchParams(params),
      });
    } else {
      navigate({
        pathname: "/",
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
      {/* <ListGroup className="list-group--eg" style={{ margin: "0 0 15px" }}>
        {catalog.categories.map((item: any) => (
          <ListGroup.Item
            key={item.id}
            active={item.id === catalog.category}
            onClick={() => handleClick(item.id)}
            style={{ cursor: "pointer" }}
          >
            {item.name}
          </ListGroup.Item>
        ))}
      </ListGroup> */}
      {/*  */}
      {/* <div className="list-group--eg flcol">
        {catalog.categories.map((item: any) => (
          <div
            key={item.id}
            className={`list-group-item--eg ${
              item.id === catalog.category ? "active" : ""
            }`}
            onClick={() => handleClick(item.id)}
          >
            {item.name} - {item.id}
          </div>
        ))}
      </div> */}
      {/*  */}
      {/* Категории */}
      <div className="choice-param" /* style={{ marginTop: "15px" }} */>
        <button className="choice-param__btn" onClick={handleClickChoiceParam}>
          Категория
        </button>
        <div className="choice-param__item">
          {catalog.categories.map((item: any) => (
            <label key={item.id}>
              <input
                onClick={() => handleClick(item.id)}
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
