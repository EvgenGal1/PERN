import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { brandAPI } from "@/api/catalog/brandAPI";
import { getSearchParams } from "@/scripts/helpers/getSearchParams";
import { SHOP_CATALOG_ROUTE, SHOP_ROUTE } from "@/utils/consts";
import { AppContext } from "@Comp/layout/AppTok/AppContext";

const BrandBar: React.FC = observer(() => {
  // console.log("BrandBar 0 ", 0);
  const { catalog } = useContext(AppContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // признак загрузки данных. // ! врем.откл.
  // const [brandsFetching, setBrandsFetching] = useState(true);

  const { brand } = getSearchParams(searchParams);

  // console.log("BRANDbar brand ~~ ", brand);
  useEffect(() => {
    if (brand || brand === null) {
      // console.log("BRANDbar usEf 000 ", 0);
      // setBrandsFetching(true);

      const fetchData = async () => {
        try {
          const data = await brandAPI.getAllBrands();
          // console.log("BRANDbar usEf BRD data ", data);
          catalog.brands = data;
        } catch (error) {
          console.error("Ошибка загрузки Брендов>:", error);
        } finally {
          // setBrandsFetching(false);
        }
      };

      fetchData();
    }
  }, [brand /* , catalog */]);

  // при клике перенаправление на URL маршрут по параметрам поиска
  const redirectToSearchParams = (id: number) => {
    // проверка/вставка/замена id/разделителя(_)значений ч/з регулярные выражения
    let newBrand = "";
    if (catalog.brand !== null) {
      if (!String(catalog.brand).includes("_")) {
        newBrand = id === Number(catalog.brand) ? "" : catalog.brand + "_" + id;
      } else {
        if (catalog.brand.includes(String(id))) {
          newBrand = catalog.brand.replace("_" + id, "");
        } else {
          newBrand = catalog.brand + "_" + id;
        }
      }
    } else {
      newBrand = String(id);
    }

    // запись в перем.параметров из catalog
    const params: Record<string, string | number> = {};
    if (catalog.category) params.category = catalog.category;
    // if (catalog.brand) params.brand = catalog.brand;
    if (newBrand) params.brand = newBrand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit !== 20 && catalog.limit !== 0)
      params.limit = catalog.limit;
    if (catalog.sortOrd !== "ASC" || catalog.sortOrd !== null)
      params.sortOrd = catalog.sortOrd!;
    if (catalog.sortField !== "name" || catalog.sortField !== null)
      params.sortField = catalog.sortField!;

    // при наличии (category,brand) отправка на URL /catalog/list + params иначе главная
    navigate({
      pathname: newBrand ? SHOP_CATALOG_ROUTE : SHOP_ROUTE,
      search: "?" + createSearchParams(params.toString()),
    });
    catalog.brand = newBrand;
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
          {catalog.brands.map((item) => (
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
