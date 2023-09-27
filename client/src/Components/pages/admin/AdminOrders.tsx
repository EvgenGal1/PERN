// ^ Список Заказов для Admina
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { adminGetAll as getAllOrders } from "../../../http/Tok/orderAPI_Tok";
import Orders from "../../layout/AppTok/Orders";

const AdminOrders = () => {
  const [orders, setOrders] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getAllOrders()
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
