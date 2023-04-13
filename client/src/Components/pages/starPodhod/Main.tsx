import React, { useState } from "react";

// import { ArrowAccordionFnComp } from "../../../miniBlocksComponents/includes/ArrowAccordion.jsx";
import /* { */ ArrowAccordionFnComp /* } */ from "../../ui/accordion/ArrowAccordion.jsx";

export const Main = () => {
  const [openArrowAccord, setOpenArrowAccord] = useState(false);
  const handleClickRef = () => {
    setOpenArrowAccord(!openArrowAccord);
  };

  return (
    <div className="Main accordion">
      <div className="Main__descript">
        <h1
          className={openArrowAccord ? "_active" : ""}
          onClick={() => {
            handleClickRef();
          }}
        >
          Main
        </h1>
        <div className={openArrowAccord ? "openDop" : ""}></div>
        <ArrowAccordionFnComp
          openArrowAccord={openArrowAccord}
          setOpenArrowAccord={setOpenArrowAccord}
        />
      </div>
      <div
        className={`Main__content--${openArrowAccord ? " openCont" : ""}`}
      ></div>
    </div>
  );
};
//export {Main}
