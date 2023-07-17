// ^ Список Категорий
import { useState, useEffect } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";

import {
  fetchCategories,
  deleteCategory,
} from "../../../http/Tok/catalogAPI_Tok";
import EditCategory from "../../layout/AppTok/EditCategory";

const AdminCategories = () => {
  // список загруженных категорий
  const [categories, setCategories]: any = useState(null);
  // загрузка списка категорий с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания-редактирования
  const [show, setShow]: any = useState(false);
  // для обновления списка после добавления, редактирования, удаления — изменяем состояние
  const [change, setChange] = useState(false);
  // id категории, которую будем редактировать — для передачи в <UpdateCategory id={…} />
  const [categoryId, setCategoryId]: any = useState(null);

  const handleCreateClick = () => {
    setCategoryId(0);
    setShow(true);
  };

  const handleUpdateClick = (id: any) => {
    setCategoryId(id);
    setShow(true);
  };

  const handleDeleteClick = (id: any) => {
    deleteCategory(id)
      .then((data) => {
        setChange(!change);
        alert(`Категория «${data.name}» удалена`);
      })
      .catch((error) => alert(error.response.data.message));
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
      <Button
        onClick={() => handleCreateClick()}
        variant="primary"
        className="btn-primary--eg"
      >
        Создать категорию
      </Button>
      <EditCategory
        id={categoryId}
        show={show}
        setShow={setShow}
        setChange={setChange}
      />
      {/* Таблица Категорий */}
      {categories.length > 0 ? (
        <Table bordered hover size="sm" className="mt-3 table--eg">
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
                    onClick={() => handleUpdateClick(item.id)}
                    className="btn-success--eg"
                  >
                    Редактировать
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(item.id)}
                    className="btn-danger--eg"
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
