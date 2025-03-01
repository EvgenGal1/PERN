import { observer } from "mobx-react-lite";
import React, { useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { SHOP_CATALOG_ROUTE, SHOP_ROUTE } from "@/utils/consts";
import { AppContext } from "@/context/AppContext";

const CategoryBar: React.FC = observer(() => {
  // стор Каталога, парам.URL, сост.списка эл.
  const { catalog } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // получ.парам.из URL и сохр.в стор с зависим.от парам.URL
  useEffect(() => {
    const { category } = Object.fromEntries(searchParams);
    if (category) catalog.setCategory(category || null);
  }, [searchParams]);

  // обраб.клик > сохр.нов.знач.эл.фильтра и обнов.парам.URL
  const handleCategoryChange = (id: number) => {
    // нов.знач.
    let newCategory: string | null = null;
    // есть выбранные эл.
    if (catalog.filters.category) {
      // разбивка по `_` на масс.ID и поиск переданного ID
      const currentCategories = catalog.filters.category.split("_");
      const index = currentCategories.indexOf(id.toString());
      // е/и есть - удал.ID из списка, обнов.или null
      if (index !== -1) {
        currentCategories.splice(index, 1);
        newCategory = currentCategories.join("_") || null;
      }
      // е/и нет - добав.ID/обнов.списка
      else {
        currentCategories.push(id.toString());
        newCategory = currentCategories.join("_");
      }
    }
    // нет выбранных + перв.эл.
    else newCategory = id.toString();
    // запись знач.в стор
    catalog.setCategory(newCategory);
    // опред.путь > catalog или shop и обнов.парам.URL
    const pathname = newCategory ? SHOP_CATALOG_ROUTE : SHOP_ROUTE;
    catalog.updateUrlParams(pathname);
  };

  // показ блока с Параметрами
  const handleClickChoiceParam = (/* event: any */) => {
    // event.currentTarget.classList.toggle("choice-param-show"); // стар.подход без usSt
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="choice-param bbb-2" /* ef-bs */>
        <button
          className={`choice-param__btn ${isOpen ? "choice-param-show" : ""}`}
          onClick={handleClickChoiceParam}
        >
          Категория
        </button>
        <div className={`choice-param__item ${isOpen ? "visible" : "hidden"}`}>
          {catalog.categories.map((item) => (
            <label key={item.id}>
              <input
                type="checkbox"
                name={`category.${item.name}`}
                value={item.name}
                checked={
                  catalog.filters.category
                    ?.split("_")
                    .includes(item.id.toString()) || false
                }
                onChange={() => handleCategoryChange(item.id)}
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
});

export default React.memo(CategoryBar);
