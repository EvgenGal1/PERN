// ^ Многраз.Комп.Заказа
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Row, Col, Pagination } from "react-bootstrap";

import {
  adminGetOne,
  adminDelete,
  userGetOne,
} from "../../../http/Tok/orderAPI_Tok";
import UpdateOrder from "../../layout/AppTok/UpdateOrder";
import { ADMINORDER_ROUTE, USERORDER_ROUTE } from "../../../utils/consts";

// количество Заказов на страницу
const ADMIN_PER_PAGE = 8;

const Order = (props: any) => {
  const navigate = useNavigate();

  const id = props.data;
  const auth = props.admin;

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

  // // текущая страница списка Заказов
  // const [currentPage, setCurrentPage] = useState(1);
  // // сколько всего страниц списка Заказов
  // const [totalPages, setTotalPages] = useState(1);
  // // обработчик клика по номеру страницы
  // const handlePageClick = (page: any) => {
  //   setCurrentPage(page);
  //   setFetching(true);
  // };
  // // содержимое компонента <Pagination>
  // const pages: any = [];
  // for (let page = 1; page <= totalPages; page++) {
  //   pages.push(
  //     <Pagination.Item
  //       key={page}
  //       active={page === currentPage}
  //       activeLabel=""
  //       onClick={() => handlePageClick(page)}
  //     >
  //       {page}
  //     </Pagination.Item>
  //   );
  // }

  const handleUpdateClick = (id: any) => {
    setOrderId(id);
    setShow(true);
  };

  const handleDeleteClick = (id: any) => {
    adminDelete(id)
      .then((data: any) => {
        setChange(!change);
        setDelOrd(!delOrd);
        alert(`Заказ «${data.id}» удален`);
      })
      .catch((error: any) => alert(error.response.data.message));
  };

  // usEf Удаления Заказа и перенос на пред.стр.
  useEffect(() => {
    // if (delOrd) navigate(-1); // ^ кратко но менее понятно
    if (auth && delOrd) navigate(ADMINORDER_ROUTE, { replace: true });
    if (!auth && delOrd) navigate(USERORDER_ROUTE, { replace: true });
  }, [navigate, auth, delOrd]);

  // usEf Получения Заказ (ADMIN/USER)
  useEffect(() => {
    let authPers: any;
    if (auth) {
      authPers = adminGetOne(id);
    } else {
      authPers = userGetOne(id);
    }
    authPers
      .then((data: any) => {
        setOrders(data);
      })
      .finally(() => setFetching(false));
  }, [change, id, auth]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <span style={{ marginBottom: "3px", display: "inline-block" }}>
        Дата|Статус
      </span>
      <ul className="list-param__eg">
        <li>
          <p>Дата заказа:</p> {orders.prettyCreatedAt}
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
      <ul className="list-param__eg">
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
        auth={auth}
      />
      {/* КНП Редакт./Удалить */}
      <Row className="mb-3">
        <Col>
          <Button
            variant="success"
            size="sm"
            onClick={() => handleUpdateClick(orders.id)}
            style={{ marginRight: "15px" }}
            className="btn-success__eg"
          >
            Редактировать
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteClick(orders.id)}
            className="btn-danger__eg"
          >
            Удалить
          </Button>
        </Col>
      </Row>
      {/* ПОЗИЦИИ Заказа */}
      <span style={{ marginBottom: "3px", display: "inline-block" }}>
        Позиции Заказа № {orders.id}
      </span>
      <Table bordered hover size="sm" className="table__eg">
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
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.price * item.quantity}</td>
            </tr>
          ))}
          <tr id="th__eg">
            <td colSpan={3} style={{ fontWeight: "bold" }}>
              Итого
            </td>
            <td style={{ fontWeight: "bold" }}>{orders.amount}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default Order;
