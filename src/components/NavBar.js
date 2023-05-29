import React from "react";
import { MdLogout } from "react-icons/md";
import { BiBookBookmark } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";

function NavBar(props) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="app-user">
        <h2 className="app-title">
          <BiBookBookmark className="book-icon" />
          Price Book
        </h2>
        <p className="username">
          <FaUserCircle className="user-icon" />
          {props.name}
        </p>
      </div>
      <div className="logout-btn-layout">
        <MdLogout className="logout" onClick={logout} />
      </div>
    </div>
  );
}

export default NavBar;
