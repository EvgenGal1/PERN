import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "@/context/AppContext";
// API/типы
import { ratingAPI } from "@/api/catalog/ratingAPI";
// import { CategoryData, ProductData } from "@/types/api/catalog.types";
import { CategoryData, ProductData } from "../../../../types/api/catalog.types";
// конст.
import { PRODUCT_ROUTE } from "@/utils/consts";
// Звезд.Комп.Рейтинга. Пуст./Полн.
import { StarFill } from "@Comp/layout/AppTok/StarFill";
import { StarOutline } from "@Comp/layout/AppTok/StarOutline";

const ProductItem: React.FC<ProductData> = (data) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [numberStar, setNumberStar] = useState(data.ratings?.rating);
  const [hoverStar, setHoverStar] = useState(0);

  const [votes, setVotes] = useState(data.ratings?.votes || 0); // Обеспечивает правильную инициализацию

  const handleSubmit = async (rating: number) => {
    if (user.isAuth) {
      try {
        const ratingData = await ratingAPI.createProductRating(
          user.id!,
          data.id!,
          rating
        );
        setNumberStar(ratingData.rating);
        setVotes(ratingData.votes);
      } catch (error) {
        console.error("Ошибка при создании рейтинга:", error);
      }
    }
  };

  const formatCategory = (category: CategoryData): JSX.Element | string => {
    // Определим возможные замены категорий
    const replacements: { [key: string]: JSX.Element | string } = {
      Букв: "Буква",
      Амбиграмм: "⇔",
      Молекул: "⚙",
      Геро: "ν",
      Сердц: "❤",
      Холодильник: "❉",
      Смартфон: (
        <svg
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-phone"
          viewBox="0 0 16 16"
        >
          <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      ),
    } as any;

    return replacements[category.name.slice(0, -1)] || category.name;
  };

  const formatName = (name: string): string => {
    const replacements = {
      Первая: "1-ая",
      Вторая: "2-ая",
      Третья: "3-я",
      Четвёртая: "4-ая",
      " (копия)": " (=+1)",
      " (распозн)": " (р)",
      " (запут)": " (з)",
    };

    return Object.entries(replacements).reduce(
      (formattedName, [key, value]) => {
        return formattedName.includes(key)
          ? formattedName.replace(key, value)
          : formattedName;
      },
      name
    );
  };

  const formatPrice = (price: number): string => {
    if (price >= 1e9) return `${(price / 1e9).toFixed(2)} B`;
    if (price >= 1e6) return `${(price / 1e6).toFixed(2)} M`;
    return price.toLocaleString();
  };

  const handleStarMouseEnter = (index: number) => {
    setHoverStar(index + 1);
  };

  const handleStarMouseLeave = () => {
    setHoverStar(0);
  };

  return (
    <div className="df df-col col-lg-4 col-md-3 col-sm-6">
      <div style={{ cursor: "pointer" }} className="mt-3 card--eg">
        <img
          onClick={() => navigate(`${PRODUCT_ROUTE}/${data.id}`)}
          src={
            data.image
              ? `${process.env.REACT_APP_IMG_URL_PERN}img/shop/product/${data.image}`
              : "http://via.placeholder.com/200"
          }
          alt={data.name}
        />
        <div style={{ height: "100%", overflow: "hidden", padding: "10px" }}>
          <div className="card--eg__price">
            <span style={{ fontSize: "30px" }}>{formatPrice(data.price)}</span>
          </div>
          <div
            className="card--eg__rating"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", marginRight: "10px" }}>
              {Array.from({ length: 5 }, (_, index) => {
                const isFilled =
                  numberStar! >= index + 1 || hoverStar >= index + 1;
                return (
                  <span
                    key={index}
                    onMouseOver={() => handleStarMouseEnter(index)}
                    onMouseLeave={handleStarMouseLeave}
                    onClick={() => handleSubmit(index + 1)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      handleSubmit(index + 1)
                    }
                    role="button"
                    tabIndex={0}
                    style={{
                      display: "flex",
                      fontSize: "25px",
                      color: "orange",
                    }}
                  >
                    {isFilled ? <StarFill /> : <StarOutline />}
                  </span>
                );
              })}
            </div>
            <span style={{ fontSize: "25px" }}>
              {numberStar} {votes ? ` / ${votes}` : ""}
            </span>
          </div>
          <div className="card--eg__product" style={{ marginTop: "5px" }}>
            <strong>
              <span>
                {data.category && formatCategory(data.category)}{" "}
                {data.brand && data.brand.name}
                {"  "}
              </span>
              <span>{formatName(data.name)}</span>
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
