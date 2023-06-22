import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillGearFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import {AiOutlineCloudDownload} from 'react-icons/ai'
import * as XLSX from 'xlsx';

import "../stylesheets/UserDropdown.css";

function UserDropdown({ onClose, products}) {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      onClose();
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const settings = () => {
    navigate("/settings");
  };
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "PB_Product_Sheet.xlsx");
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div ref={dropdownRef} className="user-dropdown-menu">
      <div className="menu-export" onClick={handleExport}>
        Export
        <AiOutlineCloudDownload className='export'/>
      </div>
      <div className="menu-settings" onClick={settings}>
        Settings
        <BsFillGearFill className="settings" />
      </div>
      <div className="menu-logout" onClick={logout}>
        Logout <MdLogout className="logout" />
      </div>
    </div>
  );
}

export default UserDropdown;
