import { useState } from "react";

const Contacts = () => {
  const [openArrowAccord, setOpenArrowAccord] = useState(false);
  const handleClickRef = () => {
    setOpenArrowAccord(!openArrowAccord);
  };

  return (
    <div className="Contacts accordion">
      <div className="Contacts__descript">
        <button /* h1 */
          className={openArrowAccord ? "_active" : ""}
          onClick={() => {
            handleClickRef();
          }}
        >
          Contacts
        </button>
        <div className={openArrowAccord ? "openDop" : ""}></div>
      </div>
      <div
        className={`Contacts__content--${openArrowAccord ? " openCont" : ""}`}
      >
        Contacts
      </div>
    </div>
  );
};
export default Contacts;
