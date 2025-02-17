// ^ Один Заказ для Admina
import { useContext } from "react";
import { useParams } from "react-router-dom";

import { AppContext } from "@/context/AppContext";
import Order from "@Comp/layout/AppTok/Order";

const AdminOrder = () => {
  const { id } = useParams();
  const { user }: any = useContext(AppContext);

  return (
    <div className="container">
      <h1>Заказ № {/* --order. */ id}</h1>
      <Order data={/* --order. */ id} admin={user.isAdmin} />
    </div>
  );
};

export default AdminOrder;
