// ^ Проверка Пользователя
import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { authAPI } from "@/api/auth/authAPI";
import { BASKET_ROUTE, USERORDERS_ROUTE } from "@/utils/consts";
import { AppContext } from "@/context/AppContext";
import LoadingAtom from "@/Components/ui/loader/LoadingAtom";
import CheckoutForm from "@/Components/pages/order/CheckoutForm";

const Checkout = () => {
  // Авториз.Корзин. Логика проверки авторизован ли пользователь и есть ли Продукты в корзине
  // ! врем.получ. и в NavBar и в Checkout. Позже перепишется на получ.в App
  const { user, basket } = useContext(AppContext);
  // Заказ. Логика заказа
  const [order, setOrder] = useState(null);

  // загр.Корзин.с услов.проверкой Авториз.
  useEffect(() => {
    if (!basket.count) return;

    const loadData = async () => {
      try {
        await Promise.all([
          basket.loadBasket(),
          user.isAuth ? user.checkAuth() : Promise.resolve(),
        ]);
      } catch (error) {
        console.error("Ошибка загрузки при оформлении Заказа:", error);
      }
    };

    loadData();
  }, [basket, user]);

  // Авториз.Корзин. loader, пока получаем корзину
  if (basket.isLoading) return <LoadingAtom />;

  // переотправка в Корзину если Товаров в Корзине нет
  // ! есть только «Ваша корзина пуста», перенаправления к "Заказ оформлен" нет. Возможно из-за переноса лог.в CheckoutForm
  // if (!basket.count) return <Navigate to={BASKET_ROUTE} replace />;

  // Заказ. Заказ был успешно оформлен
  if (order) {
    return (
      // <OrderSuccess />
      <div className="container">
        <h1 className="mb-4 mt-4">Заказ оформлен</h1>
        <p>Наш менеджер скоро позвонит для уточнения деталей.</p>
        <button className="btn--eg btn-primary--eg">
          <Link className="a0" to={USERORDERS_ROUTE} replace={true}>
            Ваши заказы
          </Link>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Авториз.Корзин. Если корзина пуста — пользователь будет направлен на страницу корзины, где увидит сообщение «Ваша корзина пуста». После того, как заказ был создан, переменная order изменяет свое значение — и пользователь увидит сообщение, что заказ успешно оформлен. */}
      {basket.count === 0 && <Navigate to={BASKET_ROUTE} replace={true} />}
      <h1 className="mb-4 mt-4">Оформление заказа</h1>
      <CheckoutForm
        user={user}
        basket={basket}
        onSuccess={setOrder}
        onOrder={setOrder}
      />
    </>
  );
};

export default Checkout;
