import React from "react";
import "../componentcss/button-prop.css";
const Button = (props) => {
  return <button className="butt-prop">{props.children}</button>;
};

export default Button;
