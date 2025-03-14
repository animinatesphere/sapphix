import React from "react";
import "../componentcss/week.css";
import set1 from "../forthisweekimage/Frame 314 (1).png";
import set2 from "../forthisweekimage/Frame 314.png";
import set3 from "../forthisweekimage/Scented candle (1).png";
import set4 from "../forthisweekimage/Scented candle (2).png";
import set5 from "../forthisweekimage/Scented candle.png";
const weeks = [
  {
    weekImage: set1,
    text: "Afro Print Jacket",
  },
  {
    weekImage: set2,
    text: "Afro Print Jacket",
  },
  {
    weekImage: set3,
    text: "Afro Print Jacket",
  },
  {
    weekImage: set4,
    text: "Afro Print Jacket",
  },
  {
    weekImage: set5,
    text: "Afro Print Jacket",
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
