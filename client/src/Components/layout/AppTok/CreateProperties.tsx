// ^ Модальное окно с формой добавления Характеристик Товара
import { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

const CreateProperties = (props: any) => {
  const { properties, setProperties } = props;

  // показ.доп.ФормДаты для +n-ых Хар-ик Товара
  const [showBulkFormData, setShowBulkFormData] = useState(0);

  // ^ Добавление
  const append = (event: any) => {
    // перем. state, id Хар-ки, шаблона
    let dataProps = { ...properties };
    let idProps = event.target.parentElement.id;
    let template = { name: "", value: "" };

    // перебор state по key
    for (const key in dataProps) {
      // е/и key и id равны - добавл.шаблон по key
      if (key === idProps) dataProps[key].push(template);

      // е/и ключ не равен id и id нет в state - добавл.шаблон с нов.id
      if (key !== idProps && !(idProps in dataProps))
        dataProps = { ...dataProps, [idProps]: [template] };
    }

    // запись в state
    setProperties(dataProps);
  };

  // ^ Изменение
  const change = (event: any) => {
    // перем. state, и Хар-ик id, id Родителя, name и value
    let dataProps = { ...properties };
    let idProps = event.target.parentElement.parentElement.parentElement.id;
    let idParentProps =
      event.target.parentElement.parentElement.parentElement.parentElement.id;
    let nameForm = event.target.name;
    let valueForm = event.target.value;

    // в state под id Родителя запись - name:value
    dataProps[idParentProps][idProps] = {
      ...dataProps[idParentProps][idProps],
      [nameForm]: valueForm,
    };
  };

  // ^ Удаление
  const remove = (event: any) => {
    // перем. state и id Хар-ки id, id Родителя, масс.объ.одного Родителя
    let dataProps = { ...properties };
    let idProps = event.target.parentElement.parentElement.parentElement.id;
    let idParentProps =
      event.target.parentElement.parentElement.parentElement.parentElement.id;
    let arrParentProps = dataProps[idParentProps];

    // перебор масс.ключей Родителя
    for (let key of Object.keys(arrParentProps)) {
      // е/и key и id равны - добавл.шаблон по key
      if (key === idProps) arrParentProps.splice(idProps, 1);
    }

    // запись в state
    setProperties(dataProps);
  };

  // перем.с полями Параметров Формы (Назв.,Категории,Бренда,Цены,Изо,Хар-ик)
  const FormsParamProps = (
    <>
      <Row className="mb-2">
        <Col>
          <Form.Control
            name={"name"}
            // value={item.name}
            onChange={(e) => change(e)}
            placeholder={"Название... "}
            size="sm"
          />
        </Col>
        <Col>
          <Form.Control
            name={"value"}
            // value={item.value}
            onChange={(e) => change(e)}
            placeholder={"Значение... "}
            size="sm"
          />
        </Col>
        <Col>
          <Button
            onClick={(e) => {
              remove(e);
              setShowBulkFormData(showBulkFormData - 1);
            }}
            size="sm"
            variant="outline-danger"
            className="btn-primary--eg danger"
            style={{ width: "100%" }}
          >
            Удалить
          </Button>
        </Col>
      </Row>
    </>
  );

  return (
    <>
      {/* <h5>Характеристики</h5> */}
      <Button
        onClick={(e) => {
          append(e);
          setShowBulkFormData(showBulkFormData + 1);
        }}
        variant="outline-primary"
        size="sm"
        className="btn-primary--eg mb-2"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
        }}
      >
        Добавить Характеристики Товара
      </Button>
      {/* масс.Хар-ик для каждого блока ФормДаты по showBulkFormData // ! удаляет ТОЛЬКО последний элемент, в state всё ровно, НО render НЕТ */}
      {Array(showBulkFormData)
        .fill(0)
        .map((_, index) =>
          showBulkFormData > 0 ? (
            <div
              // id для опред.места записи в масс.Хар-ик от ФормДаты
              id={`` + index}
              key={index}
            >
              {FormsParamProps}
            </div>
          ) : (
            ""
          )
        )}
    </>
  );
};

export default CreateProperties;
