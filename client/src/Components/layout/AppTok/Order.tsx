// ^ Многраз.Комп.Заказа
import { useState, useEffect } from "react";
import { Table, Button, Spinner, Row, Col } from "react-bootstrap";

import {
  adminGetAll,
  adminGetOne,
  adminUpdate,
  adminDelete,
} from "../../../http/Tok/orderAPI_Tok";
import EditOrder from "../../layout/AppTok/EditOrder";
// import CreateOrder from "../../layout/AppTok/CreateOrder";
import UpdateOrder from "../../layout/AppTok/UpdateOrder";

const Order = (props: any) => {
  // список загруженных заказов
  const [orders, setOrders]: any = useState([]);
  // загрузка списка категорий с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания-редактирования
  const [show, setShow] /* : any */ = useState(false);
  // // модальное окно создания товара
  // const [createShow, setCreateShow] = useState(false);
  // // модальное окно редактирования
  // const [updateShow, setUpdateShow] = useState(false);
  // для обновления списка после добавления, редактирования, удаления — изменяем состояние
  const [change, setChange] = useState(false);
  // id заказа, которую будем редактировать — для передачи в <UpdateOrder id={…} />
  const [orderId, setOrderId]: any = useState(null);
  // текущая страница списка товаров
  // const [currentPage, setCurrentPage] = useState(1);
  // // сколько всего страниц списка товаров
  // const [totalPages, setTotalPages] = useState(1);

  const handleUpdateClick = (id: any) => {
    setOrderId(id);
    setShow(true);
  };

  const handleDeleteClick = (id: any) => {
    // alert(`Заказ «${data.id}» удален`);
    // adminGetOne(id);
    // alert(`Заказ «» удален`);
    adminDelete(id)
      .then((data: any) => {
        setChange(!change);
        alert(`Заказ «${data.id}» удален`);
      })
      .catch((error: any) => alert(error.response.data.message));
  };

  useEffect(() => {
    adminGetAll()
      .then((data: any) => {
        setOrders(data);
      })
      .finally(() => setFetching(false));
  }, [change]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      ORD
      <ul>
        <li>
          Дата заказа: {props.data.prettyCreatedAt}
          {props.data.prettyCreatedAt !== props.data.prettyUpdatedAt
            ? ` | Обновлён: ` + props.data.prettyUpdatedAt
            : ""}
        </li>
        <li>
          Статус заказа:
          {props.data.status === 0 && <span> Новый</span>}
          {props.data.status === 1 && <span> В работе</span>}
          {props.data.status === 2 && <span> Завершен</span>}
        </li>
      </ul>
      <ul>
        <li>Имя, Фамилия: {props.data.name}</li>
        <li>Адрес почты: {props.data.email}</li>
        <li>Номер телефона: {props.data.phone}</li>
        <li>Адрес доставки: {props.data.address}</li>
        <li>Комментарий: {props.data.comment}</li>
      </ul>
      {/* Модалка ред.Заказа */}
      <UpdateOrder
        id={orderId}
        show={show}
        setShow={setShow}
        setChange={setChange}
      />
      {/* КНП Редакт./Удалить */}
      <Row className="mb-3">
        <Col>
          <Button
            variant="success"
            size="sm"
            onClick={() => handleUpdateClick(props.data.id)}
            style={{ marginRight: "15px" }}
          >
            Редактировать
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteClick(props.data.id)}
          >
            Удалить
          </Button>
        </Col>
      </Row>
      {/*  */}
      <Table bordered hover size="sm" className="mt-3 table__eg">
        <thead>
          <tr>
            <th>Название</th>
            <th>Цена</th>
            <th>Кол-во</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          {props.data.items.map((item: any) => (
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
            <td style={{ fontWeight: "bold" }}>{props.data.amount}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default Order;
