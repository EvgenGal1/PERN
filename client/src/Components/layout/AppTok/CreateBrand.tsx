// ^ Модальное окно с формой добавления Бренда
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { createBrand } from "../../../http/Tok/catalogAPI_Tok";

const CreateBrand = (props: any) => {
  const { show, setShow, setChange } = props;

  const [name, setName] = useState("");
  const [valid, setValid]: any = useState(null);

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
      createBrand(data)
        .then((data) => {
          // изменяем состояние компонента списка брендов
          setChange((state: any) => !state);
          // готовим форму к созданию еще одной категории
          setName("");
          setValid(null);
          // закрываем модальное окно создания категории
          setShow(false);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Новый бренд</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Control
            name="name"
            value={name}
            onChange={(e) => handleChange(e)}
            isValid={valid === true}
            isInvalid={valid === false}
            placeholder="Название бренда..."
            className="mb-3"
          />
          <Button
            type="submit"
            size="sm"
            variant="success"
            className="btn-success__eg"
          >
            Сохранить
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateBrand;
