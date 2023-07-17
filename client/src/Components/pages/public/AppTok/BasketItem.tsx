import { Button } from "react-bootstrap";

const BasketItem = (props: any) => {
  return (
    <tr>
      <td>{props.name}</td>
      <td>
        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => props.decrement(props.id)}
          className="btn-success--eg"
        >
          -
        </Button>{" "}
        <strong>{props.quantity}</strong>{" "}
        <Button
          variant="danger"
          size="sm"
          onClick={() => props.increment(props.id)}
          className="btn-danger--eg"
        >
          +
        </Button>
      </td>
      <td>{props.price}</td>
      <td>{props.price * props.quantity}</td>
      <td>
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
