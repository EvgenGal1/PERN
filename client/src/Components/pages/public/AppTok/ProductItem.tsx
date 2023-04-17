import { Card, Col } from "react-bootstrap";

const ProductItem = ({ data }: any) => {
  return (
    <Col
      md={3}
      className="mt-3"
      onClick={() => alert("Переход на страницу товара")}
    >
      <Card style={{ width: 200, cursor: "pointer" }}>
        <Card.Img variant="top" src="http://via.placeholder.com/200" />
        <Card.Body style={{ height: 100, overflow: "hidden" }}>
          <p>Бренд: Samsung</p>
          <strong>{data.name}</strong>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductItem;
