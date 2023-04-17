import { useContext } from "react";
import { ListGroup } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";

const BrandBar = () => {
  const { brands }: any = useContext(AppContext);
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
    </ListGroup>
  );
};

export default BrandBar;
