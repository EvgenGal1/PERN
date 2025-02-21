import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { SHOP_CATALOG_ROUTE, SHOP_ROUTE } from "@/utils/consts";
import { AppContext } from "@/context/AppContext";

const BrandBar: React.FC = observer(() => {
  const { catalog } = useContext(AppContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const { brand } = Object.fromEntries(searchParams);
    if (brand) catalog.setBrand(brand || null);
  }, [searchParams]);

  const handleBrandChange = (id: number) => {
    let newBrand: string | null = null;
    if (catalog.filters.brand) {
      const currentBrands = catalog.filters.brand.split("_");
      const index = currentBrands.indexOf(id.toString());
      if (index !== -1) {
        currentBrands.splice(index, 1);
        newBrand = currentBrands.join("_") || null;
      } else {
        currentBrands.push(id.toString());
        newBrand = currentBrands.join("_");
      }
    } else newBrand = id.toString();
    catalog.setBrand(newBrand);

    const pathname = newBrand ? SHOP_CATALOG_ROUTE : SHOP_ROUTE;
    catalog.updateUrlParams(pathname);
  };

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
                checked={
                  catalog.filters.brand
                    ? catalog.filters.brand
                        .split("_")
                        .includes(item.id.toString())
                    : false
                }
                onChange={() => handleBrandChange(item.id)}
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
});

export default React.memo(BrandBar);
