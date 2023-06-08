// ^ Многраз.Комп.Заказа
import { useState, useEffect, useContext } from "react";
import { Table, Button } from "react-bootstrap";

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
  console.log("CLT ord props ", props);

  // список загруженных заказов
  const [orders, setOrders]: any = useState(null);
  // загрузка списка категорий с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания-редактирования
  const [show, setShow]: any = useState(false);
  // модальное окно создания товара
  const [createShow, setCreateShow] = useState(false);
  // модальное окно редактирования
  const [updateShow, setUpdateShow] = useState(false);
  // для обновления списка после добавления, редактирования, удаления — изменяем состояние
  const [change, setChange] = useState(false);
  // id категории, которую будем редактировать — для передачи в <UpdateCategory id={…} />
  const [orderId, setOrderId]: any = useState(null);

  const handleUpdateClick = (id: any) => {
    setOrderId(id);
    // setShow(true);
    setUpdateShow(true);
    // adminGetOne(id);
    // alert(`Заказ «» удален`);
  };

  const handleDeleteClick = (id: any) => {
    // alert(`Заказ «${data.id}» удален`);
    adminGetOne(id);
    alert(`Заказ «» удален`);
    // adminDelete(id)
    //   .then((data: any) => {
    //     setChange(!change);
    //     alert(`Заказ «${data.id}» удален`);
    //   })
    //   .catch((error: any) => alert(error.response.data.message));
  };

  useEffect(() => {
    adminGetAll()
      .then((data: any) => setOrders(data))
      .finally(() => setFetching(false));
  }, [change]);

  return (
    <>
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
      {/*  */}
      {/* <EditOrder
        id={orderId}
        show={show}
        setShow={setShow}
        setChange={setChange}
      /> */}
      {/* <CreateOrder
        show={createShow}
        setShow={setCreateShow}
        setChange={setChange}
      /> */}
      <UpdateOrder
        id={orderId}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
      />
      {/*  */}
      <Table bordered hover size="sm" className="mt-3 table__eg">
        <thead>
          <tr>
            <th>Название</th>
            <th>Цена</th>
            <th>Кол-во</th>
            <th>Сумма</th>
            <th>Редактировать</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {props.data.items.map((item: any) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.price * item.quantity}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleUpdateClick(item.id)}
                >
                  Редактировать
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(item.id)}
                >
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}>Итого</td>
            <td>{props.data.amount}</td>
            <td colSpan={2}> </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default Order;

// // ^ Многраз.Комп.Заказа
// import { useState, useEffect, useContext } from "react";
// import { Table, Button } from "react-bootstrap";

// export const adminGetAll = async () => {
// // import {
// //   adminGetAll,
// //   adminGetOne,
// //   adminUpdate,
// //   adminDelete
// // } from "../../../http/Tok/orderAPI_Tok";
// // import EditCategory from "../../layout/AppTok/EditCategory";

// const Order = (props: any) => {
//   console.log("CLT ord props ", props);

//   // // список загруженных категорий
//   // const [orders, setOrders]: any = useState(null);
//   // // загрузка списка категорий с сервера
//   // const [fetching, setFetching] = useState(true);
//   // // // модальное окно создания категории
//   // // const [createShow, setCreateShow] = useState(false);
//   // // // модальное окно редактирования
//   // // const [updateShow, setUpdateShow] = useState(false);
//   // // модальное окно создания-редактирования
//   // const [show, setShow]: any = useState(false);
//   // // для обновления списка после добавления, редактирования, удаления — изменяем состояние
//   // const [change, setChange] = useState(false);
//   // // id категории, которую будем редактировать — для передачи в <UpdateCategory id={…} />
//   // const [categoryId, setCategoryId]: any = useState(null);

//   // const handleUpdateClick = (id: any) => {
//   //   setCategoryId(id);
//   //   setShow(true);
//   // };

//   // const handleDeleteClick = (id: any) => {
//   //   adminDelete(id)
//   //     .then((data:any) => {
//   //       setChange(!change);
//   //       alert(`Категория «${data.name}» удалена`);
//   //     })
//   //     .catch((error:any) => alert(error.response.data.message));
//   // };

//   // useEffect(() => {
//   //   adminGetAll()
//   //     .then((data:any) => setOrders(data))
//   //     .finally(() => setFetching(false));
//   // }, [change]);

//   return (
//     <>
//       ord
//       <ul>
//         <li>
//           Дата заказа: {props.data.prettyCreatedAt}
//           {props.data.prettyCreatedAt !== props.data.prettyUpdatedAt
//             ? ` | Обновлён: ` + props.data.prettyUpdatedAt
//             : ""}
//         </li>
//         <li>
//           Статус заказа:
//           {props.data.status === 0 && <span> Новый</span>}
//           {props.data.status === 1 && <span> В работе</span>}
//           {props.data.status === 2 && <span> Завершен</span>}
//         </li>
//       </ul>
//       <ul>
//         <li>Имя, Фамилия: {props.data.name}</li>
//         <li>Адрес почты: {props.data.email}</li>
//         <li>Номер телефона: {props.data.phone}</li>
//         <li>Адрес доставки: {props.data.address}</li>
//         <li>Комментарий: {props.data.comment}</li>
//       </ul>
//       <Table bordered hover size="sm" className="mt-3 table__eg">
//         <thead>
//           <tr>
//             <th>Название</th>
//             <th>Цена</th>
//             <th>Кол-во</th>
//             <th>Сумма</th>
//             {/* <th>Редактировать</th>
//             <th>Удалить</th> */}
//           </tr>
//         </thead>
//         <tbody>
//           {props.data.items.map((item: any) => (
//             <tr key={item.id}>
//               <td>{item.name}</td>
//               <td>{item.price}</td>
//               <td>{item.quantity}</td>
//               <td>{item.price * item.quantity}</td>
//               {/* <td>
//                 <Button
//                   variant="success"
//                   size="sm"
//                   // onClick={() => alert("Редактирование категории")}
//                   onClick={() => handleUpdateClick(item.id)}
//                 >
//                   Редактировать
//                 </Button>
//               </td>
//               <td>
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   // onClick={() => alert("Удаление категории")}
//                   onClick={() => handleDeleteClick(item.id)}
//                 >
//                   Удалить
//                 </Button>
//               </td> */}
//             </tr>
//           ))}
//           <tr>
//             <td colSpan={3}>Итого</td>
//             <td>{props.data.amount}</td>
//           </tr>
//         </tbody>
//       </Table>
//     </>
//   );
// };

// export default Order;
