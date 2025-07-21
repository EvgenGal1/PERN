// ^ Список Заказов Usera
import { useContext, useEffect, useState } from "react";

import { orderAPI } from "@/api/shopping/orderAPI";
import { AppContext } from "@/context/AppContext";
import Orders from "@Comp/pages/shop/Orders";
import { OrderData } from "@/types/api/shopping.types";
import LoadingAtom from "@Comp/ui/loader/LoadingAtom";

const UserOrders = () => {
  const { user } = useContext(AppContext);

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orderAPI
      .getAllOrdersUser()
      .then((data) => {
        setFetching(true);
        console.log("UserOrderS data ", data);
        setOrders(data);
      })
      .catch((err) => {
        setError("Не удалось загрузить Заказы");
        console.error("UserOrderS err ", err);
      })
      .finally(() => setFetching(false));
  }, []);

  if (fetching) return <LoadingAtom />;
  if (error) return <div>{error}</div>;

  return (
    <div className="container user-orders">
      <h1>Ваши заказы</h1>
      <Orders items={orders} admin={user.isAdmin} />
    </div>
  );
};

export default UserOrders;
