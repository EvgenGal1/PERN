// ^ модальн.окно редактирование Заказа
import { useState, useEffect } from "react";
import uuid from "react-uuid";

import {
  adminGetOne,
  adminUpdate,
  createItem,
  updateItem,
  deleteItem,
} from "../../../http/Tok/orderAPI_Tok";
import UpdateItems from "./UpdateItems";

const defaultValue = {
  name: "",
  email: "",
  phone: "",
  address: "",
  comment: "",
};
const defaultValid = {
  name: null,
  email: null,
  phone: null,
  address: null,
  comment: null,
};

const isValid = (value: any) => {
  const result: any = {};
  const pattern = /^[1-9][0-9]*$/;
  // const patternNam = /^[-а-я]{2,}( [-а-я]{2,}){1,2}*$/;
  const patternEML = /^[a-z0-9._%+-]+@[a-z0-9.-]+.{1,2}[a-z]+$/i;
  const patternPHN = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/i;
  for (let key in value) {
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
    // if (key === "comment")
    //   result.comment =
    //     // pattern.test(value.comment);
    //     value?.comment /* ?.trim() */ /* || " " */;
  }
  return result;
};

// функция updateItem, которая проходит по всему массиву Items и для каждой хар-ки выполняет подходящий http-запрос. Причем, для каждого http-запроса мы ждем ответ, так что к моменту возврата из функции все хар-ки уже обновились на сервере. И когда мы выполним еще один запрос, чтобы обновить название, цену, категорию и бренд товара — то в ответе получим уже обновленные хар-ки.
const updateItems = async (items: any, orderId: any) => {
  for (const item of items) {
    const empty =
      item.name /* .trim() */ === "" || item.value /* .trim() */ === "";
    // если вдруг старая хар-ка оказалась пустая — удалим ее на сервере
    if (empty && item.id) {
      try {
        await deleteItem(orderId, item);
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
        await createItem(orderId, item);
      } catch (error: any) {
        alert(error.response.data.message);
      }
      continue;
    }
    if (item.change && !item.remove) {
      try {
        await updateItem(orderId, item.id, item);
      } catch (error: any) {
        alert(error.response.data.message);
      }
      continue;
    }
    if (item.remove) {
      try {
        await deleteItem(orderId, item.id);
      } catch (error: any) {
        alert(error.response.data.message);
      }
      continue;
    }
  }
};

