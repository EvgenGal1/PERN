import React, { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";

const CategoryBar = /* observer( */ () => {
  const { categories }: any = useContext(AppContext);
  // ! ошб. Cannot read properties of undefined (reading 'categories')
  const { catalog }: any = useContext(AppContext);
  const { context }: any = useContext(AppContext);

  console.log("categories ", categories);
  console.log("catalog ", catalog);
  // console.log("catalog.categories ", catalog.categories);
  console.log("context ", context);
  // console.log("context.categories ", context.categories);

  // const handleClick = (id: number) => {
  //   if (id === catalog.category) {
  //     catalog.category = null;
  //   } else {
  //     catalog.category = id;
  //   }
  // };

  return (
    <ListGroup>
      {categories.map((item: any) => (
        <ListGroup.Item
          key={item.id}
          active={false}
          onClick={() => alert("Фильтрация, только товары категории")}
          style={{ cursor: "pointer" }}
        >
          {item.name}
        </ListGroup.Item>
      ))}
      {/* {catalog.categories.map((item: any) => (
        <ListGroup.Item
          key={item.id}
          active={item.id === catalog.category}
          onClick={() => handleClick(item.id)}
          style={{ cursor: "pointer" }}
        >
          {item.name}
        </ListGroup.Item>
      ))} */}
    </ListGroup>
  );
}; /* ); */

export default CategoryBar;
