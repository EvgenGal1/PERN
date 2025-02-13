import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";

import { productAPI } from "../../../api/catalog/productAPI";

const EditProduct = (props: any) => {
  const { id, show, setShow, setChange } = props;

  const [name, setName] = useState("");
  const [valid, setValid]: any = useState(null);

  useEffect(() => {
    if (id) {
      // fetchProduct(id)
      //   .then((data) => {
      //     setName(data.name);
      //     setValid(data.name !== "");
      //   })
      //   .catch((error) => alert(error.response.data.message));
    } else {
      setName("");
      setValid(null);
    }
  }, [id]);

  const handleChange = (event: any) => {
    setName(event.target.value);
    setValid(event.target.value.trim() !== "");
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    /*
     * На первый взгляд кажется, что переменная correct не нужна, можно обойтись valid, но это не так. Нельзя использовать значение valid сразу после изменения этого значения — ф-ция setValid не изменяет значение состояния мгновенно. Вызов функции лишь означает — React «принял к сведению» наше сообщение, что состояние нужно изменить.
     */
    const correct = name.trim() !== "";
    setValid(correct);
    if (correct) {
      const success = (/* data: any */) => {
        // закрываем модальное окно создания-редактирования бренда
        setShow(false);
        // изменяем состояние родителя, чтобы обновить список брендов
        setChange((state: any) => !state);
      };
      const error = (error: any) => alert(error.response.data.message);
      if (id) {
        productAPI
          // ! ошб.типа, логики и передачи
          .updateProduct(id, name.trim() as any)
          .then(success)
          .catch(error);
      } else {
        productAPI
          // ! ошб.типа, логики и передачи
          .createProduct(name as any)
          .then(success)
          .catch(error);
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      className="modal--eg-bootstr"
    >
      <Modal.Header closeButton>
        <Modal.Title>{id ? "Редактирование" : "Создание"} бренда</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Control
            name="name"
            value={name}
            onChange={(e) => handleChange(e)}
            isValid={valid === true}
            isInvalid={valid === false}
            placeholder="Название Продукта..."
            className="mb-3"
          />
          <button type="submit" className="btn--eg btn-success--eg">
            Сохранить
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProduct;
