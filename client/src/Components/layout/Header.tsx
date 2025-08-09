import { useContext, useEffect, useRef, useState } from "react";

import { AppContext } from "@/context/AppContext";

// хук для вывода Доп.Меню ч/з Опред.Кобин.Клвш.
import useAllKeysPress from "@/scripts/hooks/useAllKeysPress";
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

const Header: React.FC = () => {
  const { user } = useContext(AppContext);

  // сост.видимости доп.меню ч/з LS от комбинации клавиш
  const [isDopMenuVisible, setIsDopMenuVisible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("--dopMenu");
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      console.warn("Не удалось прочитать '--dopMenu' из LS", e);
      return false;
    }
  });

  // лог.обраб.комбин.клвш показ/скрыт доп.меню
  const showMenuPressed = useAllKeysPress({
    userKeys: ["d", "o", "p", "m", "n"],
    order: true,
  });
  const hideMenuPressed = useAllKeysPress({
    userKeys: ["d", "m", "n"],
    order: true,
  });

  // отслеж.обраб. показ/скрыт доп.меню с записью в LS
  useEffect(() => {
    if (showMenuPressed) {
      setIsDopMenuVisible(true);
      localStorage.setItem("--dopMenu", JSON.stringify(true));
    }
  }, [showMenuPressed]);
  useEffect(() => {
    if (hideMenuPressed) {
      setIsDopMenuVisible(false);
      localStorage.setItem("--dopMenu", JSON.stringify(false));
    }
  }, [hideMenuPressed]);

  // очистка LS доп.меню при выходе
  useEffect(() => {
    if (user && !user.isAuth) {
      setIsDopMenuVisible(false);
      localStorage.removeItem("--dopMenu");
    }
  }, [user]);

  // сост.подсказки > доп.меню по наведению мыши
  const [isHovering, setIsHovering] = useState<string>("");

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
            {isDopMenuVisible && (
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
                  role="button"
                  tabIndex={0} // эл.фокусируемый
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" ||
                      e.key === "Space" ||
                      e.key === " "
                    ) {
                      e.preventDefault(); // от прокрутки при Space
                      setIsHovering(""); // обраб.клик > доступности
                    }
                  }}
                >
                  <Switcher1btn
                    setIsDopMenuVisible={setIsDopMenuVisible}
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
          {!isDopMenuVisible && (
            <>
              <div
                className="miniArrow"
                onClick={() => {
                  setIsDopMenuVisible(!isDopMenuVisible);
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
                    e.preventDefault();
                    setIsDopMenuVisible(!isDopMenuVisible);
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
