import React from "react";
import "../admin/admin.nav.css";
import { FiSearch } from "react-icons/fi";
import bell from "../admin/admin-folder/Frame 1000007523.png";
import pro from "../admin/admin-folder/profile-circle.png";
import set from "../admin/admin-folder/setting-2.png";
const AdminNav = () => {
  return (
    <div className="admin-con">
      <div className="search-ba">
        <FiSearch />
        <input type="text" placeholder="Search" />
      </div>
      <div className="left-admin-nav">
        <img src={bell} alt="" />
        <img src={pro} alt="" />
        <img src={set} alt="" />
      </div>
    </div>
  );
};

export default AdminNav;
