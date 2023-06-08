// ^ Один Заказ для Admina
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";

import { adminGetOne as getOneOrder } from "../../../http/Tok/orderAPI_Tok";
import Order from "../../layout/AppTok/Order";

const AdminOrder = () => {
  const { id } = useParams();
  const [order, setOrder]: any = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOneOrder(id)
      .then((data) => setOrder(data))
      .catch((error) => setError(error.response.data.message))
      .finally(() => setFetching(false));
  }, [id]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container>
      <h1>Заказ № {order.id} (adm.ord ~!)</h1>
      <Order data={order} admin={true} />
    </Container>
  );
};

export default AdminOrder;
