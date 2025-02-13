// ^ Список Продуктов
import { useContext, useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";
import { productAPI } from "../../../api/catalog/productAPI";
import CreateProduct from "../../layout/AppTok/CreateProduct";
import UpdateProduct from "../../layout/AppTok/UpdateProduct";
import { PaginSortLimit } from "../../layout/AppTok/PaginSortLimit";

const AdminProducts = () => {
  const { catalog }: any = useContext(AppContext);

  // массив загруженных Продуктов
  const [products, setProducts]: any = useState([]);
  // загрузка списка Продуктов с сервера
  const [fetching, setFetching] = useState(true);
  // модальное окно создания Продукта
  const [createShow, setCreateShow] = useState(false);
  // модальное окно редактирования
  const [updateShow, setUpdateShow] = useState(false);
  // обнов.списка/сост.после добав., редактир., удал.
  const [change, setChange] = useState(false);
  // id радактир-го Продукта, для UpdateProduct id
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
    const confirmDel = confirm(`Удалить Продукт - «${name}»`);
    if (confirmDel) {
      productAPI
        .deleteProduct(id)
        .then((/* data */) => {
          // если это последняя страница и мы удаляем на ней единственный оставшийся Продукт — то надо перейти к предыдущей странице
          if (
            catalog.count > 1 &&
            products?.length === 1 &&
            catalog.page === catalog.count
          ) {
            catalog.page = catalog.count - 1;
          } else {
            setChange(!change);
          }
          alert(`Продукт «${name}» удален`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  useEffect(() => {
    productAPI
      .getAllProducts(
        "",
        "",
        catalog.page,
        catalog.limit,
        catalog.sortOrd,
        catalog.sortField
      )
      .then((data) => {
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
      <h1>Продукты</h1>
      {/* Создание Продукта (btn|Комп.Modal) */}
      <button
        onClick={() => setCreateShow(true)}
        className="btn--eg btn-primary--eg"
      >
        Создать Продукт
      </button>
      <CreateProduct
        show={createShow}
        setShow={setCreateShow}
        setChange={setChange}
      />
      {/* Обновление Продукта (Комп.Modal) */}
      <UpdateProduct
        id={product}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
      />
      {/* Табл.Продуктов */}
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
        <p>Список Продуктов пустой</p>
      )}
    </div>
  );
};

export default AdminProducts;
