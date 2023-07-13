import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { PRODUCT_ROUTE } from "../../../../utils/consts";
import {
  updateProduct,
  fetchProdRating,
  createProdRating,
} from "../../../../http/Tok/catalogAPI_Tok";

// Комп.Рейтинга. Пуст./Полн.
const OutlineStar = () => {
  const OutlineStar = "☆";
  return <span>{OutlineStar}</span>;
};
const FillStar = () => {
  const FillStar = "★";
  return <span>{FillStar}</span>;
};

const ProductItem = ({ data }: any) => {
  const { user }: any = useContext(AppContext);
  const navigate = useNavigate();

  const isValid = (value: any) => {
    const result: any = {};
    const pattern = /^[1-5][0-5]*$/;
    // for (let key in value) {
    // if (key === "name") result.name = value.name.trim() !== "";
    // if (key === "price") result.price = pattern.test(value.price.trim());
    if (value > 0) result.rating = value;
    // if (key === "category") result.category = pattern.test(value.category);
    // if (key === "brand") result.brand = pattern.test(value.brand);
    // }
    return result;
  };

  // сост.Рейтинга и наведения на него
  const [numberStar, setNuberStar] = useState(data.rating);
  const [hoverStar, setHoverStar] = useState(0);

  let ratingNew = data.rating;
  const handleSubmit = async (rating: number) => {
    console.log("ratingNew 0 ", ratingNew);
    const correct = isValid(rating);
    if (user.isAuth && correct.rating) {
      console.log("user.id ", user.id);
      /* const cra = */
      /* await */ createProdRating(user.id, data.id, rating)
        .then((data) => {
          console.log("CRA data ", data);
          ratingNew = data.ratingAll;
          setNuberStar(data.ratingAll);
          data.rating = data.ratingAll;
          console.log("ratingNew 1 ", ratingNew);
        })
        .finally(() => setNuberStar(ratingNew));

      // ^ получ.Рейтинга (пока всё сделанно в createProdRating)
      // const one = fetchProdRating(data.id).then((data) => {
      //   console.log("ONE data ", data);
      // });
      // console.log("one ====================== ", one);

      // ^ менять Рейтинг ч/з UpdProd (нет доступов для role USER)
      // const correct = isValid(rating);
      // if (correct.rating) {
      //   const prod = {
      //     name: data.name,
      //     price: data.price.toString(),
      //     rating: rating.toString(),
      //     category: data.categoryId.toString(),
      //     brand: data.brandId.toString(),
      //   };
      //   updateProduct(data.id, prod)
      //     .then((data) => {
      //       console.log("UPDprod data ", data);
      //       setNuberStar(data.rating);
      //     })
      //     .catch((error) => alert(error.response.data.message));
      // }
    }
  };

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
      // ! врем.откл. переход в Карточку
      // onClick={() => navigate(PRODUCT_ROUTE + `/${data.id}`)}
    >
      <Card style={{ cursor: "pointer" }} className="mt-3 card__eg">
        {data.image ? (
          <Card.Img
            variant="top"
            src={process.env.REACT_APP_IMG_URL_TOK + data.image}
          />
        ) : (
          <Card.Img variant="top" src="http://via.placeholder.com/200" />
        )}
        <Card.Body style={{ height: "100%", overflow: "hidden" }}>
          <div>
            {/* Цена: */} <span>{data.price}</span>
          </div>
          <div>
            <div>
              {/* Рейтинг: */}★★★★★{" "}
              <span>
                {/* {one} +  */}
                {ratingNew} = {data.rating} _{ratingNew} -{" "}
                {data.ratingAll ? data.ratingAll : data.rating}
              </span>
            </div>
            <br />
            <div className="youtube__v=McF22__Jz_I">
              {Array(5)
                .fill(0)
                .map((_, index) =>
                  numberStar >= index + 1 || hoverStar >= index + 1 ? (
                    <span
                      onMouseOver={() => setHoverStar(index + 1)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => handleSubmit(index + 1)}
                      style={{ fontSize: "35px", color: "orange" }}
                      key={index}
                    >
                      <FillStar />
                    </span>
                  ) : (
                    <span
                      onMouseOver={() => setHoverStar(index + 1)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => handleSubmit(index + 1)}
                      style={{ fontSize: "35px", color: "orange" }}
                      key={index}
                    >
                      <OutlineStar />
                    </span>
                  )
                )}
            </div>
            <br />
          </div>
          {/* <br /> */}
          <div>
            <strong>
              {data.brand.name} {data.name}
            </strong>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductItem;
