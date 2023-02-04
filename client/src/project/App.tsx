import React, { FC } from "react";
import "./App.css";
import LoginForm from "./client/src/components/LoginForm";

const App: FC = () => {
  return (
    <div className="App">
      <LoginForm />
    </div>
  );
};

export default App;
