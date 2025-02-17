// ^ Один Заказ Usera
import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import { AppContext } from "../../../../context/AppContext";
import Order from "../../../layout/AppTok/Order";

const UserOrder = () => {
  useContext(AppContext);

  const { id } = useParams();

  return (
    <div className="container">
      <h1>Заказ № {/* --order. */ id}</h1>
      <Order data={/* --order. */ id} /* admin={user.isAdmin} */ />
    </div>
  );
};

export default UserOrder;
