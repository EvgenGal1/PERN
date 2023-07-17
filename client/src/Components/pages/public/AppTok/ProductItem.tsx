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
  return <>{OutlineStar}</>;
};
const FillStar = () => {
  const FillStar = "★";
  return <>{FillStar}</>;
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
      await createProdRating(user.id, data.id, rating)
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

  // логика обрезания/замены последн.БУКВ КАТЕГОРИИ
  let strCat = data.category.name;
  // удал.посл.эл.назв.
  strCat = strCat.slice(0, -1);
  // console.log("strCat ", strCat);
  if (strCat === "букв" || strCat === "амбиграмм" || strCat === "молекул")
    strCat = strCat + "а";
  if (strCat === "амбиграмма") strCat = "⇔";
  if (strCat === "буква") strCat = "¶";
  if (strCat === "молекула") strCat = "⚙";
  if (strCat === "геро") {
    // strCat = strCat + "й";
    strCat = "ν";
  }
  if (strCat === "сердц") {
    // strCat = strCat + "е";
    strCat = "❤";
  }
  if (strCat === "холодильник") strCat = "❉";
  if (strCat === "смартфон")
    strCat = (
      <>
        <svg
          // xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-phone"
          viewBox="0 0 16 16"
        >
          <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      </>
    );
  // логика обрезания/замены последн.БУКВ БРЕНДА
  // let strBrnd = data.brand.name;
  // if (strBrnd === ("Apple" || "Samsung")) {  }
  // логика сокращ.НАЗВАНИЯ
  let strName = data.name;
  if (
    strName.includes("Первая") ||
    strName.includes("Вторая") ||
    strName.includes("Третья")
  ) {
    let endStrName = strName.slice(6);
    if (strName.includes("Первая")) {
      strName = "1-ая";
    }
    if (strName.includes("Вторая")) {
      strName = "2-ая";
    }
    if (strName.includes("Третья")) {
      strName = "3-я";
    }
    strName += endStrName;
  }
  if (strName.includes("Четвёртая")) {
    let endStrName = strName.slice(9);
    strName = "4-ая";
    strName += endStrName;
  }
  if (strName.includes(" (копия)")) {
    strName = strName.slice(0, -8);
  }
  if (strName.includes(" (копия)")) {
    strName = strName.slice(0, -8);
  }
  if (strName.includes(" (копия)")) {
    strName = strName.slice(0, -8);
  }
  if (strName.includes(" (копия)")) {
    strName = strName.slice(0, -8);
  }
  if (strName.includes(" (распозн)")) {
    strName = strName.slice(0, -10);
    strName += " (р)";
  }
  if (strName.includes(" (запут)")) {
    strName = strName.slice(0, -8);
    strName += " (з)";
  }
  // логика сокращения ЦЕНЫ
  let price = data.price.toString();
  if (price > 1000000000) {
    // ! не раб. split + splice + join. приходится разбивать
    // console.log("price", price.split("").splice(2, 0, ":").join(""));
    // убираем последн.нули, добавл. B(биллион)
    price = price.replace(/000000$/g, " B");
    // разбив.на массив
    let priceSpit = price.split("");
    // с инд.1, удал.0, добав.запятую(,)
    priceSpit.splice(1, 0, ",");
    // превращ.в строку
    price = priceSpit.join("");
    // ^ доп.разбиение на 3 цифры
    // var num = 1234567890;
    // var result11 = num.toLocaleString(); // 1 234 567 890
    // function numberWithSpaces(x: any) {
    //   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    // }
    // numberWithSpaces(1003540) // 1 003 540
  }
  if (price > 1000000) {
    price = price.toString().replace(/000000$/g, " M");
  }

  return (
    <Col
      md={3}
      lg={4}
      sm={6}
      // ! врем.откл. переход в Карточку
      // onClick={() => navigate(PRODUCT_ROUTE + `/${data.id}`)}
    >
      <Card style={{ cursor: "pointer" }} className="mt-3 card--eg">
        {data.image ? (
          <Card.Img
            variant="top"
            src={process.env.REACT_APP_IMG_URL_TOK + data.image}
          />
        ) : (
          <Card.Img variant="top" src="http://via.placeholder.com/200" />
        )}
        <Card.Body
          style={{ height: "100%", overflow: "hidden", padding: "10px" }}
        >
          <div>
            {/* Цена: */}
            <span
              style={{
                fontSize: "50px",
                opacity: "0.5",
              }}
            >
              {price}
            </span>
          </div>
          <div>
            <div>
              {/* Рейтинг: */}
              {ratingNew} = {data.rating} _{ratingNew} -{" "}
              {data.ratingAll ? data.ratingAll : data.rating}
            </div>
            {/* <br /> */}
            <div
              className="youtube__v=McF22__Jz_I"
              style={{
                position: "relative",
              }}
            >
              {/* Рейтинг: */}
              <span
                style={{
                  position: "absolute",
                  fontSize: "40px",
                  opacity: "0.5",
                  top: "50%",
                  right: "0",
                  letterSpacing: "-4px",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Рейтинг: */} {ratingNew}{" "}
                {/* {data.rating} {ratingNew} {data.rating} */}
              </span>
              {Array(5)
                .fill(0)
                .map((_, index) =>
                  numberStar >= index + 1 || hoverStar >= index + 1 ? (
                    <span
                      onMouseOver={() => setHoverStar(index + 1)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => handleSubmit(index + 1)}
                      style={{
                        fontWeight: "100",
                        display: "inline-block",
                        fontSize: "35px",
                        color: "orange",
                      }}
                      key={index}
                    >
                      <FillStar />
                    </span>
                  ) : (
                    <span
                      onMouseOver={() => setHoverStar(index + 1)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => handleSubmit(index + 1)}
                      style={{
                        fontWeight: "100",
                        display: "inline-block",
                        fontSize: "35px",
                        color: "orange",
                      }}
                      key={index}
                    >
                      <OutlineStar />
                    </span>
                  )
                )}
            </div>
            {/* <br /> */}
          </div>
          {/* <br /> */}
          <div>
            <strong>
              {strCat} {data.brand.name} {strName}
            </strong>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductItem;
