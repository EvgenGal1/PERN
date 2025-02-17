import { Outlet, useLocation } from "react-router-dom";
import { useTransition, animated } from "react-spring";

import { Header } from "./Header";
import { Footer } from "./Footer";

const Layout = () => {
  const location = useLocation();
  const transitions = useTransition(location, {
    from: {
      opacity: 0,
      transform: "scale(1.3) ",
      transitionTimingFunction: "ease",
    },
    enter: {
      opacity: 1,
      transform: "scale(1) ",
      transitionTimingFunction: "ease",
    },
    leave: {
      opacity: 0,
      transform: "scale(0.9)",
      transitionTimingFunction: "ease",
      position: "absolute",
    },
  });

  return (
    <>
      <Header />
      <main className="main " style={{ overflow: "hidden", padding: "0px 5%" }}>
        {/* // ^ зараб - после добавления обёртки transitions.animated.location, при наведение на .menu-top__items, блоки .m-t-items__ul видны только в header. е/и курсор уйдёт с header, то hover откл - исправл. добав. к .m-t-items__ul z-индекса в css */}
        {transitions((props, item) => (
          <animated.div style={props}>
            <div id="qwerty" style={{ width: "100%" }}>
              {/* {height} */}
              {/* {dimensions.height} */}
              {/* 1 */}
              {/* {height} */}
              {/* 2 */}
              {/* <Routes location={item}> */}
              {/* ??? не раб - ошб при формате tsx - (property) location: Location. Тип "{ location: Location; }" не может быть назначен для типа "IntrinsicAttributes & OutletProps". Свойство "location" не существует в типе "IntrinsicAttributes & OutletProps" */}
              {/* // ^ рендер вложен.маршрутов */}
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
