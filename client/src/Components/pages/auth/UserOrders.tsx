// ^ Список Заказов Usera
import { useContext, useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";
import { userGetAll as getAllOrders } from "../../../http/Tok/orderAPI_Tok";
import Orders from "../../layout/AppTok/Orders";

const UserOrders = () => {
  const { user }: any = useContext(AppContext);

  const [orders, setOrders] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getAllOrders()
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
