// ^ Модальное окно с формой добавления Товара
import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

import {
  createProduct,
  fetchCategories,
  fetchBrands,
} from "../../../http/Tok/catalogAPI_Tok";
import CreateProperties from "./CreateProperties";

const defaultValue = { name: "", price: "", category: "", brand: "" };
const defaultValid = { name: null, price: null, category: null, brand: null };

const isValid = (value: any) => {
  const result: any = {};
  const pattern = /^[1-9][0-9]*$/;
  for (let key in value) {
    if (key === "name") result.name = value.name.trim() !== "";
    if (key === "price") result.price = pattern.test(value.price.trim());
    if (key === "category") result.category = pattern.test(value.category);
    if (key === "brand") result.brand = pattern.test(value.brand);
  }
  return result;
};

const CreateProduct = (props: any) => {
  const { show, setShow, setChange } = props;

  const [value, setValue] = useState(defaultValue);
  console.log("value ", value);
  const [valid, setValid] = useState(defaultValid);
  console.log("valid ", valid);

  // выбранное для загрузки изображение товара
  const [image, setImage]: any = useState(null);

  // список характеристик товара
  const [properties, setProperties] = useState([]);

  // список категорий и список брендов для возможности выбора
  const [categories, setCategories]: any = useState(null);
  const [brands, setBrands]: any = useState(null);

  // показ.доп.ФормДаты для n-ых Товаров
  const [showBulkFormData, setShowBulkFormData] = useState(0);

  // нужно получить с сервера список категорий и список брендов
  useEffect(() => {
    fetchCategories().then((data) => setCategories(data));
    fetchBrands().then((data) => setBrands(data));
  }, []);

  const handleInputChange = (event: any) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleImageChange = (event: any) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    /*
     * На первый взгляд кажется, что переменная correct не нужна, можно обойтись valid, но это не так. Нельзя использовать значение valid сразу после изменения этого значения — ф-ция setValid не изменяет значение состояния мгновенно. Вызов функции лишь означает — React «принял к сведению» наше сообщение, что состояние нужно изменить.
     */
    const correct = isValid(value);
    setValid(correct);

    // все поля формы прошли проверку, можно отправлять данные на сервер
    if (correct.name && correct.price && correct.category && correct.brand) {
      const data = new FormData();
      data.append("name", value.name.trim());
      data.append("price", value.price.trim());
      data.append("categoryId", value.category);
      data.append("brandId", value.brand);
      if (image) data.append("image", image, image.name);
      // характеристики нового товара
      if (properties.length) {
        const props = properties.filter(
          (prop: any) => prop.name.trim() !== "" && prop.value.trim() !== ""
        );
        if (props.length) {
          data.append("props", JSON.stringify(props));
        }
      }

      createProduct(data)
        .then((data) => {
          // приводим форму в изначальное состояние
          event.target.image.value = "";
          setValue(defaultValue);
          setValid(defaultValid);
          setProperties([]);
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
        value={value.name}
        onChange={(e) => handleInputChange(e)}
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
      </Row>
      {/* Цена/Изо */}
      <Row className="mb-3">
        <Col>
          <Form.Control
            name="price"
            value={value.price}
            onChange={(e) => handleInputChange(e)}
            isValid={valid.price === true}
            isInvalid={valid.price === false}
            placeholder="Цена товара..."
          />
        </Col>
        <Col>
          <Form.Control
            name="image"
            type="file"
            onChange={(e) => handleImageChange(e)}
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
      onHide={() => setShow(false)}
      size="lg"
      className="modal--eg-bootstr"
    >
      <Modal.Header closeButton style={{ padding: "5px" }}>
        <Modal.Title style={{ position: "relative" }}>Новый товар</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <div>{FormsParam}</div>
          {Array(showBulkFormData)
            .fill(0)
            .map((_, index) =>
              showBulkFormData > 0 ? <div key={index}>{FormsParam}</div> : ""
            )}
          <div className="mt-2" style={{ display: "block" }}>
            {/* кнп.Добавить/Убрать Товар */}
            <Col
              className="mb-3"
              style={{ display: "flex", margin: "0px !important" }}
            >
              <Button
                type="submit"
                size="sm"
                variant="primary"
                className="btn-primary--eg"
                style={{ width: "100%" }}
                onClick={() => setShowBulkFormData(showBulkFormData + 1)}
              >
                Добавить Товар
              </Button>
              <Button
                type="submit"
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
