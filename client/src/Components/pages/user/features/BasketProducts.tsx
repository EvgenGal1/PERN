import React, { memo, useContext } from "react";
import { observer } from "mobx-react-lite";

import { AppContext } from "@/context/AppContext";
import type { BasketProduct } from "@/types/shopping.types";

type QuantityControlProps = {
  onDecrement: () => void;
  onIncrement: () => void;
  quantity: number;
  disabled: boolean;
};

type RemoveButtonProps = {
  onRemove: () => void;
  disabled: boolean;
};

const BasketProducts = observer(() => {
  const { basket } = useContext(AppContext);
  // измен.Кол-во
  const handleIncrement = (id: number) => basket.incrementProduct(id);
  const handleDecrement = (id: number) => basket.decrementProduct(id);
  // удалить
  const handleRemove = (product: BasketProduct) => {
    if (confirm(`Удалить "${product.name}" из корзины?`)) {
      basket.fetchRemoveProduct(product.id);
    }
  };

  return (
    <>
      {basket.products.map((product: BasketProduct) => (
        <tr key={product.id} className="basket-product">
          <td className="product-name tac">{product.name}</td>
          <td className="product-quantity tac">
            <QuantityControl
              onDecrement={() => handleDecrement(product.id)}
              onIncrement={() => handleIncrement(product.id)}
              quantity={product.quantity}
              disabled={basket.isLoading}
            />
          </td>
          <td className="product-price tac">{product.price} руб.</td>
          <td className="product-total tac">
            {(product.price * product.quantity).toFixed(2)} руб.
          </td>
          <td className="product-actions tac">
            <RemoveButton
              onRemove={() => handleRemove(product)}
              disabled={basket.isLoading}
            />
          </td>
        </tr>
      ))}
    </>
  );
});
// кнп.Изменить Кол-во
const QuantityControl = memo(
  ({ onDecrement, onIncrement, quantity, disabled }: QuantityControlProps) => (
    <>
      <button
        onClick={onDecrement}
        disabled={disabled}
        className="quantity-button decrement btn--eg btn-danger--eg tb-cl"
      >
        -
      </button>
      <span className="quantity-value plr-2">{quantity}</span>
      <button
        onClick={onIncrement}
        disabled={disabled}
        className="quantity-button increment btn--eg btn-success--eg tb-cl"
      >
        +
      </button>
    </>
  )
);
// кнп.Удалить
const RemoveButton = memo(({ onRemove, disabled }: RemoveButtonProps) => (
  <button
    onClick={onRemove}
    disabled={disabled}
    className="remove-button btn--eg btn-danger--eg tb-cl"
  >
    Удалить
  </button>
));

export default React.memo(BasketProducts);
