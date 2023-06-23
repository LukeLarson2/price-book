import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillGearFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { AiOutlineCloudDownload } from "react-icons/ai";
import * as XLSX from "xlsx";

import "../stylesheets/UserDropdown.css";

function UserDropdown({ onClose, products }) {
  const [showModal, setShowModal] = useState(false);
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
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmExport = () => {
    handleExport();
    closeModal();
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
      <div className="menu-export" onClick={openModal}>
        Export
        <AiOutlineCloudDownload className="export" />
      </div>
      <div className="menu-settings" onClick={settings}>
        Settings
        <BsFillGearFill className="settings" />
      </div>
      <div className="menu-logout" onClick={logout}>
        Logout <MdLogout className="logout" />
      </div>
      {showModal && (
        <div className="export-modal-overlay">
          <div className="export-modal">
            <div className="export-modal-content">
              <h2 className="export-modal-title">Export Confirmation</h2>
              <p className="export-modal-text">
                All filters and sorting will be applied to the exported
                document. Are you sure you want to export?
              </p>
              <div className="export-modal-btn-placement">
                <button className="confirm-export-btn" onClick={confirmExport}>
                  Yes
                </button>
                <button className="cancel-export-btn" onClick={closeModal}>
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
