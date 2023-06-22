import { useNavigate } from "react-router-dom";
import { Card, Col } from "react-bootstrap";

import { PRODUCT_ROUTE } from "../../../../utils/consts";

const ProductItem = ({ data }: any) => {
  const navigate = useNavigate();

  return (
    <Col
      md={3}
      lg={4}
      sm={6}
      className="mt-3"
      onClick={() => navigate(PRODUCT_ROUTE + `/${data.id}`)}
    >
      <Card style={{ /* width: 200, */ cursor: "pointer" }}>
        {data.image ? (
          <Card.Img
            variant="top"
            // ! врем.простав.полный путь. Из env чёт не читает
            // src={process.env.REACT_APP_IMG_URL_TOK + data.image}
            src={"http://localhost:5050/" + data.image}
          />
        ) : (
          <Card.Img variant="top" src="http://via.placeholder.com/200" />
        )}
        <Card.Body style={{ height: "100%", overflow: "hidden" }}>
          <strong>{data.name}</strong>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "spaceBetween",
            }}
          >
            <div>Бренд: {data.brand.name}</div>
            <div>Цена: {data.price}</div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductItem;
