import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { AppContext } from "@/context/AppContext";
// Звезд.Комп.Рейтинга. Пуст./Полн.
import { StarFill } from "@Comp/ui/Rating/StarFill";
import { StarOutline } from "@Comp/ui/Rating/StarOutline";
import LoadingAtom from "@/Components/ui/loader/LoadingAtom";
// помощники
import { formatPrice } from "@/utils/format";

const Product: React.FC = observer(() => {
  // ID Продукта, Context
  const { id } = useParams();
  const { catalog, user, basket } = useContext(AppContext);

  // наведение на Звёзды
  const [hoverStar, setHoverStar] = useState<number>(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id || isNaN(Number(id))) return;
      if (!catalog.getProductById(Number(id))) {
        await catalog.fetchProductById(Number(id));
      }
    };

    loadProduct();
  }, [id, catalog]);

  useEffect(() => {
    const loadProp = async () => {
      if (!id || isNaN(Number(id))) return;
      const existProp = catalog.getProductById(Number(id));
      if (existProp && !existProp.props) {
        await catalog.fetchProductProps(Number(id));
      }
    };
    loadProp();
  }, [id, catalog, catalog.products]);

  if (catalog.isLoading) return <LoadingAtom />;
  if (!id || isNaN(Number(id))) return <div>Неверный ID продукта</div>;

  const product = catalog.getProductById(Number(id));
  if (!product) return <div>Продукт не найден</div>;

  // созд. Рейтинга в БД
  const handleSubmit = async (rating: number) => {
    if (!user.isAuth || !product) return;
    try {
      await catalog.updateProductRating(user.id!, product.id!, rating);
    } catch (error) {
      console.error("Ошибка при создании Рейтинга:", error);
    }
  };

  // добавить Продукт в Корзину
  const handleClickAddToBasket = () => {
    if (product && product.id) basket.addProduct(product.id);
  };
  return (
    <div className="product container" key={id}>
      <div className="df df-row">
        <div className="mr-3">
          <img
            style={{ width: "300px", height: "300px" }}
            src={`${product?.image ? `${process.env.REACT_APP_IMG_URL_PERN}/img/shop/product/${product?.image}` : "http://via.placeholder.com/300"}`}
          />
        </div>
        {/* Основная информация о продукте */}
        <div className="product-header">
          <h1>{product?.name}</h1>
          <p>Цена: {formatPrice(product.price)} руб.</p>
          <p>Бренд: {product.brand?.name}</p>
          <p>Категория: {product.category?.name}</p>
          {/* Рейтинг Продукта */}
          <p>
            Рейтинг: {product.ratings?.rating ?? 0}
            {product.ratings?.votes
              ? ` / ${product.ratings?.votes || 0} голосов`
              : null}
          </p>
          {/* Звёзды */}
          <div className="stars">
            {Array.from({ length: 5 }).map((_, index) => {
              const currentRating = product!.ratings?.rating || 0;
              const isActive = hoverStar > index || currentRating > index;
              return (
                <span
                  key={index}
                  onMouseEnter={() => setHoverStar(index + 1)}
                  onMouseLeave={() => setHoverStar(0)}
                  onClick={() => handleSubmit(index + 1)}
                  style={{
                    fontSize: "25px",
                    color: isActive ? "orange" : "gray",
                    cursor: "pointer",
                  }}
                >
                  {isActive ? <StarFill /> : <StarOutline />}
                </span>
              );
            })}
          </div>
          {/* кнп.добав.в корзину */}
          <button
            className="btn--eg btn-primary--eg mt-3 press-button"
            onClick={handleClickAddToBasket}
          >
            Добавить в Корзину
          </button>
        </div>
        {/* хар-ки Продукта */}
        {!!product.props?.length && (
          <div className="product-props df df-row">
            <div className="df df-col">
              <h3>Характеристики</h3>
              <table className="table--eg">
                <tbody>
                  {product?.props.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
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
    </div>
  );
});

export default Product;
