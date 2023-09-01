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
      <div className="list-group--eg flcol">
        {catalog.categories.map((item: any) => (
          <div
            key={item.id}
            className={`list-group-item--eg ${
              item.id === catalog.category ? "active" : ""
            }`}
            onClick={() => handleClick(item.id)}
          >
            {item.name}
          </div>
        ))}
      </div>
      {/* Категории */}
      <div className="choice-param__item" style={{ marginTop: "15px" }}>
        <button className="choice-param__btn" onClick={handleClickChoiceParam}>
          Категория
        </button>
        <div className="choice-param__prm">
          {catalog.categories.map((item: any) => (
            <label key={item.id}>
              <input
                // onChange={(e) => handleInputChange(e, item.id)}
                type="checkbox"
                name="category"
                id=""
              />
              <div>{item.name}</div>
            </label>
          ))}
        </div>
      </div>
    </>
  );
});

export default CategoryBar;
