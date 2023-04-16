const BasketItem = (props) => {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.quantity}</td>
      <td>{props.price}</td>
      <td>{props.price * props.quantity}</td>
      <td>Удалить</td>
    </tr>
  );
};

export default BasketItem;
