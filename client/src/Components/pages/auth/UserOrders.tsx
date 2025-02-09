// ^ Список Заказов Usera
import { useContext, useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";
import { orderAPI } from "../../../api/shopping/orderAPI";
import Orders from "../../layout/AppTok/Orders";

const UserOrders = () => {
  const { user }: any = useContext(AppContext);

  const [orders, setOrders]: any = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    orderAPI
      .getAllOrders()
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
