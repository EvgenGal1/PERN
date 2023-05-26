import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";

import { userGetAll as getAllOrders } from "../../../http/Tok/orderAPI_Tok";
import Orders from "../../layout/AppTok/Orders";

const UserOrders = () => {
  const [orders, setOrders] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then((data) => setOrders(data))
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <Container>
      <h1>Ваши заказы</h1>
      <Orders items={orders} admin={false} />
    </Container>
  );
};

export default UserOrders;
