import { useContext } from "react";

import { observer } from "mobx-react-lite";

import BasketProducts from "./BasketProducts";
import { AppContext } from "@/context/AppContext";

// основ.табл.
const BasketTable = observer(() => {
  const { basket } = useContext(AppContext);
  return (
    <table className="basket-table mt-3 table--eg">
      <thead>
        <tr>
          <th>Наименование</th>
          <th>Количество</th>
          <th>Цена</th>
          <th>Сумма</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <BasketProducts />
        <tr className="total-row">
          <th colSpan={3}>Итого</th>
          <th>{basket.sum.toFixed(2)} руб</th>
          <th></th>
        </tr>
      </tbody>
    </table>
  );
});

export default BasketTable;
