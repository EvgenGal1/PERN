// ^ Многраз.Комп.Заказа
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { orderAPI } from "@api/shopping/orderAPI";
import { ADMINORDERS_ROUTE, USERORDERS_ROUTE } from "@/utils/consts";
import UpdateOrder from "@Comp/pages/admin/features/UpdateOrder";

const Order = (props: any) => {
  const navigate = useNavigate();

  const id = props.data;
  const { admin = false } = props;

  // список загруженных заказов
  const [orders, setOrders]: any = useState([]);
  // загрузка списка категорий с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания-редактирования
  const [show, setShow] /* : any */ = useState(false);
  // для обновления списка после добавления, редактирования, удаления — изменяем состояние
  const [change, setChange] = useState(false);
  // id заказа, которую будем редактировать — для передачи в <UpdateOrder id={…} />
  const [orderId, setOrderId] = useState<number | null>(null);
  // признак удалённого Заказа
  const [delOrd, setDelOrd]: any = useState(false);
  // ошибка
  const [error, setError] = useState(null);
  console.log("orderId ", orderId);

  // Редактирование Заказа
  const handleUpdateClick = (id: number) => {
    setOrderId(id);
    setShow(true);
  };

  // Удаления Заказа
  const handleDeleteClick = (id: number) => {
    const confirmDel = confirm(`Удалить Заказ - «${id}»`);
    if (confirmDel) {
      orderAPI
        .deleteOrder(id)
        .then((data: any) => {
          setChange(!change);
          setDelOrd(!delOrd);
          alert(`Заказ «${data.id}» удален`);
        })
        .catch((error: any) => alert(error.response.data.message));
    }
  };

  // перенос на пред.стр. при удал.Заказа
  useEffect(() => {
    // if (delOrd) navigate(-1); // ^ кратко но менее понятно
    if (admin && delOrd) navigate(ADMINORDERS_ROUTE, { replace: true });
    if (!admin && delOrd) navigate(USERORDERS_ROUTE, { replace: true });
  }, [navigate, admin, delOrd]);

  // Получения Заказ (ADMIN/USER)
  useEffect(() => {
    let authPers: any;
    if (admin) {
      authPers = orderAPI.getOneOrder(id);
    } else {
      authPers = orderAPI.getOneOrder(id);
    }
    authPers
      .then((data: any) => {
        console.log("Order data ", data);
        setOrders(data);
      })
      .catch((error: any) => setError(error.response.data.message)) // alert(error.response.data.message))
      .finally(() => setFetching(false));
  }, [change, id, admin]);

  // заглушки для Загрузки/Ошибки
  if (fetching) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {/* Дата/Статус */}
      <div>
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
      </div>
      {/* Получатель */}
      <div>
        <span>Данные Получателя</span>
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
      </div>
      {/* Заказ */}
      <div>
        {/* Шапка Табл.Заказов */}
        <span style={{ marginBottom: "3px", display: "inline-block" }}>
          Позиции Заказа № {orders.id}
        </span>
        {/* ПОЗИЦИИ Заказа */}
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
      </div>
      {/* КНП Редакт./Удалить */}
      <div className="df df-row mt-3 mb-3">
        <button
          onClick={() => handleUpdateClick(/* orders. */ id)}
          className="btn--eg btn-success--eg"
        >
          Редактировать
        </button>
        <button
          onClick={() => handleDeleteClick(/* orders. */ id)}
          className="btn--eg btn-danger--eg mlr-3"
        >
          Удалить
        </button>
      </div>
      {/* Модалка ред.Заказа */}
      {show && (
        <UpdateOrder
          id={/* orderI */ id}
          show={show}
          setShow={setShow}
          setChange={() => setChange(!change)}
          orders={orders}
          // admin={admin}
        />
      )}
    </>
  );
};

export default Order;
