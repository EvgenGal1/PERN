// ^ Модальное окно с формой добавления Товара
import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

import {
  createProduct,
  fetchCategories,
  fetchBrands,
} from "../../../http/Tok/catalogAPI_Tok";
import CreateProperties from "./CreateProperties";

// перем.Валидации/Значений по умолч.
const defaultValue: any = {
  name: "",
  price: "",
  category: "",
  brand: "",
  image: [],
};
const defaultValid = {
  name: null,
  price: null,
  category: null,
  brand: null,
  image: null,
};

// перем. Значений для доп.ФормДат по умолч.
let defaultValueBulk: { [key: string | number]: any } = {
  name: [],
  price: [],
  category: [],
  brand: [],
  image: [],
};

// перем. Характеристик для доп.ФормДат по умолч.
let defaultValueBulkProps: { [key: string | number]: any } = {
  0: [],
};

const isValid = (value: any) => {
  // const result: any = {};
  const pattern = /^[1-9][0-9]*$/;
  // for (let key in value) {
  //   if (key === "name") result.name = value.name.trim() !== "";
  //   if (key === "price") result.price = pattern.test(value.price.trim());
  //   if (key === "category") result.category = pattern.test(value.category);
  //   if (key === "brand") result.brand = pattern.test(value.brand);
  // }
  // return result;

  // const result: any = [];
  // const result: any = {};
  // ^ пока без проверки (разруш.объ.на не именнов.масс.)
  const result: any = value;
  // for (const prop in value) {
  //   console.log("prop ", prop);
  //   console.log(prop);
  //   const val = value[prop];
  //   console.log("val ", val);
  //   console.log(val);
  //   if (typeof val === "object") {
  //     console.log("Array(val) ", Array(val));
  //     result.push(Array(val)); // <- recursive call
  //     // if (val === "name") result.push(Array(val))/* name */ = value.name.trim() !== "";
  //     // if (val === "price") result.push(Array(val))/* price */ = pattern.test(value.price.trim());
  //     // if (val === "category") result.push(Array(val))/* category */ = pattern.test(value.category);
  //     // if (val === "brand") result.push(Array(val))/* brand */ = pattern.test(value.brand);
  //   } else {
  //     result.push(val);
  //   }
  // }
  console.log("result ", result);
  console.log(result);
  return result;
};

