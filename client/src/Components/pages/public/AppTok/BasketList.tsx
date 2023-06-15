import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Spinner, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import {
  // fetchBasket,
  increment,
  decrement,
  remove,
} from "../../../../http/Tok/basketAPI_Tok";
import { CHECKOUT_ROUTE } from "../../../../utils/consts";
import BasketItem from "./BasketItem";

const BasketList = observer(() => {
  console.log("BasketList 1 ", 1);
  const { basket }: any = useContext(AppContext);
  const [fetching, setFetching] = useState(false);

  const navigate = useNavigate();

  const handleIncrement = (id: number) => {
    setFetching(true);
    increment(id)
      .then((data) => (basket.products = data.products))
      .finally(() => setFetching(false));
  };

  const handleDecrement = (id: number) => {
    setFetching(true);
    decrement(id)
      .then((data) => (basket.products = data.products))
      .finally(() => setFetching(false));
  };

  const handleRemove = (id: number) => {
    setFetching(true);
    remove(id)
      .then((data) => (basket.products = data.products))
      .finally(() => setFetching(false));
  };

  // ^ получ.данн.корзины(сохран.в хран-ще) в AppTok. FetchBasket не нужен
  // useEffect(() => {
  //   fetchBasket()
  //     .then((data) => (basket.products = data.products))
  //     .finally(() => setFetching(false));
  // }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      {basket.count ? (
        <>
          <Table bordered hover size="sm" className="mt-3 table__eg">
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
          <Button onClick={() => navigate(CHECKOUT_ROUTE)}>
            Оформить заказ
          </Button>
        </>
      ) : (
        <p>Ваша корзина пуста</p>
      )}
    </>
  );
});

export default BasketList;
