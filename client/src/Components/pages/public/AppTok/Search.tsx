import React, { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { fetchAllProducts } from "../../../../http/Tok/catalogAPI_Tok";
import SearchItems from "./SearchItems";
import BegPrj_Modal from "../../../ui/Modal/BegPrj_Modal";

const Search = observer(() => {
  const { catalog }: any = useContext(AppContext);

  // ПОИСК
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
        setSearchAll(data.rows);
        // catalog.products = data.rows;
        // catalog.limit = Math.ceil(data.limit);
        // catalog.count = Math.ceil(data.count / data.limit);
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
        catalog.products = data.rows;
        catalog.limit = Math.ceil(data.limit);
        catalog.count = Math.ceil(data.count / data.limit);
      });
    }
  };

  // РАСШИР.ПОИСК
  // блок показа Расшир.Поиска
  const [showExtendedSearch, setShowExtendedSearch] = useState(false);
  const handleBtnClick = () => {
    setShowExtendedSearch((prevState) => !prevState);
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
