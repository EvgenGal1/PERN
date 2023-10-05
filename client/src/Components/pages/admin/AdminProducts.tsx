// ^ Список Товаров
import { useContext, useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";
import {
  fetchAllProducts,
  deleteProduct,
} from "../../../http/Tok/catalogAPI_Tok";
import CreateProduct from "../../layout/AppTok/CreateProduct";
import UpdateProduct from "../../layout/AppTok/UpdateProduct";
import { PaginSortLimit } from "../../layout/AppTok/PaginSortLimit";

const AdminProducts = () => {
  const { catalog }: any = useContext(AppContext);

  // массив загруженных товаров
  const [products, setProducts]: any = useState([]);
  // загрузка списка товаров с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания товара
  const [createShow, setCreateShow] = useState(false);
  // модальное окно редактирования
  const [updateShow, setUpdateShow] = useState(false);
  // обнов.списка/сост.после добав., редактир., удал.
  const [change, setChange] = useState(false);
  // id радактир-го товара, для UpdateProduct id
  const [product, setProduct]: any = useState(null);

  // скрытие/показ от ширины экрана
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );
  // отслеж.ширины экрана для скрытие/показ по условн.рендер.
  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  // обнов.эл.ч/з Комп.Modal
  const handleUpdateClick = (id: number) => {
    setProduct(id);
    setUpdateShow(true);
  };
  // удал.эл.
  const handleDeleteClick = (id: number, name?: string) => {
    // eslint-disable-next-line no-restricted-globals
    let confirmDel = confirm(`Удалить Товар - «${name}»`);
    if (confirmDel) {
      deleteProduct(id)
        .then((data) => {
          // если это последняя страница и мы удаляем на ней единственный оставшийся товар — то надо перейти к предыдущей странице
          if (
            catalog.count > 1 &&
            products?.length === 1 &&
            catalog.page === catalog.count
          ) {
            catalog.page = catalog.count - 1;
          } else {
            setChange(!change);
          }
          alert(`Товар «${name}» удален`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  useEffect(() => {
    fetchAllProducts(
      null,
      null,
      catalog.page,
      catalog.limit,
      catalog.sortOrd,
      catalog.sortField
    )
      .then((data) => {
        // console.log("AdmProd usEf data ", data);
        setProducts(data.rows);
        catalog.limit = Math.ceil(data.limit);
        catalog.count = data.count;
      })
      .finally(() => setFetching(false));
  }, [
    change,
    catalog,
    catalog.page,
    catalog.limit,
    catalog.sortOrd,
    catalog.sortField,
  ]);

  // if (fetching) {
  //   return <Spinner animation="border" />;
  // }

  return (
    <div className="container">
      <h1>Товары</h1>
      {/* Создание Товара (btn|Комп.Modal) */}
      <button
        onClick={() => setCreateShow(true)}
        className="btn--eg btn-primary--eg"
      >
        Создать товар
      </button>
      <CreateProduct
        show={createShow}
        setShow={setCreateShow}
        setChange={setChange}
      />
      {/* Обновление Товара (Комп.Modal) */}
      <UpdateProduct
        id={product}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
      />
      {/* Табл.Товаров */}
      {products.length > 0 ? (
        <>
          {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
          <div className="mt-3">
            <PaginSortLimit
              admin={true}
              setFetching={setFetching}
              setChange={setChange}
            />
          </div>
          <table className="mt-3 table--eg">
            <thead>
              <tr>
                <th style={{ width: "250px" }}>Название</th>
                <th style={{ width: "54px" }}>Фото</th>
                <th>Категория</th>
                <th>Бренд</th>
                <th>{matches ? "Цена" : "₽"}</th>
                <th style={{ width: "100px" }}>{matches ? "Рейтинг" : "★"}</th>
                <th style={{ width: "150px" }}>
                  {matches ? "Редактировать" : "↻"}
                </th>
                <th style={{ width: "75px" }}>{matches ? "Удалить" : "✕"}</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <Spinner animation="border" />
              ) : (
                products.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.image && (
                        <a
                          href={process.env.REACT_APP_IMG_URL_PERN + item.image}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {/* фото */}
                          <img
                            alt=""
                            src={
                              process.env.REACT_APP_IMG_URL_PERN + item.image
                            }
                            width={50}
                            height={50}
                          />
                        </a>
                      )}
                    </td>
                    <td>{item.category.name || "NULL"}</td>
                    <td>{item.brand.name || "NULL"}</td>
                    <td>{item.price}</td>
                    <td>{item.rating}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => handleUpdateClick(item.id)}
                        className="btn--eg btn-success--eg"
                      >
                        {matches ? "Редактировать" : "✎"}
                      </button>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => handleDeleteClick(item.id, item.name)}
                        className="btn--eg btn-danger--eg"
                      >
                        {matches ? "Удалить" : "✕"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
          <div className="mt-3">
            <PaginSortLimit
              admin={true}
              setFetching={setFetching}
              setChange={setChange}
            />
          </div>
        </>
      ) : (
        <p>Список товаров пустой</p>
      )}
    </div>
  );
};

export default AdminProducts;
