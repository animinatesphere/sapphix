import React from "react";
import { FiSearch } from "react-icons/fi";
import bell from "../admin/admin-folder/Frame 1000007523.png";
import pro from "../admin/admin-folder/profile-circle.png";
import set from "../admin/admin-folder/setting-2.png";
import "../admin/admin.nav.css";

const AdminNav = () => {
  return (
    <div className="admin-con">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>
      <div className="left-admin-nav">
        <img src={bell} alt="Notifications" />
        <img src={pro} alt="Profile" />
        <img src={set} alt="Settings" />
      </div>
    </div>
  );
};

export default AdminNav;
