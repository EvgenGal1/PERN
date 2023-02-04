import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import { Prob1 } from "./Prob1";
import { Prob2 } from "./Prob2";

export function Prob0() {
  return (
    // ~ испробовать <SwitchTransition mode={mode}> <CSSTransition key={toggle} из R|A
    <div className="prob0">
      <div className="prob0__body">
        <h1>prob0</h1>
        <p>Пример вложенных страниц со вторым меню на самой странице</p>
      </div>
      <hr />
      <div className="prob0__nav">
        <nav>
          <NavLink to="Prob1">Prob1</NavLink>
          <NavLink to="Prob2">Prob2</NavLink>
        </nav>
      </div>
      <hr />
      <div className="prob0__pages">
        <Routes>
          <Route path="Prob1" element={<Prob1 />} />
          <Route path="Prob2" element={<Prob2 />} />
        </Routes>
      </div>
    </div>
  );
}
