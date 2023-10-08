// ^ Один Заказ Usera
import { useContext } from "react";
import { useParams } from "react-router-dom";

import { AppContext } from "../../layout/AppTok/AppContext";
import Order from "../../layout/AppTok/Order";

// ^ упразднено(--)
// import { useState, useEffect } from "react";
// import { Spinner } from "react-bootstrap";
// import { adminGetOne as getOneOrder } from "../../../http/Tok/orderAPI_Tok";
const UserOrder = () => {
  const { user }: any = useContext(AppContext);

  const { id } = useParams();

  // ^ упразднено(--)
  // const [order, setOrder]: any = useState(null);
  // const [fetching, setFetching] = useState(true);
  // const [error, setError] = useState(null);
  // useEffect(() => { getOneOrder(id))}); & if (fetching | error)

  return (
    <div className="container">
      <h1>Заказ № {/* --order. */ id}</h1>
      <Order data={/* --order. */ id} /* admin={user.isAdmin} */ />
    </div>
  );
};

export default UserOrder;
