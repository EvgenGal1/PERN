import React, { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";

const BrandBar = observer(() => {
  // const { brands }: any = useContext(AppContext);
  const context: any = useContext(AppContext);
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    if (id === context.brand) {
      context.brand = null;
    } else {
      context.brand = id;
    }
    // при каждом клике добавляем в историю браузера новый элемент
    const params: any = {};
    if (context.category) params.category = context.category;
    if (context.brand) params.brand = context.brand;
    if (context.page > 1) params.page = context.page;
    navigate({
      pathname: "/",
      search: "?" + createSearchParams(params),
    });
  };

  return (
    <ListGroup horizontal className="list-group__eg">
      {context.brands.map((item: any) => (
        <ListGroup.Item
          key={item.id}
          active={item.id === context.brand}
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
