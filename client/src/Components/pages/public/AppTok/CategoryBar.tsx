import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { categoryAPI } from "@/api/catalog/categoryAPI";
import { getSearchParams } from "@/scripts/helpers/getSearchParams";
import { SHOP_CATALOG_ROUTE, SHOP_ROUTE } from "@/utils/consts";
import { AppContext } from "@Comp/layout/AppTok/AppContext";

const CategoryBar: React.FC = observer(() => {
  // console.log("CATbar 0 ", 0);
  const { catalog } = useContext(AppContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { category } = getSearchParams(searchParams);

  // признак загрузки данных. // ! врем.откл.
  // const [categoriesFetching, setCategoriesFetching] = useState(false);

  // ^^ пробы в отд.fn
  // const params = async function generateParams(catalog: any);

  // console.log("CATbar category ~~ ", category);
  useEffect(() => {
    // if (category || category === null) {
    // console.log("CATbar usEf 000 ", 0);
    // setCategoriesFetching(true);

    // getAllCategories().then((data: any) => {
    //   console.log("CATbar usEf CAT data ", data);
    //   catalog.categories = data;
    // });
    // .finally(() => setCategoriesFetching(false));
    // console.log("CATbar location.search ", location.search);

    const fetchData = async () => {
      try {
        const data = await categoryAPI.getAllCategories();
        // console.log("CATbar usEf CAT data ", data);
        catalog.categories = data;
      } catch (error) {
        console.error("Ошибка загрузки Категорий:", error);
      }
      // finally {
      // setCategoriesFetching(false);
      // }
    };

    fetchData();
    // }
  }, [category /* , catalog */]);

  // при клике перенаправление на URL маршрут по параметрам поиска
  const redirectToSearchParams = (id: number) => {
    // ^ стар.логика (е/и category = id то перевод в null, иначе id)
    // if (id === catalog.category) {
    //   catalog.category = null;
    // } else {
    //   catalog.category = id;
    // }

    // ^ нов.логика (проверка/вставка/замена id/разделителя(_)значений ч/з регулярные выражения)
    // е/и в category что-то есть
    if (catalog.category !== null) {
      // е/и нет разделителя (_) значений
      if (!String(catalog.category).includes("_")) {
        // е/и category = id, то перевод в null
        if (id === Number(catalog.category)) {
          catalog.category = null;
        }
        // е/и category не = id, то ч/з разделитель добавляем
        else {
          catalog.category = catalog.category + "_" + id;
        }
      }
      // е/и в строке есть разделитель (_) значений
      else {
        // е/и в строке есть id
        if (catalog.category.includes(String(id))) {
          // ^ Позитив.ретроспективная проверка: (?<=Y)X, ищет совпадение с X при условии, что перед ним ЕСТЬ Y.
          // регулярное выражение с перем.
          // let regexp = new RegExp(`(?<=_)` + String(id));

          // е/и перед id есть разделитель (_)
          // ^ str.match(regexp) - ищет совпадения с regexp в строке str. Вызов на строке. Альтер - regexp.exec(str) то же. Вызов на регул.выраж.
          if (
            catalog.category.match(
              // regexp // перем.
              // "(?<=_)" + id // конкатенация
              `(?<=_)${id}` // интерполяция
            )
          ) {
            // убираем разделитель впереди id и сам id из строки
            // ^ str.replace(str|regexp, str|func) - поиска(1ое знач.) и замена(на 2ое знач.)
            catalog.category = catalog.category.replace("_" + id, "");
          }
          // е/и перед id нет разделителя (_), то убираем id и разделитель после него
          else {
            catalog.category = catalog.category.replace(id + "_", "");
          }
        }
        // е/и в строке есть разелитель и нет id, то ч/з разделитель добавляем
        else {
          catalog.category = catalog.category + "_" + id;
        }
      }
    }
    // е/и category пуст, то добавляем id
    else {
      catalog.category = String(id);
    }

    // запись в перем.параметров из catalog
    const params: Record<string, string | number> = {};
    if (catalog.category) params.category = catalog.category;
    if (catalog.brand) params.brand = catalog.brand;
    if (catalog.page > 1) params.page = catalog.page;
    if (catalog.limit !== 20 && catalog.limit !== 0)
      params.limit = catalog.limit;
    if (catalog.sortOrd !== "ASC" || catalog.sortOrd !== null)
      params.sortOrd = catalog.sortOrd!;
    if (catalog.sortField !== "name" || catalog.sortField !== null)
      params.sortField = catalog.sortField!;

    // при наличии (category,brand) отправка на URL /catalog/list + params иначе главная
    if (/* catalog.brand || */ catalog.category) {
      navigate({
        pathname: SHOP_CATALOG_ROUTE,
        search: "?" + createSearchParams(params.toString()),
      });
    } else {
      navigate({
        pathname: SHOP_ROUTE,
        search: "?" + createSearchParams(params.toString()),
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
          Категория
        </button>
        <div className="choice-param__item">
          {/* <>
            {categoriesFetching ? (
              <Spinner animation="border" />
            ) : (
              <> */}
          {catalog.categories.map((item: any) => (
            <label key={item.id}>
              <input
                type="checkbox"
                name={`category.${item.name}`}
                value={item.name}
                checked={String(catalog.category)?.includes(String(item.id))}
                onChange={() => redirectToSearchParams(item.id)}
              />
              <span>{item.name}</span>
            </label>
          ))}
          {/* </>
            )}
          </> */}
        </div>
      </div>
    </>
  );
});

export default CategoryBar;
