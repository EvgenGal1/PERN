import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col } from "react-bootstrap";

import { PRODUCT_ROUTE } from "../../../../utils/consts";
import { updateProduct } from "../../../../http/Tok/catalogAPI_Tok";

const OutlineStar = () => {
  const OutlineStar = "☆";
  return <span>{OutlineStar}</span>;
};
const FillStar = () => {
  const FillStar = "★";
  return <span>{FillStar}</span>;
};

const ProductItem = ({ data }: any) => {
  const navigate = useNavigate();
  console.log("000 data 000 ", data);

  const isValid = (value: any) => {
    console.log("isVal 123 ", 123);
    const result: any = {};
    const pattern = /^[1-5][0-5]*$/;
    console.log("isVal value 000 ", value);
    // for (let key in value) {
    // console.log("isVal key ", key);
    // console.log("isVal value ", value);
    // if (key === "name") result.name = value.name.trim() !== "";
    // if (key === "price") result.price = pattern.test(value.price.trim());
    if (value > 0) result.rating = value;
    // if (key === "category") result.category = pattern.test(value.category);
    // if (key === "brand") result.brand = pattern.test(value.brand);
    // }
    console.log("isVal result ", result);
    return result;
  };

  const [numberStar, setNmberStar] = useState(data.rating);
  console.log("0 numberStar ", numberStar);
  console.log("0 data.rating ", data.rating);
  const [hoverStar, setHoverStar] = useState(0);

  const handleSubmit = async (/* event: any */) => {
    // event.preventDefault();
    console.log("CLK numberStar ", numberStar);
    console.log("CLK data.rating ", data.rating);

    const correct = isValid(numberStar);
    if (correct.rating) {
      const prod = {
        name: data.name,
        price: data.price.toString(),
        // rating: data.rating.toString(),
        rating: numberStar.toString(),
        category: data.categoryId.toString(),
        brand: data.brandId.toString(),
      };
      console.log("prod ", prod);

      updateProduct(data.id, prod)
        .then((data) => {
          console.log("data ", data);
          // изменяем состояние компонента списка товаров
          // setChange((state: any) => !state);
        })
        .catch((error) => alert(error.response.data.message));
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
      onClick={() => navigate(PRODUCT_ROUTE + `/${data.id}`)}
    >
      <Card style={{ cursor: "pointer" }} className="mt-3 card__eg">
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
        <Card.Body style={{ height: "100%", overflow: "hidden" }}>
          <div>
            {/* Цена: */} <span>{data.price}</span>
          </div>
          <div>
            <div>
              {/* Рейтинг: */}★★★★★ <span>{data.rating}</span>
            </div>
            <br />
            <div className="youtube__McF22__Jz_I">
              {Array(5)
                .fill(0)
                .map((_, index) =>
                  numberStar >= index + 1 || hoverStar >= index + 1 ? (
                    <span
                      onMouseOver={() => setHoverStar(index + 1)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => (setNmberStar(index + 1), handleSubmit())}
                      // onClick={() => handleSubmit()}
                      style={{ fontSize: "35px", color: "orange" }}
                      key={index}
                    >
                      <FillStar />
                    </span>
                  ) : (
                    <span
                      onMouseOver={() => setHoverStar(index + 1)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => (setNmberStar(index + 1), handleSubmit())}
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
