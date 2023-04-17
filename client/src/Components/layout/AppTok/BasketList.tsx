import { useContext } from "react";
import { Table } from "react-bootstrap";

import { AppContext } from "./AppContext";
import BasketItem from "./BasketItem";

const BasketList = () => {
  const { basket }: any = useContext(AppContext);
  // общая стоимость товаров в корзине
  const cost = basket.reduce(
    (sum: any, item: any) => sum + item.price * item.quantity,
    0
  );
  return (
    <>
      {basket.length ? (
        <Table bordered hover size="sm" className="mt-3">
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
            {basket.map((item: any) => (
              <BasketItem key={item.product_id} {...item} />
            ))}
            <tr>
              <th colSpan={3}>Итого</th>
              <th>{cost}</th>
              <th>руб.</th>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p>Ваша корзина пуста</p>
      )}
    </>
  );
};

export default BasketList;
