import React, { useContext, useState } from "react";
// import { Container, Form } from "react-bootstrap";
// import Card from "react-bootstrap/Card";
// import Button from "react-bootstrap/Button";
// import Row from "react-bootstrap/Row";
// import {
//   NavLink,
//   useLocation,
//   /* useHistory */ useNavigate,
// } from "react-router-dom";
// import {
//   UTV_LOGIN_ROUTE,
//   UTV_REGISTRATION_ROUTE,
//   SHOP_ROUTE,
// } from "../../../../utils/consts";
// import { login, registration } from "../../../../http/UTV/userAPI_UTVst";
// import { observer } from "mobx-react-lite";
// import { ContextUTVst } from "../../../../index";

const Auth = () => {
  return <div>Auth</div>;
};

// const Auth = observer(() => {
//   const { user }: any = useContext(ContextUTVst);
//   const location = useLocation();
//   //     const history = useHistory()
//   const navigate = useNavigate();
//   const isLogin = location.pathname === UTV_LOGIN_ROUTE; // LOGIN_ROUTE
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const click = async () => {
//     try {
//       let data;
//       if (isLogin) {
//         data = await login(email, password);
//       } else {
//         data = await registration(email, password);
//       }
//       user.setUser(user);
//       user.setIsAuth(true);
//       // history.push(SHOP_ROUTE)
//       navigate(SHOP_ROUTE);
//     } catch (e: any) {
//       alert(e.response.data.message);
//         }

//     }

//   return (
//     <Container
//       className="d-flex justify-content-center align-items-center"
//       style={{ height: window.innerHeight - 54 }}
//     >
//       <Card style={{ width: 600 }} className="p-5">
//         <h2 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
//         <Form className="d-flex flex-column">
//           <Form.Control
//             className="mt-3"
//             placeholder="Введите ваш email..."
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//                     <Form.Control
//             className="mt-3"
//             placeholder="Введите ваш пароль..."
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             type="password"
//           />
//           <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
//             {isLogin ? (
//               <div>
//                 Нет аккаунта?{" "}
//                 <NavLink to={UTV_REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
//               </div>
//             ) : (
//               <div>
//                 Есть аккаунт? <NavLink to={UTV_LOGIN_ROUTE}>Войдите!</NavLink>
//               </div>
//             )}
//             <Button
//                             variant={"outline-success"}
// onClick={click}>
//               {isLogin ? "Войти" : "Регистрация"}
//             </Button>
//           </Row>
//         </Form>
//       </Card>
//     </Container>
//     );
// });

export default Auth;
