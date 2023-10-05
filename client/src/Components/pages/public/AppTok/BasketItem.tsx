const BasketItem = (props: any) => {
  return (
    <tr>
      <td className="txt">{props.name}</td>
      {/* количество/изменить */}
      <td className="txt">
        <button
          onClick={() => props.decrement(props.id)}
          className="btn--eg btn-success--eg tb-cl"
        >
          -
        </button>{" "}
        <strong className="plr-2">{props.quantity}</strong>{" "}
        <button
          onClick={() => props.increment(props.id)}
          className="btn--eg btn-danger--eg tb-cl"
        >
          +
        </button>
      </td>
      {/* цена */}
      <td className="txt">{props.price}</td>
      {/* сумма */}
      <td className="txt">{props.price * props.quantity}</td>
      <td className="txt">
        <button
          onClick={() => props.remove(props.id, props.name)}
          className="btn--eg btn-danger--eg tb-cl"
        >
          Удалить
        </button>
      </td>
    </tr>
  );
};

export default BasketItem;
