// import { div } from "framer-motion/client";
import React, { useState } from "react";
import NavbarHead from "../navbar-component/NavbarHead";
import "../componentcss/dashboard.css";

import HeroSection from "../component/HeroSection";

// import Gift from "../component/Gift";
import FashionSlider from "../component/FashionSlider";
import FooterSection from "../component/FooterSection";
import Navbar from "../navbar-component/Navbars1";
// import SetWeek from "../component/SetWeek";
import Latest from "../component/Latest";
import Latest2 from "../component/Latest2";
import Exclusive from "../exc/Exclusive";
import AccessoriesSlider from "../component/AccessoriesSlider";
// import { supabase } from "../../supabase";
// import { ShiftingDropDown } from "../component/ShiftingDropDown";
// const signOut = async () => {
//   const { error } = await supabase.auth.signOut();
// };

const DashBoard = () => {
  // const [drops, isdrops] = useState(false);
  return (
    <>
      <div className="dash">
        <NavbarHead />
        <Navbar />
        <HeroSection />
        {/* <Exclusive /> */}

        {/* <SetWeek /> */}
        <Latest />
        <Latest2 />
        {/* <Gift /> */}
        {/* admin import */}
        {/*en of  admin import */}
        <AccessoriesSlider />
        <FashionSlider />
        <FooterSection />
      </div>
    </>
  );
};

export default DashBoard;
