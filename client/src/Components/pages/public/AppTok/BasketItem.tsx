const BasketItem = (props: any) => {
  return (
    <tr>
      <td className="txt">{props.name}</td>
      {/* количество/изменить */}
      <td className="df df-jcc df-aic">
        <button
          onClick={() => props.decrement(props.id)}
          className="btn--eg btn-success--eg"
        >
          -
        </button>{" "}
        <strong className="plr-2">{props.quantity}</strong>{" "}
        <button
          onClick={() => props.increment(props.id)}
          className="btn--eg btn-danger--eg"
        >
          +
        </button>
      </td>
      {/* цена */}
      <td className="txt">{props.price}</td>
      {/* сумма */}
      <td className="txt">{props.price * props.quantity}</td>
      <td className="df df-jcc">
        <button
          onClick={() => props.remove(props.id)}
          className="btn--eg btn-danger--eg"
        >
          Удалить
        </button>
      </td>
    </tr>
  );
};

export default BasketItem;
