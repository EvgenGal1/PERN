// ^ Список Заказов для Admina
import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";

import { adminGetAll as getAllOrders } from "../../../http/Tok/orderAPI_Tok";
import Orders from "../../layout/AppTok/Orders";

const AdminOrders = () => {
  const [orders, setOrders] = useState(null);
  const [fetching, setFetching] = useState(true);

  console.log("CLT admOrdS orders ", orders);

  useEffect(() => {
    getAllOrders()
      .then((data: any) => setOrders(data))
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <Container>
      <h1>Все заказы (adm.ordS ~!)</h1>
      <Orders items={orders} admin={true} />
    </Container>
  );
};

export default AdminOrders;
