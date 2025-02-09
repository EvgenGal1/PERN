import { useState, useEffect, useContext, useCallback } from "react";
import {
  useNavigate,
  createSearchParams /* , Navigate */,
} from "react-router-dom";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { productAPI } from "../../../../api/catalog/productAPI";
import { ProductData } from "../../../../types/api/catalog.types";
import { FILTER_ROUTE } from "../../../../utils/consts";

const Search = observer(() => {
  const { catalog } = useContext(AppContext);
  const navigate = useNavigate();

  // ^ ПОИСК на FRONT (данн.из БД в отд.стат)
  // все данн.с сервера
  const [searchAll, setSearchAll]: any = useState<ProductData>();
  // inp.поиска
  const [searchInput, setSearchInput] = useState("");
  // результ.поиска
  // const [filteredResults, setFilteredResults] = useState([]);

  // Fn загр.всех Продуктов
  const loadProducts = useCallback(
    async (limit: number): Promise<void> => {
      const data = await productAPI.getAllProducts(
        // ! ошб.типа, логики и передачи
        catalog.category!,
        catalog.brand!,
        catalog.page,
        /* catalog.limit || 10000 */ limit,
        catalog.sortOrd!,
        catalog.sortField!
        // additionalParams
      );

      setSearchAll(data.rows);
      catalog.products = data.rows;
      catalog.count = data.count;
    },
    [catalog]
  );

  useEffect(() => {
    loadProducts(/* 10000 */ 20); // Загружаем минимум /* все */ продукты при первом рендере
  }, [loadProducts]);

  // по измен.searchAll,searchInput,catalog начин.фильтр.из searchAll
  // ?
  useEffect(() => {
    catalog.products /* const filteredData */ = /* return */ searchAll.filter(
      ({ name, price, rating }: ProductData) => {
        return (
          name.toLowerCase().includes(searchInput.toLowerCase()) ||
          String(price).includes(searchInput) ||
          String(rating).includes(searchInput)
        );
      }
    );
  }, [searchAll, searchInput, catalog]);

  // ^ РАСШИР.ПОИСК на FRONT (данн.из БД в отд.стат)
  // блок показа Расшир.Поиска
  // const [showExtendedSearch, setShowExtendedSearch] = useState(false);
  // const handleBtnClick = () => {
  //   setShowExtendedSearch((prevState) => !prevState);
  // };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // ^ ПОИСК на FRONT (данн.из БД в Общ.стат)
  const handleClick = (/* id: number */) => {
    navigate({
      pathname: FILTER_ROUTE,
      search:
        /* "?" + */
        createSearchParams({
          category: catalog.category || "",
          brand: catalog.brand || "",
          page: String(catalog.page),
          limit: String(catalog.limit),
          sortOrd: catalog.sortOrd || "",
          sortField: catalog.sortField || "",
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
          value={searchInput}
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
