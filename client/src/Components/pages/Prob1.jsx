import React, { useState } from "react";

export function Prob1() {
  const [openClass, setOpenClass] = useState("section");

  return (
    <div className="prob1">
      <div className={`prob1__descript ${openClass}`}>
        {/* <button onClick={() => setOpenSpol(!handleClick)}> 
                      {toggle ? "- стар + нов" : "+ нов - стар"}
                    </button> */}
        <h1
          onClick={() =>
            setOpenClass(openClass === "section" ? "section open" : "section")
          }
        >
          Prob1
        </h1>
        <div>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Enim aliquid
          maxime nihil, delectus, magnam optio soluta non minus qui sit
          reprehenderit vitae quidem distinctio placeat.
        </div>
      </div>
      <div className="prob1__content">
        <p style={{ backgroundColor: "#999" }}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi
          corrupti, rerum eaque voluptas nesciunt, officia voluptates
          voluptatibus animi nihil mollitia libero harum praesentium omnis iste.
        </p>
      </div>
    </div>
  );
}
