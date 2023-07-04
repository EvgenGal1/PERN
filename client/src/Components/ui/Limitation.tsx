// import React from "react";
// import "./FormInpBtn.scss";

export interface FormInp {
  // interface type FormInp = {
  size?: string;
  cl: string /* | undefined */;
  onClickBtn?: Function | undefined | any;
  limit?: string | number;
}

export const Limitation = ({ size, cl, onClickBtn, limit }: FormInp) => {
  // let inp = (
  //   <input
  //     type={type ? type : "text"}
  //     name={name ? name : "name"}
  //     // value={e.target.value}
  //     value={val === null ? "" : val}
  //     className="form__field"
  //     // onClick={(e) => addNewItem()}
  //     onChange={(e) => onChanInp(e.target.value)}
  //     placeholder={plch === null ? "" : plch}
  //     style={styleInp ? { outline: "2px solid #f00" } : { outline: "none" }}
  //   />
  // );
  if (cl === "prim") cl = "btn-primary__eg";
  console.log("cl ", cl);
  let limitCl = "";
  console.log("limit ", limit);
  console.log("limitCl ", limitCl);
  if (limit === 10 || limit === 25 || limit === 50 || limit === 100)
    limitCl = " active";
  console.log("limitCl 2 ", limitCl);
  console.log("onClickBtn ", onClickBtn);
  return (
    <>
      {/* <form className="form">
        inp
        {input2 && inp}
        <button
          className="btn btn--primary btn--inside uppercase"
          onClick={() => onClikBtn(val)}
          type="button"
        >
          {childBtn ? childBtn : "button"}
        </button>
      </form> */}
      <button
        // size="sm"
        // onClick={() =>  handleLimitClick(10)}
        onClick={() => onClickBtn(limit)}
        // className={cl`${limit === 10 ? " active" : ""}`}
        // className={cl && `${limitCl}`}
        className={cl + `${limitCl}`}
        // className={cl + limitCl}
        style={{ marginRight: "15px" }}
      >
        10
      </button>
    </>
  );
};
