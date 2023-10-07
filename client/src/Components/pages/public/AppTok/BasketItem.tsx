const BasketItem = (props: any) => {
  return (
    <tr>
      <td className="tac">{props.name}</td>
      {/* количество/изменить */}
      <td className="tac">
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
      <td className="tac">{props.price}</td>
      {/* сумма */}
      <td className="tac">{props.price * props.quantity}</td>
      <td className="tac">
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
