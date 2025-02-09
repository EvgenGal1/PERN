// ^ Список Категорий
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { categoryAPI } from "../../../api/catalog/categoryAPI";
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

  const handleUpdateClick = (id: number) => {
    setCategoryId(id);
    setShow(true);
  };

  const handleDeleteClick = (id: number, name?: string) => {
    // eslint-disable-next-line no-restricted-globals
    const confirmDel = confirm(`Удалить Категорию - «${name}»`);
    if (confirmDel) {
      categoryAPI
        .deleteCategory(id)
        .then((/* data */) => {
          setChange(!change);
          alert(`Категория «» удалена`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  useEffect(() => {
    console.log("AdminCategories нужен ли fetchCategories ");
    categoryAPI
      .getAllCategories()
      .then((data) => setCategories(data))
      .finally(() => setFetching(false));
  }, [change]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="container">
      <h1>Категории</h1>
      {/* Кнп. для показа Модального окна с формой */}
      <button
        onClick={() => handleCreateClick()}
        className="btn--eg btn-primary--eg"
      >
        Создать категорию
      </button>
      <EditCategory
        id={categoryId}
        show={show}
        setShow={setShow}
        setChange={setChange}
      />
      {/* Таблица Категорий */}
      {categories.length > 0 ? (
        <table className="mt-3 table--eg">
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
                  <button
                    onClick={() => handleUpdateClick(item.id)}
                    className="btn--eg btn-success--eg"
                  >
                    Редактировать
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(item.id, item.name)}
                    className="btn--eg btn-danger--eg"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Список категорий пустой</p>
      )}
    </div>
  );
};

export default AdminCategories;
