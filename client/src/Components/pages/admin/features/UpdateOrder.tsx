// ^ модальн.окно редактирование Заказа
import { useState } from "react";
import { v4 as uuid } from "uuid";

import { orderAPI } from "@api/shopping/orderAPI";
import FormFieldRecursive__EG from "@Comp/ui/Form/FormFieldRecursive__EG";
import Modal__eg from "@Comp/ui/Modal/Modal__eg";
import UpdateItems from "./UpdateItems";

// fn валид.
const isValid = (value: any) => {
  const result: any = {};
  // const pattern = /^[1-9][0-9]*$/;
  // const patternNam = /^[-а-я]{2,}( [-а-я]{2,}){1,2}*$/;
  const patternEML = /^[a-z0-9._%+-]+@[a-z0-9.-]+.{1,2}[a-z]+$/i;
  const patternPHN = /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d- ]{7,10}$/i;
  for (const key in value) {
    if (key === "name")
      result.name =
        // patternNam.test(value.name.trim());
        value.name.trim() !== "";
    if (key === "email")
      result.email =
        // value.email.trim();
        patternEML.test(value.email.trim());
    if (key === "phone")
      result.phone =
        // value.phone.trim();
        patternPHN.test(value.phone);
    if (key === "address")
      result.address =
        // pattern.test(value.address);
        value.address.trim() !== "";
    if (key === "comment")
      result.comment =
        // pattern.test(value.comment);
        value?.comment; /* ?.trim() */ /* || " " */
  }
  return result;
};

// функция updateItem, которая проходит по всему массиву Items и для каждой хар-ки выполняет подходящий http-запрос. Причем, для каждого http-запроса мы ждем ответ, так что к моменту возврата из функции все хар-ки уже обновились на сервере. И когда мы выполним еще один запрос, чтобы обновить название, цену, категорию и бренд Продукта — то в ответе получим уже обновленные хар-ки.
const updateItems = async (items: any, orderId: any) => {
  for (const item of items) {
    const empty =
      item.name /* .trim() */ === "" || item.value /* .trim() */ === "";
    // если вдруг старая хар-ка оказалась пустая — удалим ее на сервере
    if (empty && item.id) {
      try {
        await orderAPI.deleteItem(orderId, item);
      } catch (error: any) {
        alert(error.response.data.message);
      }
      continue;
    }
    /*
     * Если у объекта item свойство append равно true — это новая хар-ка, ее надо создать.
     * Если у объекта item свойство change равно true — хар-ка изменилась, ее надо обновить.
     * Если у объекта item свойство remove равно true — хар-ку удалили, ее надо удалить.
     */
    if (item.append && !empty) {
      try {
        await orderAPI.createItem(orderId, item);
      } catch (error: any) {
        alert(error.response.data.message);
      }
      continue;
    }
    if (item.change && !item.remove) {
      try {
        await orderAPI.updateItem(orderId, item.id, item);
      } catch (error: any) {
        alert(error.response.data.message);
      }
      continue;
    }
    if (item.remove) {
      try {
        await orderAPI.deleteItem(orderId, item.id);
      } catch (error: any) {
        alert(error.response.data.message);
      }
      continue;
    }
  }
};

// типы
interface Props {
  id: number | string;
  show: boolean;
  // setShow: (show: boolean) => void;
  setChange: () => void;
  setShow: any; // (e: ChangeEvent<HTMLInputElement>) => void;
  orders: any; // { [key: string]: string | number | string[] };
}

