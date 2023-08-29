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

import { AppContext } from "../../../layout/AppTok/AppContext";
import {
  createProdRating,
  fetchOneProduct,
  fetchProdRating,
} from "../../../../http/Tok/catalogAPI_Tok";
import { append } from "../../../../http/Tok/basketAPI_Tok";
// Звезд.Комп.Рейтинга. Пуст./Полн.
import { StarFill } from "../../../layout/AppTok/StarFill";
import { StarOutline } from "../../../layout/AppTok/StarOutline";

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
  const { basket, catalog, user }: any = useContext(AppContext);
  const [product, setProduct]: any = useState(null);
  // const [rating, setRating]: any = useState(0);

  // сост.Рейтинга, наведения на него, кол-во головов из БД
  const [numberStar, setNuberStar] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [votes, setVotes] = useState(0);

  useEffect(() => {
    fetchOneProduct(id).then((data: any) => {
      console.log("Prod prod data ", data);
      setProduct(data);
    });
    fetchProdRating(id).then((data: any) => {
      console.log("Prod rating data ", data);
      // setRating(data);
      setNuberStar(data.rating);
      setVotes(data.votes);
    });
  }, [id]);

  // созд. Рейтинга в БД
  const handleSubmit = async (rating: number) => {
    if (user.isAuth) {
      await createProdRating(user.id, product.id, rating).then((data) => {
        console.log("ProdItm CRE data ", data);
        // setRating(data);
        setNuberStar(data.ratingAll);
        setVotes(data.votes);
        catalog.rating = data.ratingAll;
      });
    }
  };

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
              src={process.env.REACT_APP_IMG_URL_PERN + product.image}
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
          <h3>
            {product.price.toLocaleString()}
            {/* .00 */} руб.
          </h3>
          <p>Бренд: {product.brand.name}</p>
          <p>Категория: {product.category.name}</p>
          <div>
            {/* {rating ? (
              <p>
                <p>
                  Рейтинг: {rating.rating}, голосов {rating.votes}
                </p>
              </p>
            ) : (
              <Spinner animation="border" />
            )} */}
            <p>
              Рейтинг: {numberStar} {votes ? <> / {votes}</> : ""} Голосов
            </p>
          </div>
          {/* Звёзды */}
          <div style={{ display: "flex", marginRight: "10px" }}>
            {Array(5)
              .fill(0)
              .map((_, index) =>
                numberStar >= index + 1 || hoverStar >= index + 1 ? (
                  // rating.rating >= index + 1 || hoverStar >= index + 1 ? (
                  // product.rating >= index + 1 || hoverStar >= index + 1 ? (
                  <span
                    onMouseOver={() => setHoverStar(index + 1)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => handleSubmit(index + 1)}
                    style={{
                      display: "flex",
                      fontSize: "25px",
                      fontWeight: "100",
                      color: "orange",
                    }}
                    key={index}
                  >
                    <StarFill />
                  </span>
                ) : (
                  <span
                    onMouseOver={() => setHoverStar(index + 1)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => handleSubmit(index + 1)}
                    style={{
                      display: "flex",
                      fontSize: "25px",
                      fontWeight: "100",
                      color: "orange",
                    }}
                    key={index}
                  >
                    <StarOutline />
                  </span>
                )
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
            className="btn-primary--eg mt-3"
          >
            Добавить в корзину
          </Button>
        </Col>
      </Row>
      {!!product.props.length && (
        <Row>
          <Col>
            <h3>Характеристики</h3>
            <Table className="table--eg" bordered hover size="sm">
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
