import React from "react";
import "../componentcss/gift.css";
// import gift1 from "../foestaimages/13_8d808684-401c-46d2-adfa-dfb619e65437.webp";
import icon from "../assets/icon.png";
// import icon2 from "../assets/scarf1.jpg";
// import icon3 from "../assets/scarf2.jpg";
import Button from "./Button";
const Gift = () => {
  return (
    <>
      <div className="gift-container">
        <div className="gif1">
          {/* <div className="gif1-images">
            <img src={gift1} alt="" />
          </div> */}
          <div className="gift1-text">
            <p>
              Vintage-Inspired Floral <br />
              Midi Dress
            </p>
            <Button className="gif-but">
              Shop <img src={icon} alt="" className="ar" />
            </Button>
          </div>
        </div>
        <div className="gift2-con">
          <div className="gift-2-1">
            <div className="gift2-1-text">
              <p>This is a must have</p>
              <Button className="gif">
                Shop <img src={icon} alt="" className="ar" />
              </Button>
            </div>
          </div>
          <div className="gift-2-2">
            <div className="gift2-2-text">
              <p>The perfect shirt exists!</p>
              <Button className="gif">
                Shop <img src={icon} alt="" className="ar" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gift;
