import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillGearFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";

function UserDropdown({ onClose }) {
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div ref={dropdownRef} className="user-dropdown-menu">
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
