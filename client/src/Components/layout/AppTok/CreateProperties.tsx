// ^ Модальное окно с формой добавления Характеристик Товара
import { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

const CreateProperties = (props: any) => {
  const { properties, setProperties } = props;

  // показ.доп.ФормДаты для +n-ых Хар-ик Товара
  const [showBulkFormData, setShowBulkFormData] = useState(0);

  // ^ Добавление
  const append = (event: any) => {
    console.log("1 ", 1);
    // стар.код
    // setProperties([...properties, { name: "", value: "", number: Date.now() }]);

    // ^ нов.код под масс.загр.Хар-ик
    // перем.Хар-ик state, id, шаблона
    let dataProps = { ...properties };
    let idProps = event.target.parentElement.id; // без Number() т.к. key String
    let template = { name: "", value: "", number: Date.now() };

    for (const key in dataProps) {
      // console.log("ap key - idProps ", key, " - ", idProps);
      // е/и key и id равны - добавл.шаблон к key
      if (key === idProps) {
        // console.log("ap 222 === ", 222);
        dataProps[key].push(template);
      }
      // е/и ключ не равен id и id нет в state - добавл.шаблон с нов.id
      if (key !== idProps && !(idProps in dataProps)) {
        // console.log("ap 333 !=! ", 333);
        dataProps = { ...dataProps, [idProps]: [template] };
      }
    }
    setProperties(dataProps);
  };

  // ^ Удаление
  const remove = (number: any) => {
    // setProperties(properties.filter((item: any) => item.number !== number));
    console.log("2 ", 2);
  };

  // ^ Изменение
  const change = (event: any) => {
    //   setProperties(properties.map((item: any) => item.number === number ? { ...item, [key]: value } : item) );
    console.log("3 ", 3);
  };

  // перем.с полями Параметров Формы (Назв.,Категории,Бренда,Цены,Изо,Хар-ик)
  const FormsParamProps = (
    <>
      <Row className="mb-2">
        <Col>
          <Form.Control
            name={"name_"}
            // value={item.name}
            onChange={(e) => change(e)}
            placeholder={"Название... "}
            size="sm"
          />
        </Col>
        <Col>
          <Form.Control
            name={"value_"}
            // value={item.value}
            onChange={(e) => change(e)}
            placeholder={"Значение... "}
            size="sm"
          />
        </Col>
        <Col>
          <Button
            onClick={(e) => {
              // remove(item.number)
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
      {Array(showBulkFormData)
        .fill(0)
        .map((_, index) =>
          showBulkFormData > 0 ? (
            <div
              // id + 1 для опред.места записи в масс.Хар-ик от ФормДаты
              id={`` + (index + 1)}
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
