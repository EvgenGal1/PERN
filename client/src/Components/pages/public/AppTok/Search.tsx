import React, { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { fetchAllProducts } from "../../../../http/Tok/catalogAPI_Tok";

const Search = observer(() => {
  const { catalog }: any = useContext(AppContext);

  // ФИЛЬТРАЦИЯ
  // все данн.с сервера
  const [searchAll, setSearchAll] = useState([]);
  // inp.поиска
  const [searchInput, setSearchInput] = useState("");
  // результ.фильтра
  // const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const filteredData = searchAll.filter(({ name, price, rating }: any) => {
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

  // `Поиск элементов`
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

  return (
    <>
      {/* INP.ПОИСКА */}
      <div className="search">
        <input
          className="search__eg"
          placeholder="Поиск..."
          onChange={(e) => {
            searchItems(e.target.value);
            // ~ асинхр.usSt не даёт нов.знач. Запись напрямую
            setSearchInput(e.target.value);
          }}
        />
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
