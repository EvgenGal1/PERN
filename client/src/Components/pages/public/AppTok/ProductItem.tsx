import { useNavigate } from "react-router-dom";
import { Card, Col } from "react-bootstrap";

import { PRODUCT_ROUTE } from "../../../../utils/consts";

const ProductItem = ({ data }: any) => {
  const navigate = useNavigate();

  // логика обрезания/замены последн.буквы
  let str = data.category.name;
  str = str.slice(0, -1);
  if (str === "букв") str = str + "а";
  if (str === "геро") str = str + "й";
  if (str === "сердц") str = str + "е";
  if (str === "молекул") str = str + "а";

  return (
    <Col
      md={3}
      lg={4}
      sm={6}
      onClick={() => navigate(PRODUCT_ROUTE + `/${data.id}`)}
    >
      <Card style={{ cursor: "pointer" }} className="mt-3 card__eg">
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
          {/* <div
            style={{
              textAlign: "center",
            }}
          >
            {str} {data.brand.name}
          </div>
          <br /> */}
          <div
            style={{
              textAlign: "center",
            }}
          >
            <strong>{data.name}</strong>
          </div>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>
              Цена: <span>{data.price}</span>
            </div>
            <div>
              Рейтинг: <span>{data.rating}</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductItem;
