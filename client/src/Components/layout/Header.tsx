import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { debounce } from "lodash";

// контекст и Store ч/з MobX
import { AppContext } from "@/context/AppContext";

// класс посредник м/у слуш.событ. и подписчиками для вывода Доп.Меню ч/з Опред.Кобин.Клвш. (Full версии)
import { commandBus } from "@/scripts/hooks/commandBus";
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

// Компоненты: меню страниц, примеры др.меню
import NavBar from "./NavBar";
import ExamplesMenu from "./ExamplesMenu";

// логгер
import { log, logErr, logWarn } from "@/utils/logger";

const Header: React.FC = observer(() => {
  // объ.Пользователя из Контекста приложения
  const { user } = useContext(AppContext);

  /** сост.видимости доп.меню из LS ч/з комбинации клавиш */
  const [isDopMenuVisible, setIsDopMenuVisible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("--dopMenu");
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      logWarn("Не удалось прочитать '--dopMenu' из LS", e);
      return false;
    }
  });

  /** отложен.сохр.(от частых записей) в LS */
  const debouncedSaveToLS = useMemo(
    () =>
      debounce((value: boolean) => {
        try {
          localStorage.setItem("--dopMenu", JSON.stringify(value));
        } catch (e) {
          logErr("[Header] не удалось сохранить 'dopMenu' в LS", e);
        }
      }, 300),
    []
  );

  /** сохр.сост.доп.меню в LS и очистка отлож.сохр.при размонтир.Комп. */
  useEffect(() => {
    debouncedSaveToLS(isDopMenuVisible);
    return () => debouncedSaveToLS.cancel();
  }, [isDopMenuVisible, debouncedSaveToLS]);

  /** fn обёртка над setIsDopMenuVisible > использ.в usEf со стибльньным обнов.сост.меню при измен. */
  const updateDopMenuVisibility = useCallback((isVisible: boolean) => {
    log(`[Header] updateDopMenuVisibility вызван с ${isVisible}`);
    setIsDopMenuVisible(isVisible);
  }, []);

  // синхрон.внутри вкладки ч/з commandBus (> обнов.setIsDopMenuVisible в Header ч/з commandBus при отраб.мкд./измен. LS в useCommands)
  useEffect(() => {
    log("[Header] Подписка на внутр.измен.меню ч/з commandBus");
    // подписка на спец.событие
    const unsubscribeInternal = commandBus.subscribe((eventName, data) => {
      // проверка на имя кмд. и спец.имя события
      if (eventName === "dop_menu_state_change") {
        log("[Header] Есть внутр.измен.сост.меню ч/з commandBus", data);
        // data в boolean и обнов.сост.
        const isVisible = data as boolean;
        updateDopMenuVisibility(isVisible);
      }
    });
    // отписка при размонтир.
    return () => {
      log("[Header] Отписка от внутр.измен.сост.меню");
      unsubscribeInternal();
    };
  }, [updateDopMenuVisibility]);

  // сихрон.обнов.сост.LS м/у неск.вкладками в брауз.
  useEffect(() => {
    log("[Header] Подписка на изменения localStorage (м/у вкладками)");
    // обраб.измен.хранилища по необходим.ключю (--dopMenu)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "--dopMenu") {
        log(
          "[Header] Изменение '--dopMenu' в LS (из др.вкладки) обнаружено",
          e.newValue
        );
        try {
          const newValue = e.newValue !== null ? JSON.parse(e.newValue) : false;
          // обнов.сост.
          updateDopMenuVisibility(newValue);
        } catch (err) {
          logErr("[Header] Ошибка парсинга знач.из LS", err);
        }
      }
    };
    // подписка на событ.брауз.
    window.addEventListener("storage", handleStorageChange);
    // отписка при размонтир.
    return () => {
      log("[Header] Отписка от события storage");
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [updateDopMenuVisibility]);

  // сброс.сост./удал.LS доп.меню при выходе
  useEffect(() => {
    if (user && user.isAuth === false) {
      setIsDopMenuVisible(false);
    }
  }, [user, user.isAuth]);

  // сост.подсказки > доп.меню по наведению мыши
  const [isHovering, setIsHovering] = useState<string>("");

  // подкл. логики переключателя Цветовых Тем (dark/light/natural)
  useTheme();

  // подкл. логики переключателя Размеров (big/mid/small/off)
  useSize();

  return (
    <>
      <header className="header">
        <div
          className={`header-container ${isDopMenuVisible ? "max-visible" : ""}`}
        >
          {/* ЛОГО */}
          <div className="header__logo">
            <a href={SHOP_ROUTE} className="header__link">
              <h3 className="header__img">P</h3>
              <span className="header__text-wrapper">
                <h3 className="header__text">.E.R.N.</h3>
              </span>
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
            <nav
              className={`header__menu-bottom menu-bottom flex flex-wrap justify-between items-center ${
                isDopMenuVisible ? "visible" : ""
              }`}
            >
              <>
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
                    if (["Enter", "Space", " "].includes(e.key)) {
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
                {/* переключатель Размеров (big/mid/small/off) */}
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
              </>
            </nav>
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
                {isHovering === "sw1bnt" && <TitleEl text={"Доп.Меню"} />}
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
});

export default Header;
