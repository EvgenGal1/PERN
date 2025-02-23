import { useContext, useEffect, useState } from "react";
import { Image, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { productAPI } from "@/api/catalog/productAPI";
import { ratingAPI } from "@/api/catalog/ratingAPI";
import { basketAPI } from "@/api/shopping/basketAPI";
import { AppContext } from "@/context/AppContext";
// Звезд.Комп.Рейтинга. Пуст./Полн.
import { StarFill } from "@Comp/layout/AppTok/StarFill";
import { StarOutline } from "@Comp/layout/AppTok/StarOutline";
const Product: React.FC = (/* props: any */) => {
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

  // id Продукта, Context, state Продукта
  const { id }: any = useParams();
  const { basket, catalog, user } = useContext(AppContext);
  const [product, setProduct]: any = useState(null);

  // сост.Рейтинга, наведения на него, кол-во головов из БД
  const [numberStar, setNuberStar] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [votes, setVotes] = useState(0);

  // изнач.загр.Продукта/Хар-ик + Рейтинг/Голоса
  useEffect(() => {
    productAPI.getOneProduct(id).then((data: any) => {
      console.log("Prod prod data ", data);
      setProduct(data);
    });
    ratingAPI.getProductRating(id).then((data: any) => {
      console.log("Prod rating data ", data);
      // setRating(data);
      setNuberStar(data.rating);
      setVotes(data.votes);
    });
  }, [id]);

  // созд. Рейтинга в БД
  const handleSubmit = async (rating: number) => {
    if (user.isAuth) {
      await ratingAPI
        .createProductRating(user.id, product.id, rating)
        .then((data) => {
          console.log("ProdItm CRE data ", data);
          // setRating(data);
          // ! ошб.типа, логики и передачи
          setNuberStar(data.rating);
          setVotes(data.votes);
          catalog.rating = data.rating;
        });
    }
  };

  // обраб.клк по кнп. «Добавить в корзину»:
  const handleClick = (productId: any) => {
    console.log("Prod productId ", productId);
    basketAPI.appendBasket(productId).then((data: any) => {
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
              src={`${process.env.REACT_APP_IMG_URL_PERN}/img/shop/product/${product.image}`}
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
                    onFocus={() => setHoverStar(index + 1)}
                    onBlur={() => setHoverStar(0)}
                    onClick={() => handleSubmit(index + 1)}
                    style={{
                      display: "flex",
                      fontSize: "25px",
                      fontWeight: "100",
                      color: "orange",
                      cursor: "pointer",
                    }}
                    key={index}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSubmit(index + 1);
                      }
                    }}
                  >
                    <StarFill />
                  </span>
                ) : (
                  <span
                    onMouseOver={() => setHoverStar(index + 1)}
                    onMouseLeave={() => setHoverStar(0)}
                    onFocus={() => setHoverStar(index + 1)}
                    onBlur={() => setHoverStar(0)}
                    onClick={() => handleSubmit(index + 1)}
                    style={{
                      display: "flex",
                      fontSize: "25px",
                      fontWeight: "100",
                      color: "orange",
                      cursor: "pointer",
                    }}
                    key={index}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSubmit(index + 1);
                      }
                    }}
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
