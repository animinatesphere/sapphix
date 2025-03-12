import React from "react";
import mess from "../assets/messages.png";
import buil from "../assets/buildings.png";
import "../navbar-component/navbar.css";
const NavbarHead = () => {
  return (
    <>
      {/* bg-[var(--greyscale-500)] */}
      {/* container */}
      <div className="container">
        {/* left */}
        <div className="navhead-left">
          {/* img */}
          <img src={mess} alt="" className="w-20" />
          <div>
            <p className="navhead-num">08072796204</p>
          </div>
          {/*end of  img */}
        </div>
        {/*end of  left */}
        {/* middle */}
        <div className="middle">
          <p className="middle-text">Get 20% Off on Selected Items</p>
          <div className="line"></div>
          <p className="m-shop">Shop Now</p>
        </div>
        {/*end of  middle */}
        {/* right */}
        <div className="right">
          <div className="right-img">
            <img src={buil} alt="" />
          </div>
          <div className="right-text">
            <p>Nigeria</p>
          </div>
        </div>
        {/* end of right */}
      </div>
      {/* end of container */}
    </>
  );
};

export default NavbarHead;
