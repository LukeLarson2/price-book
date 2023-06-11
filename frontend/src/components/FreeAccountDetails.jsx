import React from "react";

import "../stylesheets/PlanDetails.css";

const FreeAccountDetails = ({ modalIsOpen, setModalIsOpen }) => {
  const handleCloseModal = () => {
    setModalIsOpen(!modalIsOpen);
  };
  return (
    <div className="description-container">
      <div className="description-title">Free Plan</div>
      <div className="description-header">
        Get a taste of what our platform has to offer with no obligations
      </div>
      <div className="key-features-title">Key Features:</div>
      <ul className="features">
        <li>Limited access to basic features</li>
        <li>Access to community support forums</li>
        <li>Ability to interact and network with other users</li>
        <li>
          Weekly newsletters and updates on new features and opportunities
        </li>
        <li>Includes advertisements</li>
      </ul>
      <div className="footer-banner">
        Note: The Free Account is not meant for business use and has limitations
        compared to our premium offerings.
      </div>
      <div className="upgrade-cancel-btn-placement">
        <button type="button" className="upgrade-btn">
          Upgrade
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => handleCloseModal()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FreeAccountDetails;
