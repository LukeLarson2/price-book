import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdLogout } from "react-icons/md";

function Footer({ handleAddItemClick, logout }) {
  return (
    <div className="footer-placement">
      <div className="add-item-placement">
        <button
          type="button"
          className="add-item-btn"
          onClick={handleAddItemClick}
        >
          Add Item <AiOutlinePlus className="add-item-icon" />
        </button>
      </div>
      <div className="logout-btn-placement">
        <MdLogout className="logout" onClick={logout} />
      </div>
    </div>
  );
}

export default Footer;
