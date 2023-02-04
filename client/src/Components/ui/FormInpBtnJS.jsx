import React from "react";
import "./FormInpBtn.scss";

export const FormInpBtnJS = ({
  type,
  name,
  val,
  stInp,
  setStInp,
  styleInp,
  onChanInp,
  onClikInp,
  hr,
  stBtn,
  setStBtn,
  styleBtn,
  onChanBtn,
  onClikBtn,
  childBtn,
}) => {
  return (
    <>
      <form className="form">
        <input
          type={type ? type : "text"}
          name={name ? name : "name"}
          // value={e.target.value}
          value={val == null ? "" : val}
          className="form__field"
          // onClick={(e) => addNewItem()}
          onChange={(e) => onChanInp(e.target.value)}
          style={
            styleInp
              ? { outline: "2px solid #8b0000" }
              : // { outline: "inherit" }
                {}
          }
        />
        <button
          className="btn btn--primary btn--inside uppercase"
          onClick={() => onClikBtn(val)}
          type="button"
        >
          {childBtn ? childBtn : "button"}
        </button>
      </form>
    </>
  );
};
// export {FormInpBtnJS}
