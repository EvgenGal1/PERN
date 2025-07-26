import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "@/context/AppContext";
import BasketTable from "./BasketTable";
import { CHECKOUT_ROUTE } from "@/utils/consts";

const BasketList = observer(() => {
  const { basket } = useContext(AppContext);
  const navigate = useNavigate();

  if (!basket.count) return <EmptyBasket />;

  return (
    <div className="basket-container">
      <BasketTable />
      <CheckoutButton
        isLoading={basket.isLoading}
        onClick={() => navigate(CHECKOUT_ROUTE)}
      />
    </div>
  );
});
// заглушка пустой Корзины
const EmptyBasket = () => <p>Ваша Корзина пуста</p>;
// кнп.Оформить Заказ
const CheckoutButton = ({ isLoading, onClick }) => (
  <button
    onClick={onClick}
    className="checkout-button btn--eg btn-primary--eg mt-3"
    disabled={isLoading}
  >
    {isLoading ? "Обработка..." : "Оформить Заказ"}
  </button>
);

export default BasketList;
