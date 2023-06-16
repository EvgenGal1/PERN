import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import {
  createCategory,
  fetchCategory,
  updateCategory,
} from "../../../http/Tok/catalogAPI_Tok";

const EditOrder = (props: any) => {
  const { id, show, setShow, setChange } = props;

  const [name, setName] = useState("");
  const [valid, setValid]: any = useState(null);

  useEffect(() => {
    if (id) {
      fetchCategory(id)
        .then((data) => {
          setName(data.name);
          setValid(data.name !== "");
        })
        .catch((error) => alert(error.response.data.message));
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
      const data = {
        name: name.trim(),
      };
      const success = (data: any) => {
        // закрываем модальное окно создания-редактирования категории
        setShow(false);
        // изменяем состояние родителя, чтобы обновить список категорий
        setChange((state: any) => !state);
      };
      const error = (error: any) => alert(error.response.data.message);
      id
        ? updateCategory(id, data).then(success).catch(error)
        : createCategory(data).then(success).catch(error);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {id ? "Редактирование" : "Создание"} категории
        </Modal.Title>
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
            className="mb-3"
          />
          <Button type="submit">Сохранить</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditOrder;
