// ^ Список Товаров
import { useContext, useState, useEffect } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";

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
  const [product, setProduct] = useState(null);

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
  const handleUpdateClick = (id: any) => {
    setProduct(id);
    setUpdateShow(true);
  };
  // удал.эл.
  const handleDeleteClick = (id: any) => {
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
        alert(`Товар «${data.name}» удален`);
      })
      .catch((error) => alert(error.response.data.message));
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
        setProducts(data.rows);
        console.log("PSL usEf 1 data ", data);
        let InterLimit = catalog.limit;
        if (catalog.limit === 0) InterLimit = /* data.rows.length */ 11;
        catalog.limit = Math.ceil(data.limit);
        catalog.InterLimit = Math.ceil(data.limit);
        catalog.count = Math.ceil(data.count / data.limit);
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
    <Container>
      <h1>Товары</h1>
      {/* Создание Товара (btn|Комп.Modal) */}
      <Button
        onClick={() => setCreateShow(true)}
        variant="primary"
        className="btn-primary--eg"
      >
        Создать товар
      </Button>
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
          <PaginSortLimit
            admin={true}
            setFetching={setFetching}
            setChange={setChange}
          />
          <Table bordered hover size="sm" className="mt-3 table--eg">
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
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleUpdateClick(item.id)}
                        className="btn-success--eg"
                      >
                        {matches ? "Редактировать" : "✎"}
                      </Button>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(item.id)}
                        className="btn-danger--eg"
                      >
                        {matches ? "Удалить" : "✕"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
          <PaginSortLimit
            admin={true}
            setFetching={setFetching}
            setChange={setChange}
          />
        </>
      ) : (
        <p>Список товаров пустой</p>
      )}
    </Container>
  );
};

export default AdminProducts;
