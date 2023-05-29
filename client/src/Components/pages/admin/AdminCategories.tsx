// ^ Список Категорий
import { useState, useEffect, useContext } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";

import {
  fetchCategories,
  deleteCategory,
} from "../../../http/Tok/catalogAPI_Tok";
import CreateCategory from "../../layout/AppTok/CreateCategory";
import UpdateCategory from "../../layout/AppTok/UpdateCategory";

const AdminCategories = () => {
  // список загруженных категорий
  const [categories, setCategories]: any = useState(null);
  // загрузка списка категорий с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания категории
  const [createShow, setCreateShow] = useState(false);
  // модальное окно редактирования
  const [updateShow, setUpdateShow] = useState(false);
  // для обновления списка после добавления, редактирования, удаления — изменяем состояние
  const [change, setChange] = useState(false);
  // id категории, которую будем редактировать — для передачи в <UpdateCategory id={…} />
  const [category, setCategory] = useState(null);

  const handleUpdateClick = (id: any) => {
    setCategory(id);
    setUpdateShow(true);
  };

  const handleDeleteClick = (id: any) => {
    deleteCategory(id)
      .then((data) => {
        setChange(!change);
        alert(`Категория «${data.name}» удалена`);
      })
      .catch((error: any) => alert(error.response.data.message));
  };

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
      <Button onClick={() => setCreateShow(true)}>Создать категорию</Button>
      <CreateCategory
        show={createShow}
        setShow={setCreateShow}
        setChange={setChange}
      />
      <UpdateCategory
        id={category}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
      />

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
                    // onClick={() => alert("Редактирование категории")}
                    onClick={() => handleUpdateClick(item.id)}
                  >
                    Редактировать
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    // onClick={() => alert("Удаление категории")}
                    onClick={() => handleDeleteClick(item.id)}
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
