import { Button } from "react-bootstrap";

const BasketItem = (props: any) => {
  return (
    <tr>
      <td className="txt">{props.name}</td>
      {/* количество/изменить */}
      <td className="df df-jcc df-aic">
        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => props.decrement(props.id)}
          className="btn-success--eg"
        >
          -
        </Button>{" "}
        <strong className="plr-2">{props.quantity}</strong>{" "}
        <Button
          variant="danger"
          size="sm"
          onClick={() => props.increment(props.id)}
          className="btn-danger--eg"
        >
          +
        </Button>
      </td>
      {/* цена */}
      <td className="txt">{props.price}</td>
      {/* сумма */}
      <td className="txt">{props.price * props.quantity}</td>
      <td className="df df-jcc">
        <Button
          variant="danger"
          onClick={() => props.remove(props.id)}
          className="btn-danger--eg"
        >
          Удалить
        </Button>
      </td>
    </tr>
  );
};

export default BasketItem;
