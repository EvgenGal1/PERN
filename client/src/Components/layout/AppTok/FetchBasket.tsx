// ^ HOC-компонент (Компонент высшего порядка).
// Когда пользователь только зашел на сайт — надо запросить с сервера его корзину, если она существует. И показывать в главном меню ссылку на корзину + количество позиций в ней. Для этого создадим HOC-компонент FetchBasket.js и обернем в него ссылку на корзину.
import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import { basketAPI } from "../../../api/shopping/basketAPI";
import { AppContext } from "./AppContext";
// import { BasketData } from "../../../types/api/shopping.types";

const FetchBasket = (props: any /* BasketData */) => {
  const { basket }: any = useContext(AppContext);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    basketAPI
      .getOneBasket()
      .then((data) => (basket.products = data.products))
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return <Spinner animation="border" variant="light" />;
  }

  return props.children;
};

export default FetchBasket;
