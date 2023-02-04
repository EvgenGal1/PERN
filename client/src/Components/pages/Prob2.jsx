import React, { useState } from "react";

export function Prob2() {
  const [openClass, setOpenClass] = useState("section");
  return (
    <div className="prob2">
      <div className={`prob2__descript ${openClass}`}>
        <h1
          onClick={() =>
            setOpenClass(openClass === "section" ? "section open" : "section")
          }
        >
          Prob 2
        </h1>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, nam
          placeat? Nemo enim consequuntur minima possimus cupiditate facere
          soluta consectetur exercitationem repudiandae similique nesciunt est
          doloribus sunt non, provident explicabo. Ullam similique magnam
          officiis perspiciatis consequuntur a quos deleniti alias sequi ipsum,
          dicta quisquam tenetur, iure obcaecati cumque fugiat odit.
        </div>
      </div>
      <br />
      <div className="prob2__content" style={{ backgroundColor: "#666" }}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi
        corrupti, rerum eaque voluptas nesciunt, officia voluptates voluptatibus
        animi nihil mollitia libero harum praesentium omnis iste.
      </div>
    </div>
  );
}
