import { useContext } from "react";
import { ListGroup } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";

const CategoryBar = () => {
  const { categories }: any = useContext(AppContext);
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
    </ListGroup>
  );
};

export default CategoryBar;
