// ^ Список Брендов
import { useState, useEffect } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";

import { fetchBrands, deleteBrand } from "../../../http/Tok/catalogAPI_Tok";
import EditBrand from "../../layout/AppTok/EditBrand";

const AdminBrands = () => {
  // список загруженных брендов
  const [brands, setBrands]: any = useState(null);
  // загрузка списка брендов с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания-редактирования
  const [show, setShow]: any = useState(false);
  // для обновления списка после добавления, редактирования, удаления — изменяем состояние
  const [change, setChange] = useState(false);
  // id бренда, который будем редактировать — для передачи в <UpdateBrand id={…} />
  const [brandId, setBrandId]: any = useState(null);

  const handleCreateClick = () => {
    setBrandId(0);
    setShow(true);
  };

  const handleUpdateClick = (id: any) => {
    setBrandId(id);
    setShow(true);
  };

  const handleDeleteClick = (id: any) => {
    deleteBrand(id)
      .then((data) => {
        setChange(!change);
        alert(`Бренд «${data.name}» удален`);
      })
      .catch((error) => alert(error.response.data.message));
  };

  useEffect(() => {
    fetchBrands()
      .then((data) => setBrands(data))
      .finally(() => setFetching(false));
  }, [change]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <Container>
      <h1>Бренды</h1>
      {/* Кнп. для показа Модального окна с формой */}
      <Button
        onClick={() => handleCreateClick()}
        variant="primary"
        className="btn-primary__eg"
      >
        Создать бренд
      </Button>
      <EditBrand
        id={brandId}
        show={show}
        setShow={setShow}
        setChange={setChange}
      />
      {/*  */}
      {brands.length > 0 ? (
        <Table bordered hover size="sm" className="mt-3 table__eg">
          <thead>
            <tr>
              <th>Название</th>
              <th>Редактировать</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((item: any) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleUpdateClick(item.id)}
                    className="btn-success__eg"
                  >
                    Редактировать
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(item.id)}
                    className="btn-danger__eg"
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Список брендов пустой</p>
      )}
    </Container>
  );
};

export default AdminBrands;
