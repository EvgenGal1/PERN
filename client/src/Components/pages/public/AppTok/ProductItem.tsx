import { useNavigate } from "react-router-dom";
import { Card, Col } from "react-bootstrap";

const ProductItem = ({ data }: any) => {
  console.log(
    "process.env.REACT_APP_API_URL_TOK ",
    process.env.REACT_APP_API_URL_TOK
  );
  console.log(
    "process.env.REACT_APP_IMG_URL_TOK ",
    process.env.REACT_APP_IMG_URL_TOK
  );
  const navigate = useNavigate();

  return (
    <Col
      md={3}
      lg={4}
      sm={6}
      className="mt-3"
      // onClick={() => alert("Переход на страницу товара")}
      onClick={() => navigate(`/product/${data.id}`)}
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
        <Card.Body style={{ height: 100, overflow: "hidden" }}>
          <p>
            Бренд: {/* Samsung */}
            {/* {data.brand.name} */}
            {/* // ! врем.пропис. brandId. нужен brand, но его нет в data */}
            {data.brandId}
          </p>
          <strong>{data.name}</strong>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductItem;
