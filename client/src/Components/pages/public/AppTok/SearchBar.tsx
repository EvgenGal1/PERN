import React, { useState, useContext } from "react";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";

const SearchBar = observer(() => {
  const { catalog }: any = useContext(AppContext);

  // ФИЛЬТРАЦИЯ
  // inp.поиска
  const [searchInput, setSearchInput] = useState("");
  // результ.фильтра
  const [filteredResults, setFilteredResults] = useState([]);
  // `Поиск элементов`
  const searchItems = (searchValue: any) => {
    // ~ асинхр.usSt не даёт нов.знач.
    // setSearchInput(searchValue);
    // ~ стра.версия
    // const filteredData = catalog.products.filter((item: any) => {
    //   return Object.values(item).join("").toLowerCase().includes(searchInput.toLowerCase());
    // });
    // return name.toLowerCase().includes(searchInput.toLowerCase());
    // ~ нов.версия
    if (searchValue !== "") {
      const filteredData = catalog.products.filter(
        ({ name, price, rating }: any) => {
          if (
            name.toLowerCase().includes(searchValue.toLowerCase()) ||
            String(price).includes(searchValue) ||
            String(rating).includes(searchValue)
          ) {
            return name;
          }
        }
      );
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(catalog.products);
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
      {searchInput.length > 0 ? (
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
      )}
    </>
  );
});

export default SearchBar;
