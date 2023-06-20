// ^ Многраз.Комп.Заказов
// import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

// import {
//   adminGetAll,
//   adminGetOne,
//   adminUpdate,
//   adminDelete,
// } from "../../../http/Tok/orderAPI_Tok";
// import UpdateOrder from "../../layout/AppTok/UpdateOrder";
import { ADMINORDER_ROUTE, USERORDER_ROUTE } from "../../../utils/consts";

const Orders = (props: any) => {
  // список загруженных заказов
  // const [orders, setOrders]: any = useState([]);
  // загрузка списка категорий с сервера
  // const [fetching, setFetching] = useState(true);
  // модальное окно создания-редактирования
  // const [show, setShow] /* : any */ = useState(false);
  // для обновления списка после добавления, редактирования, удаления — изменяем состояние
  // const [change, setChange] = useState(false);
  // id заказа, которую будем редактировать — для передачи в <UpdateOrder id={…} />
  // const [orderId, setOrderId]: any = useState(null);

  // useEffect(() => {
  //   adminGetAll()
  //     .then((data: any) => {
  //       setOrders(data);
  //     })
  //     .finally(() => setFetching(false));
  // }, [change]);

  if (props.items?.length === 0) {
    return <p>Список заказов пустой</p>;
  }

  // const handleUpdateClick = (id: any) => {
  //   setOrderId(id);
  //   setShow(true);
  // };

  // const handleDeleteClick = (id: any) => {
  //   adminGetOne(id);
  //   alert(`Заказ «» удален`);
  // };

  // if (fetching) {
  //   return <Spinner animation="border" />;
  // }

  return (
    <>
      ordS
      {/* <UpdateOrder
        id={orderId}
        // show={updateShow}
        // setShow={setUpdateShow}
        show={show}
        setShow={setShow}
        setChange={setChange}
      /> */}
      {/*  */}
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
                  <Link to={ADMINORDER_ROUTE + `/${item.id}`}>
                    Подробнее для admin
                  </Link>
                ) : (
                  <Link to={USERORDER_ROUTE + `/${item.id}`}>
                    Подробнее для user
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Orders;
