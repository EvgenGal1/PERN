import React, { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";

const BrandBar = observer(() => {
  const { catalog } = useContext(AppContext);

  const navigate = useNavigate();

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
    if (catalog.limit) params.limit = catalog.limit;
    if (catalog.sortOrd) params.sortOrd = catalog.sortOrd;
    if (catalog.sortField) params.sortField = catalog.sortField;
    navigate({
      pathname: "/",
      search: "?" + createSearchParams(params),
    });
  };

  return (
    <ListGroup horizontal className="list-group__eg">
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
    </ListGroup>
  );
});

export default BrandBar;
