import React, { useState, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

import { AppContext } from "../../layout/AppTok/AppContext";
import CreateBrand from "../../layout/AppTok/CreateBrand";
import CreateDevice from "../../layout/AppTok/CreateCategory";
// import CreateType from "../components/modals/CreateType";
import { logout } from "../http/../../../http/Tok/userAPI_Tok";

// ^ врем.заглушка
// const Admin = () => {
//   return <div>Admin</div>;
// };

// ^ стар.код.
// const Admin = () => {
//   const [brandVisible, setBrandVisible] = useState(false);
//   const [typeVisible, setTypeVisible] = useState(false);
//   const [deviceVisible, setDeviceVisible] = useState(false);

//   return (
//     <Container className="d-flex flex-column">
//       <Button
//         variant={"outline-dark"}
//         className="mt-4 p-2"
//         onClick={() => setTypeVisible(true)}
//       >
//         Добавить тип
//       </Button>
//       <Button
//         variant={"outline-dark"}
//         className="mt-4 p-2"
//         onClick={() => setBrandVisible(true)}
//       >
//         Добавить бренд
//       </Button>
//       <Button
//         variant={"outline-dark"}
//         className="mt-4 p-2"
//         onClick={() => setDeviceVisible(true)}
//       >
//         Добавить устройство
//       </Button>
//       <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
//       <CreateDevice
//         show={deviceVisible}
//         onHide={() => setDeviceVisible(false)}
//       />
//       <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
//     </Container>
//   );
// };

// ^ код.с github
const Admin = () => {
  const { user }: any = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = (event: any) => {
    logout();
    user.logout();
    navigate("/login", { replace: true });
  };

  return (
    <Container>
      <h1>Панель управления</h1>
      <p>Это панель управления магазином для администратора</p>
      <ul>
        <li>
          <Link to="/admin/orders">Заказы в магазине</Link>
        </li>
        <li>
          <Link to="/admin/categories">Категории каталога</Link>
        </li>
        <li>
          <Link to="/admin/brands">Бренды каталога</Link>
        </li>
        <li>
          <Link to="/admin/products">Товары каталога</Link>
        </li>
      </ul>
      <Button onClick={handleLogout}>Выйти</Button>
    </Container>
  );
};

export default Admin;
