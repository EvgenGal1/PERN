// ^ Список брендов
import { useState, useEffect } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";

import { fetchBrands } from "../../../http/Tok/catalogAPI_Tok";
import CreateBrand from "../../layout/AppTok/CreateBrand";

const AdminBrands = () => {
  // список загруженных брендов
  const [brands, setBrands]: any = useState(null);
  // загрузка списка брендов с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания-редактирования
  const [show, setShow] = useState(false);
  // для обновления списка после добавления-редактирования, нужно изменить состояние
  const [change, setChange] = useState(false);

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
      <Button onClick={() => setShow(true)}>Создать бренд</Button>
      <CreateBrand show={show} setShow={setShow} setChange={setChange} />
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
                    onClick={() => alert("Редактирование бренда")}
                  >
                    Редактировать
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => alert("Удаление бренда")}
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
