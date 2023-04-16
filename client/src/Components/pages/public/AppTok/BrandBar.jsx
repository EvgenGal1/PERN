import { useContext } from "react";
import { ListGroup } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";

const BrandBar = () => {
  const { brands } = useContext(AppContext);
  return (
    <ListGroup horizontal>
      {brands.map((item) => (
        <ListGroup.Item
          key={item.id}
          active={false}
          onClick={() => alert("Фильтрация, только товары бренда")}
          style={{ cursor: "pointer" }}
        >
          {item.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default BrandBar;
