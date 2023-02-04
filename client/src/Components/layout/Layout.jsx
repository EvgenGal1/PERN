import { Link, Outlet, Routes, useLocation } from "react-router-dom";
import { useTransition, animated } from "react-spring";
import { Header } from "./Header";
import { Footer } from "./Footer";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Router } from "./Router";

const Layout = () => {
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
      transform: "scale(0.)",
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
      <main
        className="main "
        style={{
          // position: "relative",
          // height: "160vmax",
          overflow: "hidden",
          padding: "0px 5%",
        }}
      >
        {/* // ^ зараб - после добавления обёртки transitions.animated.location, при наведение на .menu-top__items, блоки .m-t-items__ul видны только в header. е/и курсор уйдёт с header, то hover откл - исправл. доав. к .m-t-items__ul z-индекса в css */}
        {transitions((props, item) => (
          <animated.div style={props}>
            <div
              style={{
                // position: "absolute",
                width: "100%",
              }}
            >
              {/* {height} */}
              {/* {dimensions.height} */}
              {/* 1 */}
              {/* {height} */}
              {/* 2 */}
              {/* <Routes location={item}> */}
              {/* ??? не раб - ошб при формате tsx - (property) location: Location. Тип "{ location: Location; }" не может быть назначен для типа "IntrinsicAttributes & OutletProps". Свойство "location" не существует в типе "IntrinsicAttributes & OutletProps" */}
              <Outlet location={item} />
              {/* <Router /> */}
            </div>
          </animated.div>
        ))}
      </main>
      <Footer />
    </>
  );
};
export { Layout };
