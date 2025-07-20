// ^ Список Брендов
import { useEffect, useState } from "react";

import { brandAPI } from "@api/catalog/brandAPI";
import EditBrand from "@Comp/pages/admin/features/EditBrand";
import LoadingAtom from "@Comp/ui/loader/LoadingAtom";

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

  const handleUpdateClick = (id: number) => {
    setBrandId(id);
    setShow(true);
  };

  const handleDeleteClick = (id: number, name?: string) => {
    const confirmDel = confirm(`Удалить Бренд - «${name}»`);
    if (confirmDel) {
      brandAPI
        .deleteBrand(id)
        .then((/* data */) => {
          setChange(!change);
          alert(`Бренд «» удален`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  useEffect(() => {
    brandAPI
      .getAllBrands()
      .then((data) => setBrands(data))
      .finally(() => setFetching(false));
  }, [change]);

  if (fetching) return <LoadingAtom />;

  return (
    <div className="container">
      <h1>Бренды</h1>
      {/* Кнп. для показа Модального окна с формой */}
      <button
        onClick={() => handleCreateClick()}
        className="btn--eg btn-primary--eg"
      >
        Создать бренд
      </button>
      <EditBrand
        id={brandId}
        show={show}
        setShow={setShow}
        setChange={setChange}
      />
      {brands.length > 0 ? (
        <table className="mt-3 table--eg">
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
        <p>Список брендов пустой</p>
      )}
    </div>
  );
};

export default AdminBrands;
