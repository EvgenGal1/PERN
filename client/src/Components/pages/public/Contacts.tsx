import React, { useState } from "react";

// const Contacts = () => {
//   return <div>Контакты</div>;
// };

// export default Contacts;

import /* { */ ArrowAccordionFnComp /* } */ from "../../ui/accordion/ArrowAccordion.jsx";

/* export */ const Contacts = () => {
  const [openArrowAccord, setOpenArrowAccord] = useState(false);
  const handleClickRef = () => {
    setOpenArrowAccord(!openArrowAccord);
  };

  return (
    <div className="Contacts accordion">
      <div className="Contacts__descript">
        <h1
          className={openArrowAccord ? "_active" : ""}
          onClick={() => {
            handleClickRef();
          }}
        >
          Contacts
        </h1>
        <div className={openArrowAccord ? "openDop" : ""}></div>
        {/* <ArrowAccordionFnComp
          openArrowAccord={openArrowAccord}
          setOpenArrowAccord={setOpenArrowAccord}
        /> */}
      </div>
      <div
        className={`Contacts__content--${openArrowAccord ? " openCont" : ""}`}
      >
        Contacts
      </div>
    </div>
  );
};
export default /* { */ Contacts; /* } */
