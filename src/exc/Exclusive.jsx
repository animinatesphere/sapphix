import React from "react";
import { Link } from "react-router-dom";
import "../exc/exclusive.css";
import winter1 from "../exc/winter_exclusive_for_man-cover.png";
import winter2 from "../exc/winter_exclusive_for_woman-cover.png";
import winter3 from "../exc/winter_exclusive_for_kids-cover.png";
const Exclusive = () => {
  return (
    <div className="container2">
      <div className="ex1">
        <Link to="/men">
          <img src={winter1} alt="" />
        </Link>
      </div>
      <div className="ex1">
        <Link to="/women">
          <img src={winter2} alt="" />
        </Link>
      </div>
      <div className="ex1">
        <Link to="/junior">
          <img src={winter3} alt="" />
        </Link>
      </div>
    </div>
  );
};

export default Exclusive;
