// import { div } from "framer-motion/client";
import React, { useState } from "react";
import NavbarHead from "../navbar-component/NavbarHead";
import "../componentcss/dashboard.css";
import Navbar from "../navbar-component/navbar";
import HeroSection from "../component/HeroSection";
import SetForThisWeek from "../component/setForThisWeek";
import Gift from "../component/Gift";
import FashionSlider from "../component/FashionSlider";
import FooterSection from "../component/FooterSection";
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
        <SetForThisWeek />
        <Gift />
        {/* admin import */}
        {/*en of  admin import */}
        <FashionSlider />
        <FooterSection />
      </div>
    </>
  );
};

export default DashBoard;
