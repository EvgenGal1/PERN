import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "./Components/layout/AppRouter";
import NavBar from "./Components/layout/NavBar";
// import { observer } from "mobx-react-lite";
import { ContextUTVst } from "./index";
import { check } from "./http/userAPI_UTVst";
import { Spinner } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

const AppUTV = /* observer( */ () => {
  const { user }: any = useContext(ContextUTVst);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    check()
      .then((data) => {
        user.setUser(true);
        user.setIsAuth(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner animation={"grow"} />;
  }

  return (
    <BrowserRouter>
      {/* // ! прописать отд. ТфмИфк и AppRouter для AppUTV */}
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
}; /* ) */

export default AppUTV;