const UpdateOrder = (props: any) => {
  const {
    id,
    show,
    setShow,
    setChange,
    auth,
    header = true,
    body = true,
    disableScroll = true,
  } = props;

  const [value, setValue] = useState(defaultValue);
  const [valid, setValid] = useState(defaultValid);

  // список характеристик товара
  const [items, setItems] = useState([]);

  const itemsId = items;
  const amount: any = itemsId.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (id) {
      // нужно получить с сервера данные товара для редактирования
      adminGetOne(id)
        .then((data) => {
          const order = {
            name: data.name,
            email: data.email.toString(),
            phone: data.phone.toString(),
            address: data.address.toString(),
            comment: data?.comment == null ? "" : data?.comment.toString(),
          };
          setValue(order);
          // setValid(isValid(order));
          setValid(order);
          // для удобства работы с хар-ми зададим для каждой уникальный идентификатор и доп.свойства, которые подскажут нам, какой http-запрос на сервер нужно выполнить — добавления, обновления или удаления характеристики
          setItems(
            data.items.map((item: any) => {
              // при добавлении новой хар-ки свойство append принимает значение true
              // при изменении старой хар-ки свойство change принимает значение true
              // при удалении старой хар-ки свойство remove принимает значение true
              return {
                ...item,
                unique: uuid(),
                append: false,
                remove: false,
                change: false,
              };
            })
          );
        })
        .catch((error) => alert(error.response.data.message));
      // нужно получить с сервера список категорий и список брендов
      // fetchCategories().then((data) => setCategories(data));
      // fetchBrands().then((data) => setBrands(data));
    }
  }, [id]);

  const handleInputChange = (event: any) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

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

      adminUpdate(id, data)
        .then((data) => {
          const order = {
            name: data.name,
            email: data.email.toString(),
            phone: data.phone.toString(),
            address: data.address.toString(),
            comment: data.comment.toString(),
          };
          setValue(order);
          setValid(isValid(order));
          // мы получим актуальные значения хар-тик с сервера, потому что обновление хар-тик завершилось еще до момента отправки этого http-запроса на сервер
          setItems(
            data.items.map((item: any) => {
              return {
                ...item,
                unique: uuid(),
                append: false,
                remove: false,
                change: false,
              };
            })
          );
          // закрываем модальное окно редактирования заказов
          setShow(false);
          // изменяем состояние компонента списка заказов
          setChange((state: any) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  //  ----------------------------------------------------------------------------------
  useEffect(() => {
    //     if (disableScroll) {
    //       document.body.style.overflow = show ? "hidden" : "auto";
    //     }
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show /* ,disableScroll */]);

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return show ? (
    /* // ^  рендр.эл. вне корн.эл.React */ /* ReactDOM.createPortal( */
    <div className="modal-overlay--eg" onClick={() => setShow(false)}>
      <div className="modal-dialog--eg">
        <div className="modal-content--eg" onClick={handleModalClick}>
          {header && (
            <div className="modal-header--eg">
              <div className="modal-title--eg">
                {header}
                <h1>Редактирование Заказа №_{id}</h1>
              </div>
              <button
                onClick={() => setShow(false)}
                type="button"
                className="btn-cloce--eg"
                aria-label="Close"
              >
                ✖
              </button>
            </div>
          )}
          {body && (
            <div className="modal-body--eg m-20" style={{ overflowY: "auto" }}>
              <>
                {body}
                <form noValidate onSubmit={handleSubmit} className="form">
                  <fieldset
                    className="df df-col fieldset--eg p-20"
                    // name
                    // disabled
                  >
                    <legend className="legend--eg">2 уровень </legend>
                    {/* ФИО (Ф.И.О.) */}
                    <input
                      name="name"
                      value={value.name}
                      onChange={handleInputChange}
                      // станд.кл.input +
                      className={`inpt--eg mb-3 ${
                        valid.name === true
                          ? "is-valid"
                          : valid.name === false
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Ф.И.О."
                    />
                    {/* Eml / Тел. */}
                    <div className="df df-jcsb df-row mb-3">
                      <input
                        name="email"
                        value={value.email}
                        onChange={handleInputChange}
                        className={`inpt--eg ${
                          valid.email === true
                            ? "is-valid"
                            : valid.email === false
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Email"
                      />
                      <input
                        name="phone"
                        value={value.phone}
                        onChange={handleInputChange}
                        className={`inpt--eg ${
                          valid.phone === true
                            ? "is-valid"
                            : valid.phone === false
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Телефон"
                      />
                    </div>
                    {/* Адрес */}
                    <input
                      name="address"
                      value={value.address}
                      onChange={handleInputChange}
                      className={`inpt--eg mb-3 ${
                        valid.address === true
                          ? "is-valid"
                          : valid.address === false
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Адрес"
                    />
                    {/* Коммент */}
                    <input
                      name="comment"
                      value={value.comment}
                      onChange={handleInputChange}
                      className="inpt--eg"
                      placeholder="Комментарий"
                    />
                  </fieldset>
                </form>
                <form noValidate onSubmit={handleSubmit} className="form mt-3">
                  <fieldset className="df df-col fieldset--eg p-20">
                    <legend className="legend--eg">2 уровень </legend>
                    <div className="df df-jcsb df-row">
                      <input
                        name="email"
                        value={value.email}
                        onChange={handleInputChange}
                        className={`inpt--eg ${
                          valid.email === true
                            ? "is-valid"
                            : valid.email === false
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Email"
                      />
                      <input
                        name="phone"
                        value={value.phone}
                        onChange={handleInputChange}
                        className={`inpt--eg ${
                          valid.phone === true
                            ? "is-valid"
                            : valid.phone === false
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Телефон"
                      />
                    </div>
                  </fieldset>
                </form>
                <form noValidate onSubmit={handleSubmit} className="form mt-3">
                  <fieldset className="df df-col fieldset--eg p-20">
                    <legend className="legend--eg">2 уровень </legend>
                    <input
                      name="name"
                      value={value.name}
                      onChange={handleInputChange}
                      // станд.кл.input +
                      className={`inpt--eg mb-3 ${
                        valid.name === true
                          ? "is-valid"
                          : valid.name === false
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Ф.И.О."
                    />
                    <input
                      name="comment"
                      value={amount.toLocaleString()}
                      onChange={handleInputChange}
                      className="inpt--eg ff-mn"
                      placeholder="Сумма"
                    />
                  </fieldset>
                </form>
                {/* Позиции */}
                <UpdateItems items={items} setItems={setItems} />
                <div className="df df-row df-jcsb mt-3">
                  <button type="submit" className="btn--eg btn-success--eg">
                    Сохранить
                  </button>
                </div>
              </>
            </div>
          )}
        </div>
      </div>
    </div> /* // ^  рендр.эл. вне корн.эл.React */ /* ,
        document.body
      ) */
  ) : null;
};

export default UpdateOrder;
