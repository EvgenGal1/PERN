import { useContext, useEffect, useState } from "react";

import { AppContext } from "@/context/AppContext";

// хук для вывода Доп.Меню ч/з Опред.Кобин.Клвш.
import { useAllKeysPress } from "@/scripts/hooks/useAllKeysPress";
// переключатель видимости Доп.Меню
import { Switcher1btn } from "@Comp/ui/switcher/Switcher1btn";

// переключатель черно-белый
import { Switcher2btn } from "@Comp/ui/switcher/Switcher2btn";

// хук для Цветовых Тем (Тёмная/Сетлая/Средняя)
import { useTheme } from "@/scripts/hooks/useTheme";
// переключатель для Цв.Тем
import { Switcher3btn } from "@Comp/ui/switcher/Switcher3btn";

// хук для Размеров (Большой, Средний, Маленький,Выключен)
import { useSize } from "@/scripts/hooks/useSize";
// переключатель для размеров
import { Switcher4btn } from "@Comp/ui/switcher/Switcher4btn";

// подсказка по наведению мыши
import { TitleEl } from "@Comp/ui/hintTemplates/TitleEl";

// константы/контекст
import { SHOP_ROUTE } from "@/utils/consts";

// Компонент ссылок
import NavBar from "./NavBar";
import ExamplesMenu from "./ExamplesMenu";

const Header = () => {
  const { user } = useContext(AppContext);
  // console.log("HDR user ", user);

  // ЛОГИКА Опред.Комбин.Клвш. для вывода Доп.Меню
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
      // console.log("HDR usEf combinePress ", combinePress);
      // setPressCombine(true);
      setPressCombine((prevState: any) => !prevState);
      localStorage.setItem("--dopMenu", JSON.stringify(true));
      if (pressCombine) localStorage.removeItem("--dopMenu");
    }
    /* else if (combinePress || pressCombine === false) { 
      setPressCombine(false);
      localStorage.setItem("--dopMenu", JSON.stringify(false));
    } */
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
            <a href={SHOP_ROUTE} className="header__link">
              <h3 className="header__img">P</h3>
              <h3 className="header__text">.E.R.N.</h3>
            </a>
          </div>
          {/* ОБЩ. МЕНЮ */}
          <div className="header__menu">
            {/* ВЕРХНЕЕ МЕНЮ */}
            <nav className="header__menu-top menu-top flex flex-wrap justify-between items-center text-white">
              {/* доп.пункты примеров с высоким Уровнем доступа (ф.маршрутов нет) */}
              {user.isAuth &&
                user.hasAnyRole([
                  { role: "USER", level: 5 },
                  { role: "ADMIN", level: 5 },
                  { role: "MODERATOR", level: 1 },
                ]) && <ExamplesMenu />}
              {/* пункты публичного меню */}
              <NavBar />
            </nav>
            {/* НИЖНЕЕ/ДОП.МЕНЮ */}
            {user.isAuth && pressCombine && (
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
                  role="button" // Добавление роли
                  tabIndex={0} // Делаем элемент фокусируемым
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Space") {
                      setIsHovering(""); // обработка нажатия клавиш для доступности
                    }
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
          {user.isAuth && !pressCombine && (
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setPressCombine(!pressCombine);
                    setIsHovering("");
                    localStorage.setItem("--dopMenu", JSON.stringify(true));
                  }
                }}
                role="button"
                tabIndex={0} // Чтобы элемент был доступен для фокуса
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
};

export default Header;
