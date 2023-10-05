// ^ Многраз.Комп.Заказа
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import {
  adminGetOne,
  adminDelete,
  userGetOne,
} from "../../../http/Tok/orderAPI_Tok";
import UpdateOrder from "../../layout/AppTok/UpdateOrder";
import { ADMINORDERS_ROUTE, USERORDERS_ROUTE } from "../../../utils/consts";

const Order = (props: any) => {
  const navigate = useNavigate();

  const id = props.data;
  const admin = props.admin;

  // список загруженных заказов
  const [orders, setOrders]: any = useState([]);
  // загрузка списка категорий с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания-редактирования
  const [show, setShow] /* : any */ = useState(false);
  // для обновления списка после добавления, редактирования, удаления — изменяем состояние
  const [change, setChange] = useState(false);
  // id заказа, которую будем редактировать — для передачи в <UpdateOrder id={…} />
  const [orderId, setOrderId]: any = useState(null);
  // признак удалённого Заказа
  const [delOrd, setDelOrd]: any = useState(false);

  const handleUpdateClick = (id: number) => {
    setOrderId(id);
    setShow(true);
  };

  const handleDeleteClick = (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    let confirmDel = confirm(`Удалить Заказ - «${id}»`);
    if (confirmDel) {
      adminDelete(id)
        .then((data: any) => {
          setChange(!change);
          setDelOrd(!delOrd);
          alert(`Заказ «${data.id}» удален`);
        })
        .catch((error: any) => alert(error.response.data.message));
    }
  };

  // usEf Удаления Заказа и перенос на пред.стр.
  useEffect(() => {
    // if (delOrd) navigate(-1); // ^ кратко но менее понятно
    if (admin && delOrd) navigate(ADMINORDERS_ROUTE, { replace: true });
    if (!admin && delOrd) navigate(USERORDERS_ROUTE, { replace: true });
  }, [navigate, admin, delOrd]);

  // usEf Получения Заказ (ADMIN/USER)
  useEffect(() => {
    let authPers: any;
    if (admin) {
      authPers = adminGetOne(id);
    } else {
      authPers = userGetOne(id);
    }
    authPers
      .then((data: any) => {
        console.log("Order data ", data);
        setOrders(data);
      })
      .finally(() => setFetching(false));
  }, [change, id, admin]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <span style={{ marginBottom: "3px", display: "inline-block" }}>
        Дата|Статус
      </span>
      <ul className="list-param--eg">
        <li>
          <p>Дата заказа:</p>{" "}
          <span className="ff-mn">{orders.prettyCreatedAt}</span>
          {orders.prettyCreatedAt !== orders.prettyUpdatedAt
            ? ` | Обновлён: ` + orders.prettyUpdatedAt
            : ""}
        </li>
        <li>
          <p>Статус заказа:</p>
          {orders.status === 0 && <> Новый</>}
          {orders.status === 1 && <> В работе</>}
          {orders.status === 2001 && <> Изменения в Данных</>}
          {orders.status === 2002 && <> Изменения в Позициях</>}
          {orders.status === 2003 && <> Изменения в Данных, Позициях</>}
          {orders.status === 9 && <> Завершен</>}
        </li>
      </ul>
      <span>Данные Заказа № {orders.id}</span>
      <ul className="list-param--eg">
        <li>
          <p>Имя, Фамилия:</p> {orders.name}
        </li>
        <li>
          <p>Адрес почты:</p> {orders.email}
        </li>
        <li>
          <p>Номер телефона:</p> {orders.phone}
        </li>
        <li>
          <p>Адрес доставки:</p> {orders.address}
        </li>
        {orders.comment ? (
          <li>
            <p>Комментарий:</p> {orders.comment}
          </li>
        ) : (
          ""
        )}
      </ul>
      {/* Модалка ред.Заказа */}
      <UpdateOrder
        id={orderId}
        show={show}
        setShow={setShow}
        setChange={setChange}
        admin={admin}
      />
      {/* ПОЗИЦИИ Заказа */}
      <span style={{ marginBottom: "3px", display: "inline-block" }}>
        Позиции Заказа № {orders.id}
      </span>
      <table className="table--eg">
        <thead>
          <tr>
            <th>Название позиции</th>
            <th>Цена</th>
            <th>Кол-во</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          {orders.items.map((item: any) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td className=" ff-mn">{item.price.toLocaleString()}</td>
              <td className=" ff-mn">{item.quantity}</td>
              <td className=" ff-mn">
                {(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          ))}
          <tr id="th--eg">
            <td colSpan={3} style={{ fontWeight: "bold" }}>
              Итого
            </td>
            <td className="col-bl ff-mn">{orders.amount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      {/* КНП Редакт./Удалить */}
      <div className="df df-row mb-3">
        <button
          onClick={() => handleUpdateClick(orders.id)}
          className="btn--eg btn-success--eg mt-3"
        >
          Редактировать
        </button>
        <button
          onClick={() => handleDeleteClick(orders.id)}
          className="btn--eg btn-danger--eg mt-3 mlr-3"
        >
          Удалить
        </button>
      </div>
    </>
  );
};

export default Order;
