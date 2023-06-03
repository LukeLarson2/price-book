import React from "react";
import { MdLogout } from "react-icons/md";
import { BiBookBookmark, BiSortAlt2 } from "react-icons/bi";
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
        <div className="sort-container">
          <BiSortAlt2 className="sort-icon" />
          <select onChange={props.onSortChange} className="sort-select">
            <option value="">Sort by...</option>
            <option value="name">Name</option>
            <option value="productPrice">Product Price</option>
            <option value="totalPrice">Total Price</option>
            <option value="salesTax">Sales Tax</option>
            <option value="state">State</option>
            <option value="zip">Zip code</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
