import React, { useState, useEffect, useLayoutEffect } from "react";

// хук для Размеров (Большой, Средний, Маленький,Выключен)
import { useSize } from "../../../scripts/hooks/useSize";

import "./Switcher4btn.scss";

export const Switcher4btn = () => {
  // ЛОГИКА отрисовки checkbox в checked по body.data-size
  // сост.переключателя
  const [checkedBox, setCheckedBox] = useState("");
  // событие приёма из кнп-ок и запись в сост.
  const handleChange = (nm: string) => {
    setCheckedBox(nm);
  };
  // опред.начал.Размер из LS и перем.по умолч.
  const LS = localStorage.getItem("--size");
  let initilLS = "";
  // перед рендером опред.и пропис.сост.переключателя
  useLayoutEffect(() => {
    if (LS === "") {
      initilLS = "mid";
      setCheckedBox(initilLS);
    }
  }, [checkedBox]);
  // в rendere опред.переключатель и слежение измен.
  useEffect(() => {
    if (LS === "") {
      initilLS = "mid";
    }
    if (LS === "big") {
      setCheckedBox("big");
    }
    if (LS === "mid") {
      setCheckedBox("mid");
    }
    if (LS === "small") {
      setCheckedBox("small");
    }
    if (LS === "off") {
      setCheckedBox("off");
    }
  }, [checkedBox]);

  // ЛОГИКА переключателя Размеров (big/mid/small/off)
  // стат./fn Размеров (Большой/Средний/Маленький/Выключен)
  const { size, setSize } = useSize();
  const handleBigSize = () => {
    setSize("big");
  };
  const handleMidSize = () => {
    setSize("mid");
  };
  const handleSmallSize = () => {
    setSize("small");
  };
  const handleOffSize = () => {
    setSize("off");
  };

  return (
    <div className="sw4btn">
      <input
        className="sw4btn-input sw4-inp__big"
        type="radio"
        id="_big"
        name="--size"
        value="_big"
        onClick={() => handleBigSize()}
        checked={checkedBox === "big" ? true : false}
        onChange={() => {
          handleChange("big");
        }}
      />
      <input
        className="sw4btn-input sw4-inp__mid"
        type="radio"
        id="_mid"
        name="--size"
        value="_mid"
        onClick={() => handleMidSize()}
        checked={checkedBox === "mid" ? true : false}
        onChange={() => {
          handleChange("mid");
        }}
      />
      <input
        className="sw4btn-input sw4-inp__small"
        type="radio"
        id="_small"
        name="--size"
        value="_small"
        onClick={() => handleSmallSize()}
        checked={checkedBox === "small" ? true : false}
        onChange={() => {
          handleChange("small");
        }}
      />
      <input
        className="sw4btn-input sw4-inp__off"
        type="radio"
        id="_off"
        name="--size"
        value="_off"
        onClick={() => handleOffSize()}
        checked={checkedBox === "off" ? true : false}
        onChange={() => {
          handleChange("off");
        }}
      />
      <i></i>
      <label className="sw4btn-label sw4-lab__big" htmlFor="_big">
        o
      </label>
      <label className="sw4btn-label sw4-lab__mid" htmlFor="_mid">
        ~
      </label>
      <label className="sw4btn-label sw4-lab__small" htmlFor="_small">
        +
      </label>
      <label className="sw4btn-label sw4-lab__off" htmlFor="_off">
        #
      </label>
    </div>
  );
};
// export { Switcher4btn };
