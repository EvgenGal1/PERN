import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Spinner,
  Table,
} from "react-bootstrap";

import {
  fetchOneProduct,
  fetchProdRating,
} from "../../../../http/Tok/catalogAPI_Tok";
import { append } from "../../../../http/Tok/basketAPI_Tok";
import { AppContext } from "../../../layout/AppTok/AppContext";

const Product = () => {
  // эффект нажатия кнопки
  const [isPressed, setIsPressed] = useState(false);
  const styles = {
    button: {
      transition: "transform 0.2s",
    },
    buttonPressed: {
      transform: "scale(0.95)",
    },
  };
  const handleMouseDown = () => {
    setIsPressed(true);
  };
  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const { id }: any = useParams();
  const { basket }: any = useContext(AppContext);
  const [product, setProduct]: any = useState(null);
  const [rating, setRating]: any = useState(null);

  useEffect(() => {
    fetchOneProduct(id).then((data: any) => setProduct(data));
    fetchProdRating(id).then((data: any) => setRating(data));
  }, [id]);

  // На странице товара добавим обработчик клика по кнопке «Добавить в корзину»:
  const handleClick = (productId: any) => {
    append(productId).then((data: any) => {
      basket.products = data.products;
    });
  };

  if (!product) {
    return <Spinner animation="border" />;
  }

  return (
    <Container>
      <Row className="mt-3 mb-3">
        <Col lg={4}>
          {product.image ? (
            <Image
              width={300}
              height={300}
              src={process.env.REACT_APP_IMG_URL_TOK + product.image}
            />
          ) : (
            <Image
              width={300}
              height={300}
              src="http://via.placeholder.com/300"
            />
          )}
        </Col>
        <Col lg={8}>
          <h1>{product.name}</h1>
          <h3>{product.price}.00 руб.</h3>
          <p>Бренд: {product.brand.name}</p>
          <p>Категория: {product.category.name}</p>
          <div>
            {rating ? (
              <p>
                Рейтинг: {rating.rating}, голосов {rating.votes}
              </p>
            ) : (
              <Spinner animation="border" />
            )}
          </div>
          <Button
            onClick={() => handleClick(product.id)}
            style={{ ...styles.button, ...(isPressed && styles.buttonPressed) }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            variant="primary"
            className="btn-primary__eg"
          >
            Добавить в корзину
          </Button>
        </Col>
      </Row>
      {!!product.props.length && (
        <Row>
          <Col>
            <h3>Характеристики</h3>
            <Table className="table__eg" bordered hover size="sm">
              <tbody>
                {product.props.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Product;
