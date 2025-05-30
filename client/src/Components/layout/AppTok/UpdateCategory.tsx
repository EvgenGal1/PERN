// ^ Редактирование Категории
import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";

import { categoryAPI } from "@api/catalog/categoryAPI";

const UpdateCategory = (props: any) => {
  const { id, show, setShow, setChange } = props;

  const [name, setName] = useState("");
  const [valid, setValid]: any = useState(null);

  useEffect(() => {
    if (id) {
      categoryAPI
        .getOneCategory(id)
        .then((data) => setName(data.name))
        .catch((error) => alert(error.response.data.message));
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
      categoryAPI
        .updateCategory(id, name.trim())
        .then((/* data */) => {
          // закрываем модальное окно редактирования категории
          setShow(false);
          // изменяем состояние компонента списка категорий
          setChange((state: any) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} className="modal--eg">
      <Modal.Header closeButton>
        <Modal.Title>Редактирование категории</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Control
            name="name"
            value={name}
            onChange={(e) => handleChange(e)}
            isValid={valid === true}
            isInvalid={valid === false}
            placeholder="Название категории..."
            className="mb-3 123"
          />
          <button type="submit" className="btn--eg btn-success--eg">
            Сохранить
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateCategory;
