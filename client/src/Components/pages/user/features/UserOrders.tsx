// ^ Список Заказов Usera
import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import { orderAPI } from "@/api/shopping/orderAPI";
import { AppContext } from "@/context/AppContext";
import Orders from "@Comp/pages/shop/Orders";

const UserOrders = () => {
  const { user }: any = useContext(AppContext);

  const [orders, setOrders]: any = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    orderAPI
      .getAllOrdersUser()
      .then((data) => {
        console.log("UserOrderS data ", data);
        setOrders(data);
      })
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="container">
      <h1>Ваши заказы</h1>
      <Orders items={orders} admin={user.isAdmin} />
    </div>
  );
};

export default UserOrders;
