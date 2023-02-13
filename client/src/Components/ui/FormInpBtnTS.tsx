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
  plch: string;
  hr: boolean;
  stBtn: string;
  setStBtn: string;
  styleBtn: string;
  onChanBtn: Function;
  onClikBtn: Function;
  childBtn: string | number;
  input2: string;
  val2: string;
  plch2: string;
  input3: string;
  val3: string;
  plch3: string;
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
  plch,
  hr,
  stBtn,
  setStBtn,
  styleBtn,
  onChanBtn,
  onClikBtn,
  childBtn,
  input2,
  val2,
  plch2,
  input3,
  val3,
  plch3,
}: FormInp) => {
  let inp = (
    <input
      type={type ? type : "text"}
      name={name ? name : "name"}
      // value={e.target.value}
      value={val === null ? "" : val}
      className="form__field"
      // onClick={(e) => addNewItem()}
      onChange={(e) => onChanInp(e.target.value)}
      placeholder={plch === null ? "" : plch}
      style={styleInp ? { outline: "2px solid #f00" } : { outline: "none" }}
    />
  );
  return (
    <>
      {" "}
      <form className="form">
        inp
        {input2 && inp}
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
