import React, { useState, useEffect } from "react";

import "./ArrowAccordion.scss";

/* export */ const ArrowAccordionFnComp = ({
  openArrowAccord,
  setOpenArrowAccord,
}) => {
  // const [openArrowAccord, setOpenArrowAccord] = useState(false);
  const handleClickRef = () => {
    setOpenArrowAccord(!openArrowAccord);
    // return openArrowAccord;
  };
  return (
    <>
      <div
        onClick={() => {
          handleClickRef();
        }}
        className="arrowAccord"
      >
        <div className="ArrowAccord-show">
          {/* <span>{this.props.openArrowAccord ? "ᐁ" : "ᐃ"}</span> */}
          <span>
            {/* {this.state.openArrowAccord || this.props.openArrowAccord */}
            {openArrowAccord ? "ᐃ" : "ᐁ"}
          </span>
        </div>
      </div>
    </>
  );
};
export default ArrowAccordionFnComp;
