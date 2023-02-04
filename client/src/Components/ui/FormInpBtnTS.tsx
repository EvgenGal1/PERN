import React from "react";
import "./FormInpBtn.scss";

export interface FormInp {
  // interface type FormInp = {
  type: string;
  name: string;
  val: string;
  stInp: string;
  setStInp: string;
  styleInp: string;
  onChanInp: Function;
  onClikInp: Function;
  hr: boolean;
  stBtn: string;
  setStBtn: string;
  styleBtn: string;
  onChanBtn: Function;
  onClikBtn: Function;
  childBtn: string | number;
}

export const FormInpBtnJTS = ({
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
}: FormInp) => {
  return (
    <>
      {" "}
      <form className="form">
        <input
          type={type ? type : "text"}
          name={name ? name : "name"}
          // value={e.target.value}
          value={val === null ? "" : val}
          className="form__field"
          // onClick={(e) => addNewItem()}
          onChange={(e) => onChanInp(e.target.value)}
          style={styleInp ? { outline: "2px solid #f00" } : { outline: "none" }}
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
// export { FormInpBtntTS };
