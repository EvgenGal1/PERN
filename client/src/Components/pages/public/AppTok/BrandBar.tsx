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
    if (id === catalog.brand) {
      catalog.brand = null;
    } else {
      catalog.brand = id;
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
      <div className="list-group--eg flrow">
        {catalog.brands.map((item: any) => (
          <div
            key={item.id}
            className={`list-group-item--eg hrz ${
              item.id === catalog.brand ? "active" : ""
            }`}
            onClick={() => handleClick(item.id)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </>
  );
});

export default BrandBar;
