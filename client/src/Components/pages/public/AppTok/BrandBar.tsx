import React, { useContext, useEffect /* , useState */ } from "react";
import {
  useNavigate,
  createSearchParams,
  useSearchParams,
} from "react-router-dom";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { SHOP_ROUTE, SHOP_CATALOG_ROUTE } from "../../../../utils/consts";
import { fetchBrands } from "../../../../http/Tok/catalogAPI_Tok";
import { getSearchParams } from "../../../../scripts/helpers/getSearchParams";

const BrandBar = observer(() => {
  // console.log("BrandBar 0 ", 0);
  const { catalog } = useContext(AppContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // признак загрузки данных. // ! врем.откл.
  // const [brandsFetching, setBrandsFetching] = useState(true);

  const { brand } = getSearchParams(searchParams);

  if (brand || brand === null) {
    // console.log("BRANDbar brand ~~ ", brand);
    useEffect(() => {
      // console.log("BRANDbar usEf 000 ", 0);
      // setBrandsFetching(true);

      const fetchData = async () => {
        try {
          const data = await fetchBrands();
          // console.log("BRANDbar usEf BRD data ", data);
          catalog.brands = data;
        } catch (error) {
          console.error("Ошибка загрузки Брендов>:", error);
        } finally {
          // setBrandsFetching(false);
        }
      };

      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  }

  // при клике перенаправление на URL маршрут по параметрам поиска
  const redirectToSearchParams = (id: number) => {
    // проверка/вставка/замена id/разделителя(_)значений ч/з регулярные выражения
    if (catalog.brand !== null)
      if (!String(catalog.brand).includes("_"))
        catalog.brand =
          id === Number(catalog.brand) ? null : catalog.brand + "_" + id;
      else if (catalog.brand.includes(String(id)))
        catalog.brand = catalog.brand.match(`(?<=_)${id}`)
          ? catalog.brand.replace("_" + id, "")
          : catalog.brand.replace(id + "_", "");
      else catalog.brand = catalog.brand + "_" + id;
    else catalog.brand = id;

    // запись в перем.параметров из catalog
    const params: any = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit !== 20 || catalog.limit !== 0)
      params.limit = catalog.limit;
    if (catalog.sortOrd !== "ASC" || catalog.sortOrd !== null)
      params.sortOrd = catalog.sortOrd;
    if (catalog.sortField !== "name" || catalog.sortField !== null)
      params.sortField = catalog.sortField;

    // при наличии (category,brand) отправка на URL /catalog/list + params иначе главная
    if (catalog.brand /* || catalog.category */) {
      navigate({
        pathname: SHOP_CATALOG_ROUTE,
        search: "?" + createSearchParams(params),
      });
    } else {
      navigate({
        pathname: SHOP_ROUTE,
        search: "?" + createSearchParams(params),
      });
    }
  };

  // показ блока с Параметрами
  const handleClickChoiceParam = (event: any) => {
    event.currentTarget.classList.toggle("choice-param-show");
  };

  return (
    <>
      <div className="choice-param bbb-2" /* ef-bs */>
        <button className="choice-param__btn" onClick={handleClickChoiceParam}>
          Бренды
        </button>
        <div className="choice-param__item">
          {catalog.brands.map((item: any) => (
            <label key={item.id}>
              <input
                type="checkbox"
                name={`brand.${item.name}`}
                value={item.name}
                onChange={() => redirectToSearchParams(item.id)}
                checked={String(catalog.brand)?.includes(String(item.id))}
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
});

export default BrandBar;
