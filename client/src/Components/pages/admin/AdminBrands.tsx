// ^ Список Брендов
import { useState, useEffect } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";

import { fetchBrands, deleteBrand } from "../../../http/Tok/catalogAPI_Tok";
// import CreateBrand from "../../layout/AppTok/CreateBrand";
// import UpdateBrand from "../../layout/AppTok/UpdateBrand";
import EditBrand from "../../layout/AppTok/EditBrand";

const AdminBrands = () => {
  // список загруженных брендов
  const [brands, setBrands]: any = useState(null);
  // загрузка списка брендов с сервера
  const [fetching, setFetching] = useState(true);
  // // модальное окно создания бренда
  // const [createShow, setCreateShow] = useState(false);
  // // модальное окно редактирования
  // const [updateShow, setUpdateShow] = useState(false);
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
      <Button onClick={() => handleCreateClick()}>Создать бренд</Button>
      {/* <CreateBrand
        show={createShow}
        setShow={setCreateShow}
        setChange={setChange}
      />
      <UpdateBrand
        id={brand}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
      /> */}
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
                    // onClick={() => alert("Редактирование бренда")}
                    onClick={() => handleUpdateClick(item.id)}
                  >
                    Редактировать
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    // onClick={() => alert("Удаление бренда")}
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
        <p>Список брендов пустой</p>
      )}
    </Container>
  );
};

export default AdminBrands;
