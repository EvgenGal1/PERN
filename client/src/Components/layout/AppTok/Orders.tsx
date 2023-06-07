// ^ Многраз.Комп.Заказов
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

import { ADMINORDER_ROUTE, USERORDER_ROUTE } from "../../../utils/consts";

const Orders = (props: any) => {
  if (props.items?.length === 0) {
    return <p>Список заказов пустой</p>;
  }

  return (
    <Table bordered hover size="sm" className="mt-3 table__eg">
      <thead>
        <tr>
          <th>№</th>
          <th>Дата</th>
          <th>Покупатель</th>
          <th>Адрес почты</th>
          <th>Телефон</th>
          <th>Статус</th>
          <th>Сумма</th>
          <th>Подробнее</th>
        </tr>
      </thead>
      <tbody>
        {props.items?.map((item: any) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.prettyCreatedAt}</td>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.phone}</td>
            <td>
              {item.status === 0 && <>Новый</>}
              {item.status === 1 && <>В работе</>}
              {item.status === 2 && <>Завершен</>}
            </td>
            <td>{item.amount}</td>
            <td>
              {props.admin ? (
                <Link to={ADMINORDER_ROUTE + `/${item.id}`}>
                  Подробнее для admin
                </Link>
              ) : (
                <Link to={USERORDER_ROUTE + `/${item.id}`}>Подробнее</Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Orders;
