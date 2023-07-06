// ^ Список Товаров
import { useContext, useState, useEffect } from "react";
import { Button, Container, Spinner, Table, Pagination } from "react-bootstrap";

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
  // для обновления списка после добавления, редактирования, удаления — изменяем состояние
  const [change, setChange] = useState(false);
  // id товара, который будем редактировать — для передачи в <UpdateProduct id={…} />
  const [product, setProduct] = useState(null);

  // текущая страница списка товаров
  // const [currentPage, setCurrentPage] = useState(1);
  // сколько всего страниц списка товаров
  // const [totalPages, setTotalPages] = useState(1);

  // скрытие/показ от ширины экрана
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );
  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  // обраб.КЛИК по № СТР.
  const handlePageClick = (page: any) => {
    // setCurrentPage(page);
    catalog.currentPage = page;
    setFetching(true);
  };
  // содер.Комп.`Страница`
  const pages: any = [];
  // for (let page = 1; page <= totalPages; page++) {
  for (let page = 1; page <= catalog.totalPages; page++) {
    pages.push(
      <Pagination.Item
        key={page}
        // active={page === currentPage}
        active={page === catalog.currentPage}
        activeLabel=""
        onClick={() => handlePageClick(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

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
          catalog.totalPages > 1 &&
          products?.length === 1 &&
          // currentPage === catalog.totalPages
          catalog.currentPage === catalog.totalPages
        ) {
          // setCurrentPage(currentPage - 1);
          catalog.currentPage = catalog.totalPages - 1;
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
      // currentPage,
      catalog.currentPage,
      catalog.limit,
      catalog.sortOrd,
      catalog.sortField
    )
      .then((data) => {
        setProducts(data.rows);
        // setTotalPages(Math.ceil(data.count / catalog.limit));
        catalog.totalPages = Math.ceil(data.count / catalog.limit);
      })
      .finally(() => setFetching(false));
  }, [
    catalog,
    change,
    // currentPage,
    catalog.currentPage,
    catalog.limit,
    catalog.sortOrd,
    catalog.sortField,
  ]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <Container>
      <h1>Товары</h1>
      {/* Создание Товара (btn|Комп.Modal) */}
      <Button
        onClick={() => setCreateShow(true)}
        variant="primary"
        className="btn-primary__eg"
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
      {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
      <PaginSortLimit
        totalPages={catalog.totalPages}
        pages={pages}
        setChange={setChange}
      />
      {/* Табл.Товаров */}
      {products.length > 0 ? (
        <>
          <Table bordered hover size="sm" className="mt-3 table__eg">
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
              {products.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td style={{ textAlign: "center" }}>
                    {item.image && (
                      <a
                        href={process.env.REACT_APP_IMG_URL_TOK + item.image}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {/* фото */}
                        <img
                          alt=""
                          src={process.env.REACT_APP_IMG_URL_TOK + item.image}
                          width={50}
                          height={50}
                        />
                      </a>
                    )}
                  </td>
                  <td>{item.category?.name || "NULL"}</td>
                  <td>{item.brand?.name || "NULL"}</td>
                  <td>{item.price}</td>
                  <td>{item.rating}</td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleUpdateClick(item.id)}
                      className="btn-success__eg"
                    >
                      {matches ? "Редактировать" : "✎"}
                    </Button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(item.id)}
                      className="btn-danger__eg"
                    >
                      {matches ? "Удалить" : "✕"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
          <PaginSortLimit
            // totalPages={totalPages}
            totalPages={catalog.totalPages}
            pages={pages}
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
