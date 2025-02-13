import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";

import { orderAPI } from "../../../api/shopping/orderAPI";

interface EditOrderProps {
  id?: number; // Добавляем тип для id
  show: boolean;
  setShow: (show: boolean) => void;
  setChange: (state: boolean | ((prevState: boolean) => boolean)) => void;
}

const EditOrder = ({ id, show, setShow, setChange }: EditOrderProps) => {
  // const { id, show, setShow, setChange } = props;

  const [name, setName] = useState<string>("");
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (id) {
      orderAPI
        .getOneOrder(id)
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setValid(event.target.value.trim() !== "");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /*
     * На первый взгляд кажется, что переменная correct не нужна, можно обойтись valid, но это не так. Нельзя использовать значение valid сразу после изменения этого значения — ф-ция setValid не изменяет значение состояния мгновенно. Вызов функции лишь означает — React «принял к сведению» наше сообщение, что состояние нужно изменить.
     */
    const correct = name.trim() !== "";
    setValid(correct);

    if (correct) {
      const success = () => {
        // закрыть модальное окно
        setShow(false);
        // обнов.сост.родителя
        // setChange((state: any) => !state);
        setChange((prevState: boolean) => !prevState);
      };
      const error = (error: any) =>
        alert(error.response.data.message || "Произошла ошибка");
      if (id) {
        orderAPI
          // ! ошб.типа, логики и передачи
          .updateOrder(id, name as any)
          .then(success)
          .catch(error);
      } else {
        orderAPI
          // ! ошб.типа, логики и передачи
          .createOrder(name as any)
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
        <Modal.Title>
          {id ? "Редактирование" : "Создание"} категории
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Control
            name="name"
            value={name}
            onChange={handleChange}
            isValid={valid === true}
            isInvalid={valid === false}
            placeholder="Номер Заказа..."
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

export default EditOrder;
