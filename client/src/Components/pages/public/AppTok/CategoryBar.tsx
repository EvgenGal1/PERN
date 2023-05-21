import React, { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";

const CategoryBar = observer(() => {
  // const { categories }: any = useContext(AppContext);
  // ! ошб. Cannot read properties of undefined (reading 'catalog|context')
  // ^ catalog в AppContext вообще нет. а context извлекался(в скобказ {}) как часть(метод) AppContext а не как объ.с объ.
  const context: any = useContext(AppContext);
  const navigate = useNavigate();

  // console.log("categories ", categories);
  // console.log("context ", context);
  // console.log("context.categories ", context.categories);

  const handleClick = (id: number) => {
    if (id === context.category) {
      context.category = null;
    } else {
      context.category = id;
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
    <ListGroup>
      {/* {categories.map((item: any) => (
        <ListGroup.Item
          key={item.id}
          active={false}
          onClick={() => alert("Фильтрация, только товары категории")}
          style={{ cursor: "pointer" }}
        >
          {item.name}
        </ListGroup.Item>
      ))} */}
      {context.categories.map((item: any) => (
        <ListGroup.Item
          key={item.id}
          active={item.id === context.category}
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
