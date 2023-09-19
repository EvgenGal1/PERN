import React, { useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { AppContext } from "../../../layout/AppTok/AppContext";
import { SHOP_ROUTE, SHOP_CATALOG_ROUTE } from "../../../../utils/consts";

const BrandBar = observer(() => {
  const { catalog } = useContext(AppContext);

  const navigate = useNavigate();

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
    if (catalog.limit !== (20 || 0)) params.limit = catalog.limit;
    if (catalog.sortOrd !== ("ASC" || null)) params.sortOrd = catalog.sortOrd;
    if (catalog.sortField !== ("name" || null))
      params.sortField = catalog.sortField;

    // при наличии (category,brand) отправка на URL /catalog/list + params иначе главная
    if (catalog.brand || catalog.category) {
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
