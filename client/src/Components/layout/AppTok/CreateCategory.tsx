// ^ Модальное окно с формой добавления Категории
import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { categoryAPI } from "../../../api/catalog/categoryAPI";

const CreateCategory = (props: any) => {
  const { show, setShow, setChange } = props;

  const [name, setName] = useState("");
  const [valid, setValid]: any = useState(null);

  const handleChange = (event: any) => {
    console.log("CraCat Chng event" + event);
    console.log(event);
    setName(event.target.value);
    setValid(event.target.value.trim() !== "");
  };

  const handleSubmit = (event: any) => {
    console.log("CraCat Sbm event" + event);
    console.log(event);
    event.preventDefault();
    /*
     * На первый взгляд кажется, что переменная correct не нужна, можно обойтись valid, но это не так. Нельзя использовать значение valid сразу после изменения этого значения — ф-ция setValid не изменяет значение состояния мгновенно. Вызов функции лишь означает — React «принял к сведению» наше сообщение, что состояние нужно изменить.
     */
    const correct = name.trim() !== "";
    setValid(correct);
    if (correct) {
      categoryAPI
        .createCategory(name.trim())
        .then((/* data */) => {
          // изменяем состояние компонента списка категорий
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
        <Modal.Title>Новая категория</Modal.Title>
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
          <button type="submit" className="btn--eg btn-success--eg">
            Сохранить
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCategory;
