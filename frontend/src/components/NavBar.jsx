import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { BiBookBookmark } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { GoTriangleDown } from "react-icons/go";
import { BsList } from "react-icons/bs";
import { RiFileListLine } from "react-icons/ri";

import UserIconDisplay from "./UserIconDisplay";
import UserDropdown from "./UserDropdown";
import "../stylesheets/NavBar.css";

function NavBar({
  name,
  profileImage,
  id,
  value,
  onChange,
  onSortChange,
  setProductCardView,
  productCardView,
  sortField,
  products,
}) {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(profileImage);

  useEffect(() => {
    const handleWindowResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener("resize", handleWindowResize);

    // Cleanup function:
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []); // Empty array ensures effect runs only on mount and unmount

  useEffect(() => {
    setSelectedIcon(profileImage);
  }, [profileImage]);
  const userIconOptions = [
    { name: "Basic", value: "basic" },
    { name: "Astronaut", value: "astro" },
    { name: "Student", value: "grad" },
    { name: "Doctor", value: "doctor" },
    { name: "Ninja", value: "ninja" },
    { name: "Nurse", value: "nurse" },
    { name: "Agent", value: "agent" },
    { name: "Formal", value: "tie" },
  ];

  const handleIconSelect = async (icon) => {
    try {
      const response = await fetch(`/users/${id}/icon`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileImage: icon }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedUser = await response.json();

      // update the state with the new icon
      setSelectedIcon(updatedUser.profileImage);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(!isDropdownOpen);
  };

  const handleUserIconClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleTitleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getFirstName = () => {
    const nameArr = name.split(" ");
    return nameArr[0];
  };

  const firstName = getFirstName();

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
        <div className="user-welcome-block">
          <UserIconDisplay
            control={selectedIcon}
            className="user-icon"
            onClick={handleUserIconClick}
          />
          <div className="user-logout-container">
            <p className="username-welcome">
              <b>Welcome,</b>
            </p>
            <p className="username-name" onClick={handleDropdownClick}>
              <span className="name-logout-container">
                <b>{firstName}</b>
                <GoTriangleDown className="user-dropdown" />
              </span>
            </p>
            {isDropdownOpen && (
              <UserDropdown
                onClose={() => setDropdownOpen(!isDropdownOpen)}
                className="user-dropdown-menu"
                products={products}
              />
            )}
          </div>
        </div>
      </div>
      <div className="search-container">
        <div className="search-sort">
          <AiOutlineSearch className="search-icon" />
          <input
            type="search"
            className="search-bar"
            placeholder="Search products..."
            value={value}
            onChange={onChange}
          />
          {/* <BiSortAlt2 className="sort-icon" /> */}
          <select
            value={sortField}
            onChange={onSortChange}
            className="sort-select"
          >
            <option value="">Sort by...</option>
            <option value="name">Name</option>
            <option value="productPrice">Product Price</option>
            <option value="cityTax">City Tax</option>
            <option value="stateTax">State Tax</option>
            <option value="combinedTax">Combined Tax</option>
            <option value="totalTax">Total Tax</option>
            <option value="totalPrice">Total Price</option>
            <option value="state">State</option>
            <option value="zip">Zip code</option>
          </select>
          {viewportWidth >= 937 && (
            <div className="view-toggle-btn-container">
              {productCardView ? (
                <div
                  className="table-view-btn-container"
                  onClick={() => setProductCardView(false)}
                >
                  <BsList className="table-view-btn" />
                </div>
              ) : (
                <div
                  className="table-view-btn-container"
                  onClick={() => setProductCardView(true)}
                >
                  <RiFileListLine className="card-view-btn" />
                </div>
              )}
            </div>
          )}
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="User Modal"
          overlayClassName={"user-icon-modal-overlay"}
          className={"user-icon-modal"}
        >
          <div className="user-icon-content">
            <div className="user-current-icon-container">
              <h2 className="user-icon-title">Select Icon</h2>
              <UserIconDisplay
                className="user-current-icon"
                control={selectedIcon}
                key="current-user"
              />
            </div>
            <div className="user-icon-choices-container">
              {userIconOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleIconSelect(option.value)}
                >
                  <UserIconDisplay
                    className="icon-options"
                    control={option.value}
                    size="2em"
                  />
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default NavBar;
