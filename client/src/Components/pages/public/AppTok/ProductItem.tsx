import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";
import {
  fetchProdRating,
  createProdRating,
} from "../../../../http/Tok/catalogAPI_Tok";
import { PRODUCT_ROUTE } from "../../../../utils/consts";

// Звезд.Комп.Рейтинга. Пуст./Полн.
const OutlineStar = () => {
  const OutlineStar = <span>☆</span>;
  return OutlineStar;
};
const FillStar = () => {
  const FillStar = <span>★</span>;
  return FillStar;
};

const ProductItem = ({ data }: any) => {
  const { catalog, user }: any = useContext(AppContext);
  const navigate = useNavigate();

  // сост.Рейтинга, наведения на него, кол-во головов из БД
  const [numberStar, setNuberStar] = useState(data.rating);
  const [hoverStar, setHoverStar] = useState(0);
  const [votes, setVotes] = useState(0);

  // загр.Рейтинга из БД для голосов
  useEffect(() => {
    fetchProdRating(data.id).then((data: any) => {
      // console.log("ProdItm data ", data);
      setVotes(data.votes);
    });
  });
  // созд. Рейтинга в БД
  const handleSubmit = async (rating: number) => {
    if (user.isAuth) {
      await createProdRating(user.id, data.id, rating).then((data) => {
        setNuberStar(data.ratingAll);
        setVotes(data.votes);
        catalog.rating = data.ratingAll;
      });

      // ^ менять Рейтинг ч/з UpdProd (нет доступов для role USER)
      // * Обощёл доступ для USER в БД
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

  // логика Сокращ./Обрез./Замены БУКВ/ЦИФР/КАТЕГОРИй
  let strCat = data.category.name;
  // удал.посл.эл.назв.
  strCat = strCat.slice(0, -1);
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
  let priceLet = data.price.toString();
  // перем.СКИДКИ для Больших цен
  let priceLetDiscount: any = "";
  const priceLetBM = (priceLetBM: any) => {
    priceLet = priceLetBM.toString();
    // для цены больше 1 Биллиона
    if (priceLet > 1000000000) {
      // ! не раб. split + splice + join. приходится разбивать
      // находим кол-во 0, вставл.в конце " B"(биллион)
      // priceLet = priceLet.replace(/000000$/g, "");
      // убираем послед.8 знаков
      priceLet = priceLet.slice(0, -6);
      // разбив.на массив
      priceLet = priceLet.split("");
      // с инд.1, удал.0, добав.запятую(,)
      priceLet.splice(1, 0, ".");
      // запись в цену скидки
      priceLetDiscount = priceLet.join("");
      priceLetDiscount = parseFloat(priceLetDiscount);
      // превращ.в строку вставл.в конце " B"
      priceLet = priceLet.join("") + " B";
      // priceLet = Math.round(priceLet * 1.35);
    }
    // для цены больше 1 Миллиона
    if (priceLet > 1000000) {
      priceLet = priceLet.slice(0, -6);
      priceLetDiscount = +priceLet;
      priceLet = priceLet + " M";
    }
    // ^ доп.разбиение на 3 цифры
    // var num = 1234567890;
    // var result11 = num.toLocaleString(); // 1 234 567 890
    // function numberWithSpaces(x: any) {
    //   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    // }
    // numberWithSpaces(1003540) // 1 003 540
  };
  if (priceLet > 1000000) {
    priceLetBM(priceLet);
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
          {/* Цена: */}
          <div>
            <span
              style={{
                fontSize: "30px",
                opacity: "0.5",
              }}
            >
              {priceLet}
            </span>
            <span
              style={{
                fontSize: "20px",
                opacity: "0.5",
                textDecoration: "line-through",
                marginLeft: "10px",
              }}
            >
              {data.price < 1000000 ? (
                Math.round(data.price * 1.35)
              ) : (
                <>{priceLetDiscount * 1.5}</>
              )}
            </span>
          </div>
          {/* Рейтинг: */}
          <div
            className="youtube__v=McF22__Jz_I"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Звёзды */}
            <div style={{ display: "flex", marginRight: "10px" }}>
              {Array(5)
                .fill(0)
                .map((_, index) =>
                  numberStar >= index + 1 || hoverStar >= index + 1 ? (
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
                      <FillStar />
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
                      <OutlineStar />
                    </span>
                  )
                )}
            </div>
            {/* Цифра/Голоса */}
            <span
              style={{
                fontSize: "25px",
                opacity: "0.5",
              }}
            >
              {numberStar} {votes ? <> / {votes}</> : ""}
            </span>
          </div>
          {/* Категор./Бренд/Назв./ */}
          <div style={{ marginTop: "5px" }}>
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
