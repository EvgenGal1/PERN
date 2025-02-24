import React, { useContext, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { AppContext } from "@/context/AppContext";
import { FILTER_ROUTE } from "@/utils/consts";

const Search: React.FC = observer(() => {
  const { catalog } = useContext(AppContext);
  const navigate = useNavigate();
  //  ----------------------------------------------------------------------------------
  const [query, setQuery] = useState("");

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    catalog.products = catalog.products.filter((product) =>
      product.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
  };

  // ^ ПОИСК на FRONT (данн.из БД в Общ.стат)
  const handleClick = (/* id: number */) => {
    navigate({
      pathname: FILTER_ROUTE,
      search:
        /* "?" + */
        createSearchParams({
          category: catalog.filters.category || "",
          brand: catalog.filters.brand || "",
          page: catalog.pagination.page.toString(),
          limit: catalog.pagination.limit.toString(),
          order: catalog.sortSettings.order || "",
          field: catalog.sortSettings.field || "",
        }).toString(),
    });
  };

  return (
    <>
      {/* ПОИСК */}
      <div className="search--eg">
        {/* INP.ПОИСКА */}
        <input
          type="text"
          value={query}
          className="search--eg__inp bbb-1"
          placeholder="Поиск (название, цена)"
          onChange={handleSearchInputChange}
        />
        {/* КНП.РАСШИРЕН/ПОИСКА */}
        <button onClick={handleClick} className="search--eg__btn btn--eg">
          [расширенный поиск]
        </button>
      </div>
    </>
  );
});

export default Search;
