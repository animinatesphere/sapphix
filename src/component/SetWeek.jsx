import React from "react";
import "../componentcss/week.css";
import floral1 from "../foestaimages/floral1.png";
import wool1 from "../foestaimages/woo1.png";
import skirl1 from "../foestaimages/skirl3.png";
import leather1 from "../foestaimages/leather1.png";
import jogger1 from "../foestaimages/jogger1.png";
const weeks = [
  {
    weekImage: floral1,
    text: "Sleeve Cotton Tiered Dress",
  },
  {
    weekImage: skirl1,
    text: "Seattle High-Rise Mini Skirt",
  },
  {
    weekImage: wool1,
    text: "Wool Blend Long-Sleeve Shirt",
  },
  {
    weekImage: leather1,
    text: "Afro Print Jacket",
  },
  {
    weekImage: jogger1,
    text: "Black and Brown Leather Handbag",
  },
];
const SetWeek = () => {
  return (
    <>
      <div className="weeks-con">
        <h1 className="week-head">New-in this week</h1>
        <div className="week-container ">
          {weeks.map((wik, index) => (
            <div key={index} className="week-card">
              <div className="week-image">
                <img src={wik.weekImage} alt="" />
              </div>
              <div className="week-text">
                <p>{wik.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SetWeek;
