// ^ Список категорий
import { useState, useEffect, useContext } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";

import { fetchCategories } from "../../../http/Tok/catalogAPI_Tok";
import CreateCategory from "../../layout/AppTok/CreateCategory";

const AdminCategories = () => {
  // список загруженных категорий
  const [categories, setCategories]: any = useState(null);
  // загрузка списка категорий с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания-редактирования
  const [show, setShow] = useState(false);
  // для обновления списка после добавления-редактирования, нужно изменить состояние
  const [change, setChange] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .finally(() => setFetching(false));
  }, [change]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <Container>
      <h1>Категории</h1>
      {/* Кнп. для показа Модального окна с формой */}
      <Button onClick={() => setShow(true)}>Создать категорию</Button>
      <CreateCategory show={show} setShow={setShow} setChange={setChange} />
      {/*  */}
      {categories.length > 0 ? (
        <Table bordered hover size="sm" className="mt-3 table__eg">
          <thead>
            <tr>
              <th>Название</th>
              <th>Редактировать</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item: any) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => alert("Редактирование категории")}
                  >
                    Редактировать
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => alert("Удаление категории")}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Список категорий пустой</p>
      )}
    </Container>
  );
};

export default AdminCategories;
