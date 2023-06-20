// ^ модальн.окно редактирование Заказа
import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import uuid from "react-uuid";

import {
  adminGetOne,
  adminUpdate,
  // fetchCategories,
  // fetchBrands,
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
  status: "",
};
const defaultValid = {
  name: null,
  email: null,
  phone: null,
  address: null,
  comment: null,
  status: null,
};

const isValid = (value: any) => {
  const result: any = {};
  const pattern = /^[1-9][0-9]*$/;
  for (let key in value) {
    if (key === "name") result.name = value.name.trim() !== "";
    if (key === "email") result.email = value.email.trim(); // pattern.test(value.email.trim());
    if (key === "phone") result.phone = value.phone.trim(); // pattern.test(value.phone);
    if (key === "address") result.address = value.address.trim(); // pattern.test(value.address);
    if (key === "comment") result.comment = value?.comment?.trim(); // pattern.test(value.comment);
    if (key === "status") result.status = value?.status?.trim(); // pattern.test(value.status);
    // 'result.status' is assigned to itself.
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
  const { id, show, setShow, setChange } = props;

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
            comment: data?.comment.toString(),
            status: data?.status.toString(),
          };
          setValue(order);
          // setValid(isValid(order));
          setValid(order);
          // для удобства работы с хар-ми зададим для каждой уникальный идентификатор и доп.свойства, которые подскажут нам, какой http-запрос на сервер нужно выполнить — добавления, обновления или удаления характеристики
          // setItems(data.props);
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
    if (
      correct.name &&
      correct.email &&
      correct.phone &&
      correct.address &&
      correct.comment &&
      correct.status
    ) {
      const data = new FormData();
      data.append("name", value.name.trim());
      data.append("email", value.email.trim());
      data.append("phone", value.phone.trim());
      data.append("address", value.address.trim());
      data.append("comment", value.comment.trim());
      data.append("status", value.status.trim());
      // if (image) data.append("image", image, image.name);

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
            status: data.status.toString(),
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

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      className="modal__eg-bootstr"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h1>Редактирование Заказа №_{id}</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Control
            name="name"
            value={value.name}
            onChange={(e) => handleInputChange(e)}
            isValid={valid.name === true}
            isInvalid={valid.name === false}
            placeholder="Название заказа..."
            className="mb-3"
          />
          <Form.Control
            name="address"
            value={value.address}
            onChange={(e) => handleInputChange(e)}
            isValid={valid.address === true}
            isInvalid={valid.address === false}
            placeholder="Адрес"
            className="mb-3"
          />
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="email"
                value={value.email}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.email === true}
                isInvalid={valid.email === false}
                placeholder="Email"
              />
            </Col>
            <Col>
              <Form.Control
                name="phone"
                value={value.phone}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.phone === true}
                isInvalid={valid.phone === false}
                placeholder="Телефон"
              />
            </Col>
          </Row>
          <Form.Control
            name="comment"
            value={value.comment}
            onChange={(e) => handleInputChange(e)}
            isValid={valid.comment === true}
            isInvalid={valid.comment === false}
            placeholder="Комментарий"
          />
          <UpdateItems items={items} setItems={setItems} />
          <Row>
            <Col>
              <Button
                type="submit"
                size="sm"
                variant="success"
                className="btn-success__eg"
              >
                Сохранить
              </Button>
            </Col>
            <Col>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="btn-primary__eg"
              >
                {amount}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateOrder;
