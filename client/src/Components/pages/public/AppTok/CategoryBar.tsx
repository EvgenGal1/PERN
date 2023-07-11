import React, { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";

const CategoryBar = observer(() => {
  const { catalog }: any = useContext(AppContext);

  const navigate = useNavigate();

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
    if (catalog.limit) params.limit = catalog.limit;
    if (catalog.sortOrd) params.sortOrd = catalog.sortOrd;
    if (catalog.sortField) params.sortField = catalog.sortField;
    navigate({
      pathname: "/",
      search: "?" + createSearchParams(params),
    });
  };

  return (
    <ListGroup className="list-group__eg">
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
    </ListGroup>
  );
});

export default CategoryBar;
