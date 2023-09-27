import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Image, Spinner } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";
import {
  createProdRating,
  fetchOneProduct,
  fetchProdRating,
} from "../../../../http/Tok/catalogAPI_Tok";
import { appendBasket } from "../../../../http/Tok/basketAPI_Tok";
// Звезд.Комп.Рейтинга. Пуст./Полн.
import { StarFill } from "../../../layout/AppTok/StarFill";
import { StarOutline } from "../../../layout/AppTok/StarOutline";

const Product = (/* props: any */) => {
  // е/и есть передача props ч/з navigate/useNavigate/react-router-dom
  // const location = useLocation();
  // const locationState = location.state as { userId?: number };
  // let userId = locationState.userId // || location.state.userId;

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

  // id Товара, Context, state Товара
  const { id }: any = useParams();
  const { basket, catalog, user }: any = useContext(AppContext);
  const [product, setProduct]: any = useState(null);

  // сост.Рейтинга, наведения на него, кол-во головов из БД
  const [numberStar, setNuberStar] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [votes, setVotes] = useState(0);

  // изнач.загр.Товара/Хар-ик + Рейтинг/Голоса
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

  // обраб.клк по кнп. «Добавить в корзину»:
  const handleClick = (productId: any) => {
    console.log("Prod productId ", productId);
    appendBasket(productId).then((data: any) => {
      console.log("Product appendBasket data ", data);
      basket.products = data.products;
      console.log("Product basket.products ", basket.products);
    });
  };

  if (!product) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="container">
      <div className="df df-row mt-3 mb-3">
        <div className="col-lg-4">
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
        </div>
        <div className="col-lg-8">
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
          <button
            onClick={() => handleClick(product.id)}
            style={{ ...styles.button, ...(isPressed && styles.buttonPressed) }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="btn--eg btn-primary--eg mt-3"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
      {/* Характеристики */}
      {!!product.props.length && (
        <div className="df df-row">
          <div className="df df-col">
            <h3>Характеристики</h3>
            <table className="table--eg">
              <tbody>
                {product.props.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
