import React from "react";
import "./Switcher3btnTheme.scss";

export const Switcher3btnTheme = ({
  handleDarkTheme,
  handleLightTheme,
  handleNaturalTheme,
}) => {
  return (
    <div className="sw3btn">
      <label className="sw3btn-label sw3btn__dark" htmlFor="_dark">
        o
      </label>
      <input
        id="_dark"
        className="sw3btn-radio__dark"
        type="radio"
        name="--theme"
        value="_dark"
        onClick={() => handleDarkTheme()}
      />
      <label className="sw3btn-label sw3btn__neutral" htmlFor="_neutral">
        ~
      </label>
      <input
        id="_neutral"
        className="sw3btn-radio__neutral"
        type="radio"
        name="--theme"
        value="_neutral"
        onClick={() => handleNaturalTheme()}
      />
      <label className="sw3btn-label sw3btn__light" htmlFor="_light">
        +
      </label>
      <input
        id="_light"
        className="sw3btn-radio__light"
        type="radio"
        name="--theme"
        value="_light"
        onClick={() => handleLightTheme()}
      />
      <div className="sw3btn-slider"></div>
    </div>
  );
};
// export { Switcher3btnTheme };
