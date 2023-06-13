// ^ доп.модальн.окно редактирование Характеристик Товара
import { useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import uuid from "react-uuid";

import {
  createProperty,
  updateProperty,
  deleteProperty,
} from "../../../http/Tok/catalogAPI_Tok";

const UpdateProperties = (props: any) => {
  console.log("UPD PROPERTI props ", props);
  // получ.от родителя масс. хар-тик и fn измен.масс.
  const { properties, setProperties } = props;

  console.log("CLT updProper props ", props);
  console.log("CLT updProper properties ", properties);

  const append = () => {
    setProperties([
      ...properties,
      { id: null, name: "", value: "", unique: uuid(), append: true },
    ]);
  };
  // новую хар-ку надо просто удалить из массива properties, а старую — оставить, но изменить remove на true, чтобы потом выполнить http-запрос на сервер для удаления
  const remove = (unique: any) => {
    const item = properties.find((elem: any) => elem.unique === unique);
    if (item.id) {
      // старая хар-ка
      setProperties(
        properties.map((elem: any) =>
          elem.unique === unique
            ? { ...elem, change: false, remove: true }
            : elem
        )
      );
    } else {
      // новая хар-ка
      setProperties(properties.filter((elem: any) => elem.unique === unique));
    }
  };
  const change = (key: any, value: any, unique: any) => {
    setProperties(
      properties.map((item: any) =>
        item.unique === unique
          ? { ...item, [key]: value, change: !item.append }
          : item
      )
    );
  };

  return (
    <>
      ~! UpdateProperties
      <h5>Характеристики</h5>
      <Button
        onClick={append}
        variant="outline-primary"
        size="sm"
        className="mb-2"
      >
        Добавить
      </Button>
      {properties.map((item: any) => (
        <Row
          key={item.unique}
          className="mb-2"
          style={{ display: item.remove ? "none" : "flex" }}
        >
          <Col>
            <Form.Control
              name={"name_" + item.unique}
              value={item.name}
              onChange={(e) => change("name", e.target.value, item.unique)}
              placeholder="Название..."
              size="sm"
            />
          </Col>
          <Col>
            <Form.Control
              name={"value_" + item.unique}
              value={item.value}
              onChange={(e) => change("value", e.target.value, item.unique)}
              placeholder="Значение..."
              size="sm"
            />
          </Col>
          <Col>
            <Button
              onClick={() => remove(item.unique)}
              size="sm"
              variant="outline-danger"
            >
              Удалить
            </Button>
            {item.change && " *"}
          </Col>
        </Row>
      ))}
    </>
  );
};

export default UpdateProperties;