import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

import { AppContext } from "../../../layout/AppTok/AppContext";
import {
  fetchProdRating,
  createProdRating,
} from "../../../../http/Tok/catalogAPI_Tok";
import { PRODUCT_ROUTE } from "../../../../utils/consts";
// Звезд.Комп.Рейтинга. Пуст./Полн.
import { StarFill } from "../../../layout/AppTok/StarFill";
import { StarOutline } from "../../../layout/AppTok/StarOutline";

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
      // console.log("ProdItm FTH data ", data);
      setVotes(data.votes);
    });
  });
  // созд. Рейтинга в БД
  const handleSubmit = async (rating: number) => {
    if (user.isAuth) {
      await createProdRating(user.id, data.id, rating).then((data) => {
        // console.log("ProdItm CRE data ", data);
        setNuberStar(data.ratingAll);
        setVotes(data.votes);
        catalog.rating = data.ratingAll;
      });
    }
  };

  // логика Сокращ./Обрез./Замены БУКВ/ЦИФР/КАТЕГОРИй
  let strCat = data.category.name;
  // удал.посл.эл.назв.
  strCat = strCat.slice(0, -1);
  if (strCat === "Букв" || strCat === "Амбиграмм" || strCat === "Молекул")
    strCat = strCat + "а";
  if (strCat === "Амбиграмма") strCat = "⇔";
  if (strCat === "Буква") strCat = "¶";
  if (strCat === "Молекула") strCat = "⚙";
  if (strCat === "Геро") {
    // strCat = strCat + "й";
    strCat = "ν";
  }
  if (strCat === "Сердц") {
    // strCat = strCat + "е";
    strCat = "❤";
  }
  if (strCat === "Холодильник") strCat = "❉";
  if (strCat === "Смартфон")
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
    const endStrName = strName.slice(6);
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
    const endStrName = strName.slice(9);
    strName = "4-ая";
    strName += endStrName;
  }
  if (strName.includes(" (копия)")) {
    strName = strName.slice(0, -8);
    strName += " (=+1)";
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
      // с инд.1, удал.0, добав.точку(,)
      priceLet.splice(1, 0, ".");
      // запись в цену скидки(собир.в строку, превращ.в цифру)
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
    // var result11 = num.toLocaleString(); // 1 234 567 890
    // function numberWithSpaces(x: any) {
    //   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    // }
    // numberWithSpaces(1003540) // 1 003 540
  };
  if (priceLet > 1000000) {
    priceLetBM(priceLet);
  }

  return (
    <div
      className="df df-col col-lg-4 col-md-3 col-sm-6"
      // md={3}
      // lg={4}
      // sm={6}
      // onClick={() =>
      //   navigate(
      //     PRODUCT_ROUTE + `/${data.id}`
      // передача props в Комп ч/з navigate/useNavigate/react-router-dom
      // , { state: {userId: data.id,},}
      //   )
      // }
    >
      <Card style={{ cursor: "pointer" }} className="mt-3 card--eg">
        {data.image ? (
          <Card.Img
            variant="top"
            src={process.env.REACT_APP_IMG_URL_PERN + data.image}
            onClick={() => navigate(PRODUCT_ROUTE + `/${data.id}`)}
          />
        ) : (
          <Card.Img variant="top" src="http://via.placeholder.com/200" />
        )}
        <Card.Body
          style={{ height: "100%", overflow: "hidden", padding: "10px" }}
        >
          {/* Цена: */}
          <div className="card--eg__price">
            <span
              style={{
                fontSize: "30px",
              }}
            >
              {/* е/и цена < 100 лимонов то разбиваем по 3 числа */}
              {data.price < 100000000 ? (
                <>{parseFloat(priceLet).toLocaleString()}</>
              ) : (
                <>{priceLet}</>
              )}
            </span>
            <span
              style={{
                fontSize: "20px",
                opacity: "0.5",
                textDecoration: "line-through",
                marginLeft: "10px",
              }}
            >
              {data.price > 1000000 ? (
                <>
                  {data.price < 1000000000 ? (
                    // е/и > 1 лимона но < 1 билиона, берём.сокращ.скидочную цену, умнож.на процент и на 100, округляем до запятой, делим на 100, подставляем М
                    <>
                      {Math.round((priceLetDiscount * 1.35 * 100) / 100) + " M"}
                    </>
                  ) : (
                    // е/и > 1 билиона, берём.сокращ.скидочную цену, умнож.на процент и оставляем 3 знака после запятой, подставляем B
                    <>{(priceLetDiscount * 1.45).toFixed(3) + " B"}</>
                  )}
                </>
              ) : (
                // превращ.в цифру, умнож.на процент, разбиваем по 3 числа - 1 234 567
                <>{(parseFloat(priceLet) * 1.6).toLocaleString()}</>
              )}
            </span>
          </div>
          {/* Рейтинг: */}
          <div
            className="card--eg__pating youtube__v=McF22__Jz_I"
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
                      onFocus={() => setHoverStar(index + 1)}
                      onMouseLeave={() => setHoverStar(0)}
                      // onBlur={() => setHoverStar(0)}
                      onClick={() => handleSubmit(index + 1)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleSubmit(index + 1);
                        }
                      }}
                      role="button"
                      tabIndex={0}
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
                      onFocus={() => setHoverStar(index + 1)}
                      onMouseLeave={() => setHoverStar(0)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleSubmit(index + 1);
                        }
                      }}
                      role="button"
                      tabIndex={0}
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
            {/* Цифра/Голоса */}
            <span
              style={{
                fontSize: "25px",
              }}
            >
              {numberStar} {votes ? <> / {votes}</> : ""}
            </span>
          </div>
          {/* Категор./Бренд/Назв./ */}
          <div className="card--eg__product" style={{ marginTop: "5px" }}>
            <strong>
              {strCat} {data.brand.name} {strName}
            </strong>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductItem;
