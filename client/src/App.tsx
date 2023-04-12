import React /* , { useContext, useEffect, useState } */ from "react";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "./Components/layout/AppRouter";
import NavBar from "./Components/layout/NavBar";
// import NavBar from "./components/NavBar";
// import { observer } from "mobx-react-lite";
// import { Context } from "./index";
// import { check } from "./http/userAPI";
// import { Spinner } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

// const App = observer(() => {
//     const {user} = useContext(Context)
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         check().then(data => {
//             user.setUser(true)
//             user.setIsAuth(true)
//         }).finally(() => setLoading(false))
//     }, [])

//     if (loading) {
//         return <Spinner animation={"grow"}/>
//     }

//     return (
//         <BrowserRouter>
//             <NavBar />
//             <AppRouter />
//         </BrowserRouter>
//     );
// });

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
    // <AppRouter />
  );
};

export default App;
