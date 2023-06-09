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
};
const defaultValid = {
  name: null,
  email: null,
  phone: null,
  address: null,
  comment: null,
};

const isValid = (value: any) => {
  console.log("value.category ", value.category);
  const result: any = {};
  const pattern = /^[1-9][0-9]*$/;
  for (let key in value) {
    if (key === "name") result.name = value.name.trim() !== "";
    if (key === "email") result.email = value.email.trim(); // pattern.test(value.email.trim());
    if (key === "phone") result.phone = value.phone.trim(); // pattern.test(value.phone);
    if (key === "address") result.address = value.address.trim(); // pattern.test(value.address);
    if (key === "comment") result.comment = value.comment.trim(); // pattern.test(value.comment);
  }
  return result;
};

// функция updateItem, которая проходит по всему массиву Items и для каждой хар-ки выполняет подходящий http-запрос. Причем, для каждого http-запроса мы ждем ответ, так что к моменту возврата из функции все хар-ки уже обновились на сервере. И когда мы выполним еще один запрос, чтобы обновить название, цену, категорию и бренд товара — то в ответе получим уже обновленные хар-ки.
const updateItems = async (items: any, orderId: any) => {
  for (const item of items) {
    const empty = item.name.trim() === "" || item.value.trim() === "";
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

const UpdateProduct = (props: any) => {
  console.log("CLT updOrd props ", props);
  const { id, show, setShow, setChange } = props;

  const [value, setValue] = useState(defaultValue);
  const [valid, setValid] = useState(defaultValid);

  // // список категорий и список брендов для возможности выбора
  // const [categories, setCategories]: any = useState(null);
  // const [brands, setBrands]: any = useState(null);

  // // выбранное для загрузки изображение товара
  // const [image, setImage]: any = useState(null);

  // список характеристик товара
  const [items, setItems] = useState([]);

  console.log("CLT updOrd usSTt items ", items);

  useEffect(() => {
    console.log("CLT updOrd usEf 1 ", 1);
    if (id) {
      console.log("CLT updOrd usEfid IF ", id);
      // нужно получить с сервера данные товара для редактирования
      adminGetOne(id)
        .then((data) => {
          console.log("CLT updOrd usEfid DATA ", data);
          const order = {
            name: data.name,
            email: data.email.toString(),
            phone: data.phone.toString(),
            address: data.address.toString(),
            comment: data?.comment.toString(),
          };
          console.log("CLT updOrd usEf 2 ", 2);
          console.log("updORD USef order ", order);
          console.log("updORD USef data ", data);
          setValue(order);
          // setValid(isValid(order));
          setValid(order);
          console.log("CLT updOrd usEf 3 ", 3);
          // для удобства работы с хар-ми зададим для каждой уникальный идентификатор и доп.свойства, которые подскажут нам, какой http-запрос на сервер нужно выполнить — добавления, обновления или удаления характеристики
          // setItems(data.props);
          setItems(
            data.props.map((item: any) => {
              console.log("CLT updOrd item ", item);
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

  // const handleImageChange = (event: any) => {
  //   setImage(event.target.files[0]);
  // };

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
      correct.comment
    ) {
      console.log("CLT updOrd sbm if 1 ", 1);

      const data = new FormData();
      data.append("name", value.name.trim());
      data.append("email", value.email.trim());
      data.append("phone", value.phone.trim());
      data.append("address", value.address.trim());
      data.append("comment", value.comment.trim());
      // if (image) data.append("image", image, image.name);

      // нужно обновить, добавить или удалить характеристики и обязательно дождаться ответа сервера — поэтому функция updateItem() объявлена как async, а в теле функции для выполнения действия с каждой хар-кой используется await
      if (items.length) {
        await updateItems(items, id);
      }

      adminUpdate(id, data)
        .then((data) => {
          // сбрасываем поле загрузки изображения, чтобы при сохранении товара (без очистки полей при рендер), когда новое изображение не выбрано, не загружать старое повтороно
          // event.target.image.value = "";
          // в принципе, мы могли бы сбросить все поля формы на дефолтные значения, но если пользователь решит отредатировать тот же товар повтороно, то увидит пустые поля формы — http-запрос на получение данных для редактирования мы выполняем только тогда, когда выбран новый товар (изменился id товара)
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
            data.props.map((item: any) => {
              return {
                ...item,
                unique: uuid(),
                append: false,
                remove: false,
                change: false,
              };
            })
          );
          // закрываем модальное окно редактирования товара
          setShow(false);
          // изменяем состояние компонента списка товаров
          setChange((state: any) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Редактирование Заказа</Modal.Title>
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
          {/* <Row className="mb-3">
            <Col>
              <Form.Select
                name="category"
                value={value.category}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.category === true}
                isInvalid={valid.category === false}
              >
                <option value="">Категория</option>
                {categories &&
                  categories.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                name="brand"
                value={value.brand}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.brand === true}
                isInvalid={valid.brand === false}
              >
                <option value="">Бренд</option>
                {brands &&
                  brands.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
          </Row> */}
          <Row className="mb-3">
            <Col>
              {/* <Form.Control
                name="price"
                value={value.price}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.price === true}
                isInvalid={valid.price === false}
                placeholder="Цена товара..."
              /> */}
            </Col>
            {/* <Col>
              <Form.Control
                name="image"
                type="file"
                onChange={(e) => handleImageChange(e)}
                placeholder="Фото товара..."
              />
            </Col> */}
          </Row>
          <UpdateItems items={items} setItems={setItems} />
          <Row>
            <Col>
              <Button type="submit">Сохранить</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProduct;
