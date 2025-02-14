import { useEffect, useLayoutEffect, useRef, useState } from "react";

// хук для Цветовых Тем (Тёмная/Сетлая/Средняя)
import { useTheme } from "../../../scripts/hooks/useTheme";

import "./Switcher3btn.scss";

export const Switcher3btn = () => {
  // ЛОГИКА отрисовки checkbox в checked по body.data-theme
  // сост.переключателя
  const [checkedBox, setCheckedBox] = useState("");
  // событие приёма из кнп-ок и запись в сост.
  const handleChange = (nm: string) => {
    setCheckedBox(nm);
  };
  // опред.начал.Темы из LS и перем.по умолч.
  const LS = localStorage.getItem("--theme");
  const initilLS = useRef("");
  // перед рендером опред.и пропис.сост.переключателя
  useLayoutEffect(() => {
    if (LS === "") {
      initilLS.current = "dark";
      setCheckedBox(initilLS.current);
    }
  }, [checkedBox, LS]);
  // в rendere опред.переключатель и слежение измен.
  useEffect(() => {
    if (LS === "") {
      initilLS.current = "dark";
    }
    if (LS === "dark") {
      setCheckedBox("dark");
    }
    if (LS === "light") {
      setCheckedBox("light");
    }
    if (LS === "natural") {
      setCheckedBox("natural");
    }
  }, [LS, checkedBox]);

  // ЛОГИКА переключателя Цветовых Тем (dark/light/natural)
  // стат./fn Цветовых Тем (Тёмная/Сетлая/Средняя)
  const { /* theme, */ setTheme } = useTheme();
  const handleDarkTheme = () => {
    setTheme("dark");
  };
  const handleLightTheme = () => {
    setTheme("light");
  };
  const handleNaturalTheme = () => {
    setTheme("natural");
  };

  return (
    <div className="sw3btn">
      <label className="sw3btn-label sw3btn__dark" htmlFor="_dark">
        o
      </label>
      <input
        id="_dark"
        className="sw3btn-input sw3btn-radio__dark"
        type="radio"
        name="--theme"
        value="_dark"
        onClick={() => handleDarkTheme()}
        checked={checkedBox === "dark" ? true : false}
        onChange={() => {
          handleChange("dark");
        }}
      />
      <label className="sw3btn-label sw3btn__neutral" htmlFor="_neutral">
        ~
      </label>
      <input
        id="_neutral"
        className="sw3btn-input sw3btn-radio__neutral"
        type="radio"
        name="--theme"
        value="_neutral"
        onClick={() => handleNaturalTheme()}
        checked={checkedBox === "natural" ? true : false}
        onChange={() => {
          handleChange("natural");
        }}
      />
      <label className="sw3btn-label sw3btn__light" htmlFor="_light">
        +
      </label>
      <input
        id="_light"
        className="sw3btn-input sw3btn-radio__light"
        type="radio"
        name="--theme"
        value="_light"
        onClick={() => handleLightTheme()}
        checked={checkedBox === "light" ? true : false}
        onChange={() => {
          handleChange("light");
        }}
      />
      <div className="sw3btn-slider"></div>
    </div>
  );
};
// export { Switcher3btn };
