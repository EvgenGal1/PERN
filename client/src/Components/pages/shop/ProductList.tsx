import { observer } from "mobx-react-lite";
import React, { useContext } from "react";

import { AppContext } from "@/context/AppContext";
import { PaginSortLimit } from "@Comp/common/PaginSortLimit";
import ProductItem from "./ProductItem";
import LoadingAtom from "@Comp/ui/loader/LoadingAtom";

const ProductList: React.FC = observer(() => {
  const { catalog } = useContext(AppContext);

  // е/и нет загрузки/Продуктов
  if (catalog?.isLoading === false && catalog?.products.length === 0) {
    return <div>По Вашему запросу ничего не найдено</div>;
  }

  return (
    <>
      {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
      {catalog?.pagination.limit > 10 && !catalog?.isLoading && (
        <PaginSortLimit />
      )}
      <div className="row-mlr--eg">
        {/* СПИСОК ПРОДУКТОВ */}
        {!catalog?.isLoading ? (
          Array.isArray(catalog?.products) &&
          catalog?.products.map((item) => (
            <ProductItem key={item.id} {...item} />
          ))
        ) : (
          <LoadingAtom />
        )}
      </div>
      {/* ПАГИНАЦИЯ | СОРТИРОВКА | ЛИМИТ */}
      {!catalog.isLoading && <PaginSortLimit />}
    </>
  );
});

export default ProductList;
