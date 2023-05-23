import React, { useContext, useState, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { fetchBasket } from "../../../../http/Tok/basketAPI_Tok";
import BasketItem from "./BasketItem";

const BasketList = observer(() => {
  const { basket }: any = useContext(AppContext);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchBasket()
      .then((data) => (basket.products = data.products))
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      {basket.count ? (
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
              <BasketItem key={item.id} {...item} />
            ))}
            <tr>
              <th colSpan={3}>Итого</th>
              <th>{basket.sum}</th>
              <th>руб.</th>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p>Ваша корзина пуста</p>
      )}
    </>
  );
});

export default BasketList;
