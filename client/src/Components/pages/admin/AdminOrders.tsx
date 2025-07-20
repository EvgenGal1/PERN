// ^ Список Заказов для Admina
import { useEffect, useState } from "react";

import { orderAPI } from "@api/shopping/orderAPI";
import Orders from "@Comp/pages/shop/Orders";
import LoadingAtom from "@Comp/ui/loader/LoadingAtom";

const AdminOrders = () => {
  const [orders, setOrders] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    orderAPI
      .getAllOrdersAdmin()
      .then((data: any) => setOrders(data))
      .finally(() => setFetching(false));
  }, []);

  if (fetching) return <LoadingAtom />;

  return (
    <div className="container">
      <h1>Все заказы</h1>
      <Orders items={orders} admin={true} />
    </div>
  );
};

export default AdminOrders;
