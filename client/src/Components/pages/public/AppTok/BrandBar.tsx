import React, { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";

const BrandBar = /* observer( */ () => {
  const { brands }: any = useContext(AppContext);
  // ! ошб. Cannot read properties of undefined (reading 'brands')
  // const { catalog }: any = useContext(AppContext);

  // const handleClick = (id: number) => {
  //   if (id === catalog.brand) {
  //     catalog.brand = null;
  //   } else {
  //     catalog.brand = id;
  //   }
  // };

  return (
    <ListGroup horizontal>
      {brands.map((item: any) => (
        <ListGroup.Item
          key={item.id}
          active={false}
          onClick={() => alert("Фильтрация, только товары бренда")}
          style={{ cursor: "pointer" }}
        >
          {item.name}
        </ListGroup.Item>
      ))}
      {/* {catalog.brands.map((item: any) => (
        <ListGroup.Item
          key={item.id}
          active={item.id === catalog.brand}
          onClick={() => handleClick(item.id)}
          style={{ cursor: "pointer" }}
        >
          {item.name}
        </ListGroup.Item>
      ))} */}
    </ListGroup>
  );
}; /* ) */

export default BrandBar;
