import React /* , { useState, useRef } */ from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// аним ч/з react-transition-group
// import { CSSTransition } from "react-transition-group";
// аним ч/з react-spring. выбор изза возможности в родителе откр. стр.дочки
import { useTransition, animated } from "react-spring";

// Глав.Эл.Шаблона
import { Header } from "./Header";
import { Footer } from "./Footer";
// Страницы
import { Prob0 } from "../pages/Prob0";
import { Prob1 } from "../pages/Prob1";
import { Prob2 } from "../pages/Prob2";
import { AboutMe } from "../pages/AboutMe";
// НОВ.ПРОЕКТ
import { NewPro } from "../../projects/NewPro/NewPro";
// НОВ.ПРОЕКТЫ ExpsMiniProjs
import { BeginrProjts } from "../../projects/BeginrProjts/BeginrProjts";
import { BegPrj_Modal } from "../../projects/BeginrProjts/src/pages/BegPrj_Modal";
import { BegPrj_Quiz } from "../../projects/BeginrProjts/src/pages/BegPrj_Quiz";
import { BegPrj_Users } from "../../projects/BeginrProjts/src/pages/BegPrj_Users";
// НОВ.ПРОЕКТЫ UlbiTV
import { UlbiTV } from "../../projects/UlbiTV/UlbiTV";
import { UlbiTV_MiniDrADr } from "../../projects/UlbiTV/src/pages/UlbiTV_MiniDrADr";
import { UlbiTV_DrADr } from "../../projects/UlbiTV/src/pages/UlbiTV_DrADr";
// НОВ.ПРОЕКТЫ с ФОРМАМИ
import { FORMS } from "../../projects/FORMS/FORMS";
import { FormMN } from "../../projects/FORMS/src/pages/FormMN/FormMN";
import { FormDoc } from "../../projects/FORMS/src/pages/FormDoc/FormDoc";
// НОВ.ПРОЕКТЫ с ЕЖЕДНЕВНИКОМ
import { DailyPlanner } from "../../projects/DailyPlanner/DailyPlanner";
import { FullCalendarFC } from "../../projects/DailyPlanner/src/pages/FullCalendar/FullCalendarFC";
import { DayPlanToDo } from "../../projects/DailyPlanner/src/pages/DayPlanToDo/DayPlanToDo";
import { MyDPTD } from "../../projects/DailyPlanner/src/pages/MyDPTD/MyDPTD";
import { ToDoReactIcon } from "../../projects/DailyPlanner/src/pages/ToDoReactIcon/ToDoReactIcon";

// для аним ч/з react-transition-group
// import "./Router.scss";
// import { Layout } from "./layout.jsx";

export function Router() {
  // анимация страниц
  const location = useLocation();
  const transitions = useTransition(location, {
    from: {
      opacity: 0,
      // transform: "translateX(100%)",
      transform: "scale(1.5) ",
      // transform: "scale(1.1) translateY(-150px)",
      // transform: "translateY(-150px)",
      transitionTimingFunction: "ease",
      // transitionDelay: ".5s",
    },
    enter: {
      opacity: 1,
      // transform: "translateX(0%)",
      transform: "scale(1) ",
      // transform: "scale(1) translateY(0%)",
      // transform: "translateY(0%)",
      transitionTimingFunction: "ease",
      // transitionDelay: ".5s",
    },
    leave: {
      opacity: 0,
      // transform: "translateX(-100%)",
      transform: "scale(0.5)",
      // transform: "scale(0.9) translateY(-100px)",
      // transform: "translateY(-150px)",
      transitionTimingFunction: "ease",
      // transitionDelay: ".5s",
      position: "absolute",
    },
  });
  return (
    <>
      <Header />
      {/* для аним ч/з react-spring */}
      {transitions((props, item) => (
        <animated.main className="main " style={props}>
          {/* <div
            className="container"
            style={{ width: "100%", overflow: "hidden", padding: "0px 5%" }}
          > */}
          <Routes location={item}>
            <Route index element={<NewPro />} />
            <Route path="NewPro" element={<NewPro />} />
            {/* ExpsMiniProjs */}
            {/* BeginrProjts */}
            <Route path="BeginrProjts/*" element={<BeginrProjts />} />
            <Route path="BegPrj_Modal" element={<BegPrj_Modal />} />
            <Route path="BegPrj_Quiz" element={<BegPrj_Quiz />} />
            <Route path="BegPrj_Users" element={<BegPrj_Users />} />
            {/* UlbiTV */}
            <Route path="UlbiTV/*" element={<UlbiTV />} />
            <Route path="UlbiTV_MiniDrADr" element={<UlbiTV_MiniDrADr />} />
            <Route path="UlbiTV_DrADr" element={<UlbiTV_DrADr />} />
            {/* FORMS */}
            <Route path="FORMS/*" element={<FORMS />} />
            <Route path="FormMN" element={<FormMN />} />
            <Route path="FormDoc" element={<FormDoc />} />
            {/* DailyPlanner */}
            <Route path="DailyPlanner/*" element={<DailyPlanner />} />
            <Route path="FullCalendar" element={<FullCalendarFC />} />
            <Route path="DayPlanToDo" element={<DayPlanToDo />} />
            <Route path="MyDPTD" element={<MyDPTD />} />
            <Route path="ToDoReactIcon" element={<ToDoReactIcon />} />
            {/* default */}
            <Route path="Prob0/*" element={<Prob0 />} />
            <Route path="Prob1" element={<Prob1 />} />
            <Route path="Prob2" element={<Prob2 />} />
            <Route path="AboutMe" element={<AboutMe />} />
          </Routes>
          {/* </div> */}
        </animated.main>
      ))}
      <Footer />
      {/* для аним ч/з react-transition-group */}
      {/* <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Prob0 />} />
          <Route path="RR_DOC/" element={<Prob0 />} />
          <Route path="Prob0/*" element={<Prob0 />} />
          <Route path="Prob1" element={<Prob1 />} />
          <Route path="Prob2" element={<Prob2 />} />
          <Route path="AboutMe/" element={<AboutMe />} />
        </Route>
      </Routes> */}
    </>
  );
}
