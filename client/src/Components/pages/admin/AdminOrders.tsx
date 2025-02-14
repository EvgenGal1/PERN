// ^ Список Заказов для Admina
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import { orderAPI } from "../../../api/shopping/orderAPI";
import Orders from "../../layout/AppTok/Orders";

const AdminOrders = () => {
  const [orders, setOrders] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    orderAPI
      .getAllOrders()
      .then((data: any) => setOrders(data))
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="container">
      <h1>Все заказы</h1>
      <Orders items={orders} admin={true} />
    </div>
  );
};

export default AdminOrders;
