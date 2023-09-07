import React, { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";

const BrandBar = observer(() => {
  const { catalog } = useContext(AppContext);

  const navigate = useNavigate();

  // перенаправить по маршруту URL по параметру
  const handleClick = (id: number) => {
    if (catalog.brand !== null)
      if (!String(catalog.brand).includes("_"))
        catalog.brand =
          id === Number(catalog.brand) ? null : catalog.brand + "_" + id;
      else if (catalog.brand.includes(String(id)))
        catalog.brand = catalog.brand.match(`(?<=_)${id}`)
          ? catalog.brand.replace("_" + id, "")
          : catalog.brand.replace(id + "_", "");
      else catalog.brand = catalog.brand + "_" + id;
    else catalog.brand = id;

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
      {/* <ListGroup horizontal className="list-group--eg">
        {catalog.brands.map((item: any) => (
          <ListGroup.Item
            key={item.id}
            active={item.id === catalog.brand}
            onClick={() => handleClick(item.id)}
            style={{ cursor: "pointer" }}
          >
            {item.name}
          </ListGroup.Item>
        ))}
      </ListGroup> */}
      {/*  */}
      {/* <div className="list-group--eg flrow">
        {catalog.brands.map((item: any) => (
          <div
            key={item.id}
            className={`list-group-item--eg hrz ${
              item.id === catalog.brand ? "active" : ""
            }`}
            onClick={() => handleClick(item.id)}
          >
            {item.name} - {item.id}
          </div>
        ))}
      </div> */}
      {/*  */}
      <div className="choice-param" style={{ marginTop: "15px" }}>
        <button className="choice-param__btn" onClick={handleClickChoiceParam}>
          Бренды
        </button>
        <div className="choice-param__item">
          {catalog.brands.map((item: any) => (
            <label key={item.id}>
              <input
                onClick={() => handleClick(item.id)}
                type="checkbox"
                name={`brand.${item.name}`}
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

export default BrandBar;
