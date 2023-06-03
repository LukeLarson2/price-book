import React from "react";
import { MdLogout } from "react-icons/md";
import { BiBookBookmark } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router";

function NavBar(props) {
  const { onChange, value } = props;
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleTitleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="navbar">
      <div className="app-user">
        <h2
          className="app-title"
          onClick={handleTitleClick}
          style={{ cursor: "pointer" }}
        >
          <BiBookBookmark className="book-icon" />
          Price Book
        </h2>
        <p className="username">
          {`Welcome, ${props.name}`}
          <MdLogout className="logout" onClick={logout} />
          {/* <FaUserCircle className="user-icon" /> */}
        </p>
      </div>
      <div className="search-container">
        <AiOutlineSearch className="search-icon" />
        <input
          type="search"
          className="search-bar"
          placeholder="Search products..."
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default NavBar;
