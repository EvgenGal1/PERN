// ^ Многраз.Комп.Заказов
import { Link } from "react-router-dom";
import { ADMINORDERS_ROUTE, USERORDERS_ROUTE } from "@/utils/consts";
import { formatTimeStr } from "@/utils/format";

const Orders = (props: any) => {
  if (props?.items?.length === 0 || !props.items) {
    return <p>Список заказов пустой</p>;
  }

  return (
    <>
      <table className="mt-3 table--eg">
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
          {props?.items?.rows.map((item: any) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{formatTimeStr(item.createdAt)}</td>
              <td>{item.username}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>
                {item.status === 0 && <> Новый</>}
                {item.status === 1 && <> В работе</>}
                {item.status === 2001 && <> Изменения в Данных</>}
                {item.status === 2002 && <> Изменения в Позициях</>}
                {item.status === 2003 && <> Изменения в Данных, Позициях</>}
                {item.status === 9 && <> Завершен</>}
              </td>
              <td>{item.amount}</td>
              <td>
                {props.admin ? (
                  <Link to={ADMINORDERS_ROUTE + `/${item.id}`}>
                    Подробнее о Заказе для ADMIN
                  </Link>
                ) : (
                  <Link to={USERORDERS_ROUTE + `/${item.id}`}>
                    Подробнее о Заказе
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Orders;
