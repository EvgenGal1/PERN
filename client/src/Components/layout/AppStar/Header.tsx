import React, { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";

import { AppContext } from "../../layout/AppTok/AppContext";

// хук для вывода Доп.Меню ч/з Опред.Кобин.Клвш.
import { useAllKeysPress } from "../../../scripts/hooks/useAllKeysPress";
// переключатель видимости Доп.Меню
import { Switcher1btn } from "../../ui/switcher/Switcher1btn";

// переключатель черно-белый
import { Switcher2btn } from "../../ui/switcher/Switcher2btn";

// хук для Цветовых Тем (Тёмная/Сетлая/Средняя)
import { useTheme } from "../../../scripts/hooks/useTheme";
// переключатель для Цв.Тем
import { Switcher3btn } from "../../ui/switcher/Switcher3btn";

// хук для Размеров (Большой, Средний, Маленький,Выключен)
import { useSize } from "../../../scripts/hooks/useSize";
// переключатель для размеров
import { Switcher4btn } from "../../ui/switcher/Switcher4btn";

// подсказка по наведению мыши
import { TitleEl } from "../../ui/hintTemplates/TitleEl";

export function Header() {
  const { user }: any = useContext(AppContext);
  // console.log("user ", user);

  // ЛОГИКА Опред.Комбин.Клвш. для вывода Доп.Меню
  // стат. показа Доп.Меню из LS
  // const [pressCombine, setPressCombine] = useState(() => {
  // const initialValue = JSON.parse(saved);
  // return initialValue || "";
  // saved ? JSON.parse(saved) : []
  // })
  // ^ нов.версия
  const saved = localStorage.getItem("--dopMenu");
  const [pressCombine, setPressCombine] = useState(
    saved ? JSON.parse(saved) : false
  );
  // массив букв после хука (возвращ true е/и переданные и нажатые равны)
  const combinePress = useAllKeysPress({
    userKeys: ["d", "o", "p", "m", "n"],
    order: true,
  });
  //  ----------------------------------------------------------------------------------
  const combinePress_2 = useAllKeysPress({
    userKeys: ["d", "m", "n"],
    order: true,
  });
  //  ----------------------------------------------------------------------------------
  // отслеж. измен.с записью в LS
  useEffect(() => {
    if (combinePress === true) {
      // setPressCombine(true);
      setPressCombine((prevState: any) => !prevState);
      localStorage.setItem("--dopMenu", JSON.stringify(true));
      if (pressCombine)
        // localStorage.setItem("--dopMenu", JSON.stringify(false));
        localStorage.removeItem("--dopMenu");
    }
    /* else if (combinePress || pressCombine === false) { 
      setPressCombine(false);
      localStorage.setItem("--dopMenu", JSON.stringify(false));
    } */

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinePress /* , pressCombine */]);

  useEffect(() => {
    if (combinePress_2 === true && user?.isAuth) {
      setPressCombine(false);
      localStorage.removeItem("--dopMenu");
    }
  }, [combinePress_2, user?.isAuth]);

  // сост. подсказки по наведению мыши
  const [isHovering, setIsHovering] = useState("");
  useEffect(() => {}, [isHovering]);

  // подкл. логики переключателя Цветовых Тем (dark/light/natural)
  useTheme();

  // подкл. логики переключателя Размеров (big/mid/small/off)
  useSize();

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* ЛОГО */}
          <div className="header__logo">
            <Link to="/" className="header__link">
              <img
                className="header__img"
                // src={require("../../img/logo/ЕжеСветRedBlackWhiteEff.png")}
                src={require("../../../img/logo/PERN.png")}
                alt=""
              />
              <h3>.E.R.N.</h3>
            </Link>
          </div>
          {/* ОБЩ. МЕНЮ */}
          <div className="header__menu">
            {/* ВЕРХНЕЕ МЕНЮ */}
            <nav className="header__menu-top menu-top flex flex-wrap justify-between items-center text-white">
              {/* NewPro */}
              <span className="menu-top__items m-t-items">
                <NavLink to="/NewPro" className="m-t-items__navlink activ-prob">
                  NewPro
                </NavLink>
              </span>
              {/* NRJWT */}
              <span className="menu-top__items m-t-items">
                <NavLink to="/NRJWT" className="m-t-items__navlink activ-prob">
                  NRJWT
                </NavLink>
              </span>
              {/* Prob0 */}
              <span className="menu-top__items m-t-items">
                <NavLink to="/Prob0" className="m-t-items__navlink activ-prob">
                  Prob0
                </NavLink>
                {/* // ^ данная вложеность и переход на стр. возможен е/и сами влож.стр. добав. в общ. Routes, на один уровень с верхним NavLink */}
                <ul className="m-t-items__ul m-t-its-ul">
                  <li className="m-t-its-ul__li">
                    <Link to="/Prob1" className="">
                      Prob1
                    </Link>
                  </li>
                  <li className="m-t-its-ul__li">
                    <Link to="/Prob2" className="">
                      Prob2
                    </Link>
                  </li>
                </ul>
              </span>
              {/* AboutMe */}
              <span className="menu-top__items m-t-items">
                <NavLink to="AboutMe" className="m-t-items__navlink">
                  AboutMe
                </NavLink>
              </span>
            </nav>
            {/* НИЖНЕЕ/ДОП.МЕНЮ */}
            {pressCombine && (
              <nav className="header__menu-bottom menu-bottom flex flex-wrap justify-between items-center">
                <span
                  className="menu-bottom__items m-b-items"
                  onMouseEnter={() => {
                    setIsHovering("sw1bnt");
                  }}
                  onMouseLeave={() => {
                    setIsHovering("");
                  }}
                  onClick={() => {
                    setIsHovering("");
                  }}
                >
                  <Switcher1btn
                    setPressCombine={setPressCombine}
                    setIsHovering={setIsHovering}
                  />
                  {isHovering === "sw1bnt" && <TitleEl text={"Доп.Меню"} />}
                </span>
                <span
                  className="menu-bottom__items m-b-items"
                  onMouseEnter={() => {
                    setIsHovering("sw2bnt");
                  }}
                  onMouseLeave={() => {
                    setIsHovering("");
                  }}
                >
                  <Switcher2btn />
                  {isHovering === "sw2bnt" && <TitleEl text={"не занят"} />}
                </span>
                {/* переключатель Цветовых Тем (dark/light/natural) */}
                <span
                  className="menu-bottom__items m-b-items"
                  onMouseEnter={() => {
                    setIsHovering("sw3bnt");
                  }}
                  onMouseLeave={() => {
                    setIsHovering("");
                  }}
                >
                  <Switcher3btn />
                  {isHovering === "sw3bnt" && <TitleEl text={"Цв.Темы"} />}
                </span>
                <span
                  className="menu-bottom__items m-b-items"
                  onMouseEnter={() => {
                    setIsHovering("sw4bnt");
                  }}
                  onMouseLeave={() => {
                    setIsHovering("");
                  }}
                >
                  <Switcher4btn />
                  {isHovering === "sw4bnt" && <TitleEl text={"Размеры"} />}
                </span>
              </nav>
            )}
          </div>
          {/* врем.кнп.для упрощ.вкл.доп.меню */}
          {!pressCombine && (
            <>
              <div
                className="miniArrow"
                onClick={() => {
                  setPressCombine(!pressCombine);
                  setIsHovering("");
                  localStorage.setItem("--dopMenu", JSON.stringify(true));
                }}
                onMouseEnter={() => {
                  setIsHovering("sw1bnt");
                }}
                onMouseLeave={() => {
                  setIsHovering("");
                }}
              >
                &lt;
                {isHovering === "sw1bnt" && (
                  <TitleEl
                    // onClick={() => {
                    //   localStorage.setItem("--dopMenu", JSON.stringify(true));
                    // }}
                    text={"Доп.Меню"}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}

// export { Header };
