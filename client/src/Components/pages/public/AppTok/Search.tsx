import React, { useState, useEffect, useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { fetchAllProducts } from "../../../../http/Tok/catalogAPI_Tok";
import SearchItems from "./SearchItems";
// import BegPrj_Modal from "../../../ui/Modal/BegPrj_Modal";

const Search = observer(() => {
  const { catalog }: any = useContext(AppContext);
  const navigate = useNavigate();

  // ^ ПОИСК на FRONT (данн.из БД в отд.стат)
  // все данн.с сервера
  const [searchAll, setSearchAll] = useState([]);
  // inp.поиска
  const [searchInput, setSearchInput] = useState("");
  // результ.поиска
  // const [filteredResults, setFilteredResults] = useState([]);

  // по измен.searchAll,searchInput,catalog начин.фильтр.из searchAll
  useEffect(() => {
    const filteredData = searchAll.filter(({ name, price, rating }: any) => {
      // const filteredData = catalog.products.filter(({ name, price, rating }: any) => {
      if (
        name.toLowerCase().includes(searchInput.toLowerCase()) ||
        String(price).includes(searchInput) ||
        String(rating).includes(searchInput)
      ) {
        return name;
      }
    });
    catalog.products = filteredData;
  }, [searchAll, searchInput, catalog]);

  // `Поиск элементов`. Загр.ВСЕХ Товаров в searchAll
  const searchItems = async (searchValue: any) => {
    console.log("SEH searchValue ", searchValue);
    if (searchValue !== "") {
      await fetchAllProducts(
        catalog.category,
        catalog.brand,
        catalog.page,
        // catalog.limit,
        10000,
        catalog.sortOrd,
        catalog.sortField
      ).then((data: any) => {
        // console.log("SEH IF data ", data);
        setSearchAll(data.rows);
        catalog.limit = Math.ceil(catalog.limit);
      });
    } else {
      fetchAllProducts(
        catalog.category,
        catalog.brand,
        catalog.page,
        catalog.limit,
        catalog.sortOrd,
        catalog.sortField
      ).then((data: any) => {
        // console.log("SEH ELSE data ", data);
        catalog.products = data.rows;
        catalog.limit = Math.ceil(data.limit);
        catalog.count = data.count;
      });
    }
  };

  // ^ РАСШИР.ПОИСК на FRONT (данн.из БД в отд.стат)
  // блок показа Расшир.Поиска
  const [showExtendedSearch, setShowExtendedSearch] = useState(false);
  const handleBtnClick = () => {
    setShowExtendedSearch((prevState) => !prevState);
  };

  // ^ ПОИСК на FRONT (данн.из БД в Общ.стат)
  const handleClick = (id: number) => {
    if (id === catalog.category) {
      catalog.category = null;
    } else {
      catalog.category = id;
    }
    // при каждом клике добавляем в историю браузера новый элемент
    const params: any = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit) params.limit = catalog.limit;
    if (catalog.sortOrd) params.sortOrd = catalog.sortOrd;
    if (catalog.sortField) params.sortField = catalog.sortField;
    navigate({
      pathname: "/",
      search: "search?" + createSearchParams(params),
    });
  };

  return (
    <>
      {/* РАСШИР.ПОИСК */}
      {showExtendedSearch && (
        <SearchItems
          show={showExtendedSearch}
          setShow={setShowExtendedSearch}
        />
      )}
      {/* {showExtendedSearch && <BegPrj_Modal />} */}
      {/* ПОИСК */}
      <div className="search--eg">
        {/* INP.ПОИСКА */}
        <input
          className="search--eg__inp"
          placeholder="Поиск (название, цена)"
          onChange={(e) => {
            searchItems(e.target.value);
            // ~ асинхр.usSt не даёт нов.знач. Запись напрямую
            setSearchInput(e.target.value);
          }}
        />
        {/* КНП.РАСШИРЕН/ПОИСКА */}
        <button
          onClick={() => {
            handleBtnClick();
          }}
          className="search--eg__btn btn--eg"
        >
          [расширенный поиск]
        </button>
      </div>
      {/* СПИСОК ПРОДУКТОВ */}
      {/* {searchInput.length > 0 ? (
        // ПО ПОИСКУ
        filteredResults.length !== 0 ? (
          filteredResults.map((item: any) => {
            return <p></p>; // <ProductItem key={item.id} data={item} />;
          })
        ) : (
          <p className="m-3">По вашему запросу ничего не найдено</p>
        )
      ) : catalog.products.length ? (
        // ПО УМОЛЧАНИЮ
        catalog.products.map((item: any) => (
          // <ProductItem key={item.id} data={item} />
          <p>{item}</p>
        ))
      ) : (
        <p className="m-3">По вашему запросу ничего не найдено</p>
      )} */}
    </>
  );
});

export default Search;
