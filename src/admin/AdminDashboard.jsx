import React from "react";
// import NavbarHead from "../navbar-component/NavbarHead";
import AdminNavaabr from "./AdminNavaabr";
import HeroSection from "../component/HeroSection";
import NavbarHead from "../navbar-component/NavbarHead";
import Latest from "../component/Latest";
import Latest2 from "../component/Latest2";
import AccessoriesSlider from "../component/AccessoriesSlider";
import FashionSlider from "../component/FashionSlider";
import FooterSection from "../component/FooterSection";
// import Men from "../men/Men";
// import { supabase } from "../../supabase";

const AdminDashboard = () => {
  return (
    <>
      <div className="dash">
        <NavbarHead />
        <AdminNavaabr />
        <HeroSection />
        <Latest />
        <Latest2 />
        <AccessoriesSlider />
        <FashionSlider />
        <FooterSection />
      </div>
    </>
  );
};

export default AdminDashboard;
