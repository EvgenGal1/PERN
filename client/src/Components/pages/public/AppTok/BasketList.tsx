import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Spinner, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import {
  fetchBasket,
  incrementBasket,
  decrementBasket,
  removeBasket,
} from "../../../../http/Tok/basketAPI_Tok";
import { CHECKOUT_ROUTE } from "../../../../utils/consts";
import BasketItem from "./BasketItem";

const BasketList = observer(() => {
  const { basket }: any = useContext(AppContext);
  const [fetching, setFetching] = useState(false);
  console.log("BasketList basket ", basket);

  const navigate = useNavigate();

  // ! заглушка/загрузка данн.корзины. Магиет пустая корзина
  // ^ решил - использ.доп.условн.рендер (fetching)
  useEffect(() => {
    fetchBasket()
      .then((data) => (basket.products = data.products))
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  const handleIncrement = (id: number) => {
    setFetching(true);
    incrementBasket(id)
      .then((data) => {
        console.log("BL incrementBasket data ", data);
        basket.products = data.products;
      })
      .finally(() => setFetching(false));
  };

  const handleDecrement = (id: number) => {
    setFetching(true);
    decrementBasket(id)
      .then((data) => {
        console.log("BL decrementBasket data ", data);
        basket.products = data.products;
      })
      .finally(() => setFetching(false));
  };

  const handleRemove = (id: number) => {
    setFetching(true);
    removeBasket(id)
      .then((data) => {
        console.log("BL removeBasket data ", data);
        basket.products = data.products;
      })
      .finally(() => setFetching(false));
  };

  return (
    <>
      {/* // ! не раб. при перезагр. basket.count сброс на 0, вывод - Ваша корзина пуста. От того что basket|product|count при перезаг в сброс. Решение - 1. Есть заглушка usEf выше (загр.перед.рендер. но есть - мигание); 2. Загр.basket вернуть в App 3. использ.доп.условн.рендер (fetching) */}
      {/* // ^ решил - использ.доп.условн.рендер (fetching) */}
      {basket.count ? (
        <>
          <Table bordered hover size="sm" className="mt-3 table--eg">
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Сумма</th>
                <th>Удалить</th>
              </tr>
            </thead>
            <tbody>
              {basket.products.map((item: any) => (
                <BasketItem
                  key={item.id}
                  increment={handleIncrement}
                  decrement={handleDecrement}
                  remove={handleRemove}
                  {...item}
                />
              ))}
              <tr>
                <th colSpan={3}>Итого</th>
                <th>{basket.sum}</th>
                <th>руб.</th>
              </tr>
            </tbody>
          </Table>
          <Button
            variant="primary"
            onClick={() => navigate(CHECKOUT_ROUTE)}
            className="btn-primary--eg"
          >
            Оформить заказ
          </Button>
        </>
      ) : (
        fetching && <p>Ваша корзина пуста</p>
      )}
    </>
  );
});

export default BasketList;