const CreateProduct = (props: any) => {
  const { show, setShow, setChange } = props;

  // валидация // ! врем.откл.
  const [valid, setValid] = useState(defaultValid);
  // state для 1го Товара (упразднён)
  // const [value, setValue] = useState(defaultValue);
  // доп.ФормДаты для неск.Товаров
  const [valueBulk, setValueBulk] = useState(defaultValueBulk);
  // показ.доп.ФормДаты для +n-ых Товаров
  const [showBulkFormData, setShowBulkFormData] = useState(0);

  // список характеристик товара
  const [properties, setProperties] = useState(defaultValueBulkProps);

  // список Категорий/Брендов для возможности выбора
  const [categories, setCategories]: any = useState(null);
  const [brands, setBrands]: any = useState(null);

  // fn() сброса на нач.знач. statов и ФормДат ?нужна ли?
  const resetValueAndValidAndVBulk = () => {
    console.log("reset ", 0);
    // приводим форму в изначальное состояние
    // setValue(defaultValue);
    setValid(defaultValid);
    setProperties([]);
    // сброс доп.ФормДат
    setShowBulkFormData(0);
    // ! не раб.востан.перем.по умолч. Происходит запись в перем.даже при const
    defaultValueBulk = {
      name: [],
      // name: {},
      price: [],
      // price: {},
      category: [],
      // category: {},
      brand: [],
      // brand: {},
      image: [],
      // image: {},
    };
    setValueBulk(defaultValueBulk);
  };

  // изначально получить с сервера списки Категорий/Брендов
  useEffect(() => {
    fetchCategories().then((data) => setCategories(data));
    fetchBrands().then((data) => setBrands(data));
  }, []);

  // сохр.данн в state для масс.запроса от доп.ФормДат
  const bulkHandleInputChange = (event: any) => {
    // console.log("hndlInp 000 event.target.name|value ", event.target?.name, event.target?.value);

    // запись доп.ФормДаты из state в перем.
    let data = {
      ...valueBulk,
    };

    console.log("hndlInp data 000 ", data);
    if (event.target.name) {
      // перебор парам.в data по key
      for (const key in data) {
        // выборка name,category,brand,price для записи
        if (key === event.target.name && event.target.name !== "image") {
          let num: number = 0;

          // ^ находим id formы родителя для опред.в какое место параметра массива записывать значение
          // имя
          if (event.target?.name === "name")
            num = Number(event.target.parentElement.id);
          // categor | brand | price | img
          if (
            event.target?.name === "category" ||
            event.target?.name === "brand" ||
            event.target?.name === "price"
          )
            num = Number(
              event.target.parentElement.parentElement.parentElement.id
            );

          // data[key].push(event.target.value);
          data[key][num] = event.target.value;
        }
        // выборка Изо для записи
        if (key === event.target.name && event.target.name === "image") {
          let num = Number(
            event.target.parentElement.parentElement.parentElement.id
          );
          // data[key] = { ...[key], ...event.target.files };
          // data[key].push(/* event.target.files[0].name, */ event.target.files[0]);
          data[key][num] = event.target.files[0];
        }
      }
      // console.log("hndlInp DATA 111 ", data);
      setValueBulk(data);
    }
  };

  // кнп.Сохранить(отправка/получ.данн.Сервера)
  const handleSubmit = (event: any) => {
    event.preventDefault();

    /*
     * На первый взгляд кажется, что переменная correct не нужна, можно обойтись valid, но это не так. Нельзя использовать значение valid сразу после изменения этого значения — ф-ция setValid не изменяет значение состояния мгновенно. Вызов функции лишь означает — React «принял к сведению» наше сообщение, что состояние нужно изменить.
     */
    // const correct = isValid(value);
    const correct = isValid(valueBulk);
    setValid(correct);

    // все поля формы прошли проверку, можно отправлять данные на сервер
    if (
      /* correct.name && correct.price && correct.category && correct.brand */ true
    ) {
      console.log("SBM IF 1 ", 1);

      let formData = new FormData();
      for (let key in valueBulk) {
        if (key === "name") formData.append("name", valueBulk.name);
        if (key === "price") formData.append("price", valueBulk.price);
        if (key === "category")
          formData.append("categoryId", valueBulk.category);
        if (key === "brand") formData.append("brandId", valueBulk.brand);
        if (key === "image") {
          let imgLenght = valueBulk.image.length;
          for (var i = 0; i < imgLenght; i++) {
            formData.append(
              "image",
              valueBulk.image[i],
              valueBulk.image[i].name
            );
          }
        }
      }

      // ~ проверки
      // вывод каждого значения
      const pairs = Array.from(formData.entries());
      for (let /* pair */ [key, value] of pairs) {
        console.log("кажд кл./знач. pair ", `${key}: ${value}` /* pair */);
      }
      // вывод каждого масс.в объ.
      console.log(...pairs);
      // вывод Таблицы
      console.table([...pairs]);
      // вывод объ.со значениями
      console.log(Object.fromEntries(pairs));

      // характеристики нового товара
      if (properties.length) {
        // ! врем.откл. проверку для отраб.масс.загр.Хар-ик Товара
        // const props = properties.filter(
        //   (prop: any) => prop.name.trim() !== "" && prop.value.trim() !== ""
        // );
        // if (props.length) {
        if (properties) {
          formData.append("props", JSON.stringify(properties));
          // data.push("props", JSON.stringify(props));
        }
      }
      console.log("SBM formData ", formData);

      // отправка/получение data на/с Сервера
      createProduct(formData)
        .then((data) => {
          // приводим форму в изначальное состояние
          event.target.image.value = "";
          resetValueAndValidAndVBulk();
          // закрываем модальное окно создания товара
          setShow(false);
          // изменяем состояние компонента списка товаров, чтобы в этом списке появился и новый товар
          setChange((state: any) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  // перем.с полями Параметров Формы (Назв.,Категории,Бренда,Цены,Изо,Хар-ик)
  const FormsParam = (
    <>
      {/* Название */}
      <Form.Control
        name="name"
        // блок на все знач.из state для неск.ФормДат
        // value={value.name}
        onChange={(e) => {
          // пока 2 fn() записи знач.(для 1го Товара и Нескольких)
          // handleInputChange(e);
          bulkHandleInputChange(e);
        }}
        isValid={valid.name === true}
        isInvalid={valid.name === false}
        placeholder="Название товара..."
        className="mb-3"
      />
      {/* Категория/Бренд */}
      <Row className="mb-3">
        <Col>
          <Form.Select
            name="category"
            // value={value.category}
            onChange={(e) => {
              // handleInputChange(e);
              bulkHandleInputChange(e);
            }}
            isValid={valid.category === true}
            isInvalid={valid.category === false}
          >
            {/* // ! не раб.скрытие 1го opt.при откр.select */}
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
            // value={value.brand}
            onChange={(e) => {
              // handleInputChange(e);
              bulkHandleInputChange(e);
            }}
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
      </Row>
      {/* Цена/Изо */}
      <Row className="mb-3">
        <Col>
          <Form.Control
            name="price"
            // value="value"
            // value={value.price}
            onChange={(e) => {
              // handleInputChange(e);
              bulkHandleInputChange(e);
            }}
            isValid={valid.price === true}
            isInvalid={valid.price === false}
            placeholder="Цена товара..."
          />
        </Col>
        <Col>
          <Form.Control
            name="image"
            type="file"
            onChange={(e) => {
              // handleImageChange(e);
              // handleInputChange(e);
              bulkHandleInputChange(e);
            }}
            placeholder="Фото товара..."
          />
        </Col>
      </Row>
      {/* Характеристики */}
      <CreateProperties properties={properties} setProperties={setProperties} />
      <hr
        style={{
          margin: "1rem 0",
          order: "1px solid",
          opacity: "1",
          color: "var(--bord-hr)",
        }}
      />
    </>
  );

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        // вызов fn() сброса на нач.знач. statов и ФормДат ?нужна ли?
        resetValueAndValidAndVBulk();
      }}
      // блок на закрытие при клике вне Modal
      backdrop="static"
      size="lg"
      className="modal--eg-bootstr"
    >
      <Modal.Header closeButton style={{ padding: "5px" }}>
        <Modal.Title style={{ position: "relative" }}>Новый товар</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          noValidate
          onSubmit={handleSubmit}
          // ! врем.стиль для расшир.отражения
          // style={{ minWidth: "800px" }}
        >
          {/* ФормДата для загр.1го Товара */}
          <div id="0">{FormsParam}</div>
          {/* доп.ФормДаты для масс.загр.Товаров */}
          {Array(showBulkFormData)
            .fill(0)
            .map((_, index) =>
              showBulkFormData > 0 ? (
                <div
                  // id + 1 для опред.места записи в масс.парам. ФормДаты
                  id={`` + (index + 1)}
                  key={index}
                >
                  {FormsParam}
                </div>
              ) : (
                ""
              )
            )}
          <div className="mt-2" style={{ display: "block" }}>
            {/* кнп.Добавить/Убрать Товар */}
            <Col
              className="mb-3"
              style={{ display: "flex", margin: "0px !important" }}
            >
              <Button
                // type="submit"
                size="sm"
                variant="primary"
                className="btn-primary--eg"
                style={{ width: "100%" }}
                onClick={() => setShowBulkFormData(showBulkFormData + 1)}
              >
                Добавить Товар
              </Button>
              <Button
                // type="submit"
                size="sm"
                variant="danger"
                className="btn-danger--eg"
                style={{ width: "100%", marginLeft: "10px" }}
                onClick={() => setShowBulkFormData(showBulkFormData - 1)}
              >
                Убрать Товар
              </Button>
            </Col>
            <hr
              style={{
                margin: "1rem 0",
                order: "1px solid",
                opacity: "1",
                color: "var(--bord-hr)",
              }}
            />
            {/* кнп.Сохранить */}
            <Col>
              <Button
                type="submit"
                size="sm"
                variant="success"
                className="btn-success--eg"
                style={{ width: "100%" }}
              >
                Сохранить
              </Button>
            </Col>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProduct;