const UpdateOrder: React.FC<Props> = (props) => {
  const { id, show, setShow, orders } = props;

  const order2 = {
    name: orders.name.toString(),
    email: orders.email.toString(),
    phone: orders.phone.toString(),
    address: orders.address.toString(),
    comment: orders?.comment == null ? "" : orders?.comment.toString(),
  };
  // данн.Польз-ля по Заказу
  const [value, setValue] = useState(order2);

  const ordItmsMap = orders.items.map((item: any) => {
    // при добавлении новой хар-ки свойство append принимает значение true
    // при изменении старой хар-ки свойство change принимает значение true
    // при удалении старой хар-ки свойство remove принимает значение true

    let itemMap = Object.entries(item);
    itemMap = itemMap.concat([
      ["unique", uuid()],
      ["append", false],
      ["remove", false],
      ["change", false],
    ]);

    return itemMap;
  });

  // Позиции Заказа
  const [items, setItems] = useState(
    // { id: "", name: "", price: "", quantity: "", unique: "" }
    ordItmsMap
  );

  // валидация/ошибки
  const [, setValid] = useState(order2);

  // ^ пока не нужнй код. пробы обн.данн.ч/з Род.Комп.Order
  // useEffect(() => {
  //   // if (id) {  adminGetOne(id).then((data) => {получ.данн.Продукта с БД}) } // ^ упразднено
  //   //     // получ.данн.Продукта с БД
  //   const order = {
  //     name: orders.name.toString(),
  //     email: orders.email.toString(),
  //     phone: orders.phone.toString(),
  //     address: orders.address.toString(),
  //     comment: orders?.comment == null ? "" : orders?.comment.toString(),
  //   };
  //   setValue(order);
  //   setValid(isValid(order));
  //   // setValid(order);
  //   // для удобства работы с хар-ми зададим для каждой уникальный идентификатор и доп.свойства, которые подскажут нам, какой http-запрос на сервер нужно выполнить — добавления, обновления или удаления характеристики
  //   setItems(
  //     orders.items.map((item: any) => {
  //       // при добавлении новой хар-ки свойство append принимает значение true
  //       // при изменении старой хар-ки свойство change принимает значение true
  //       // при удалении старой хар-ки свойство remove принимает значение true
  //       return {
  //         ...item,
  //         unique: uuid(),
  //         append: false,
  //         remove: false,
  //         change: false,
  //       };
  //     })
  //   );
  // }, [
  //   orders.name,
  //   orders.email,
  //   orders.phone,
  //   orders.address,
  //   orders.comment,
  //   orders.items,
  // ]);

  const amount: any = orders.items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (event: any) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    // setValid(isValid(data));
  };

  // ^ врем.откл.req к БД
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    /*
     * На первый взгляд кажется, что переменная correct не нужна, можно обойтись valid, но это не так. Нельзя использовать значение valid сразу после изменения этого значения — ф-ция setValid не изменяет значение состояния мгновенно. Вызов функции лишь означает — React «принял к сведению» наше сообщение, что состояние нужно изменить.
     */
    const correct = isValid(value);
    setValid(correct);

    // если введенные данные прошли проверку — можно отправлять их на сервер
    if (correct.name && correct.email && correct.phone && correct.address) {
      const data = new FormData();
      data.append("name", value.name.trim());
      data.append("email", value.email.trim());
      data.append("phone", value.phone.trim());
      data.append("address", value.address.trim());
      data.append("comment", value.comment.trim());

      // нужно обновить, добавить или удалить характеристики и обязательно дождаться ответа сервера — поэтому функция updateItem() объявлена как async, а в теле функции для выполнения действия с каждой хар-кой используется await
      if (items.length) {
        await updateItems(items, id);
      }
      // adminUpdate(id, data)
      //   .then((data) => {
      //     const order = {
      //       name: data.name,
      //       email: data.email.toString(),
      //       phone: data.phone.toString(),
      //       address: data.address.toString(),
      //       comment: data.comment.toString(),
      //     };
      //     setValue(order);
      //     setValid(isValid(order));
      //     // мы получим актуальные значения хар-тик с сервера, потому что обновление хар-тик завершилось еще до момента отправки этого http-запроса на сервер
      //     setItems(
      //       data.items.map((item: any) => {
      //         return {
      //           ...item,
      //           unique: uuid(),
      //           append: false,
      //           remove: false,
      //           change: false,
      //         };
      //       })
      //     );
      //     // закрываем модальное окно редактирования заказов
      //     setShow(false);
      //     // изменяем состояние компонента списка заказов
      //     setChange((state: any) => !state);
      //   })
      //   .catch((error) => alert(error.response.data.message));
    }
  };
  console.log("handleSubmit ", handleSubmit);

  // ^ рендр.эл. вне корн.эл.React
  // return show ? ReactDOM.createPortal(<div></div>, document.body) : null;

  const header = <>Редактирование Заказа №</>;

  return (
    <Modal__eg
      // closureBoundary={true}
      isOpen={show}
      onClose={setShow}
      header={header}
      body={
        <>
          <>
            {/* // ^ Комп.FFR (ток на масс.) */}
            <FormFieldRecursive__EG
              valueArr={[
                ["name", value.name],
                ["address", value.address],
                [
                  ["email", value.email],
                  ["phone", value.phone],
                ],
                ["comment", value.comment],
              ]}
              handleChange={handleInputChange}
              formClass={"mt-3"}
              label={true}
              legend={"Recursive -  Пользователь"}
            />
          </>
          {/* // ^ Комп.FF (масс.(1ый)(не управ.inpt в > влож.)/объ.(2ой)(раздел.renrder на не/объедин.блоки)) */}
          {/* <div className="uniteddiv df df-row"> */}
          {}
          {/* <FormField__eg
            // handleSubmit={handleSubmit}
            handleChange={handleInputChange}
            valueArr={[
              [
                ["phone", value.phone],
                ["email", value.email],
              ],
              ["comment", value.comment],
            ]}
            valid={valid}
            label={true}
            unionObj={["phone", "email"]}
            // nonField={true}
            legend={"на массиве -  Пользователь"}
            clForm={"mt-3"}
          /> */}
          {/* <FormField__eg
            // handleSubmit={handleSubmit}
            handleChange={handleInputChange}
            valueObj={{ 
              phone: value.phone,
              email: value.email, 
              comment: value.comment,
            }}
            valid={valid}
            label={true}
            unionObj={["phone", "email"]}
            // nonField={true}
            legend={"на объекте - Пользователь"}
            clForm={"mt-3"}
          /> */}
          {/* </div> */}
          {/* Позиции  */}
          <div className="">
            <UpdateItems items={items} setItems={setItems} />
          </div>
          <div className="df df-row df-jcsb df-aic mt-4">
            {/* // ^ сделать проверку на ошб. validationArr/formErrors здесь а не только в FormFieldRecursive */}
            <button
              type="submit"
              className="btn--eg btn-success--eg"
              // блок.кнп. е/и пусты name/address или есть ошб.
              // disabled={
              //   valueArr[0][1] === "" || valueArr[1][1] === "" || !isFormValid
              // }
            >
              Сохранить
            </button>
            <div>
              Сумма : <span className="ff-mn">{amount.toLocaleString()}</span>
            </div>
          </div>
        </>
      }
    />
  );
};

export default UpdateOrder;
