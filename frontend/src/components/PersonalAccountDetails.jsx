import React from "react";

const PersonalAccountDetails = ({ modalIsOpen, setModalIsOpen }) => {
  const handleCloseModal = () => {
    setModalIsOpen(!modalIsOpen);
  };
  return (
    <div className="description-container">
      <div className="description-title">Personal Plan</div>
      <div className="description-header">
        Enjoy enhanced features like additional perks and support
      </div>
      <div className="key-features-title">Key Features:</div>
      <ul className="features">
        <li>Full access to all basic and advanced features</li>
        <li>Priority email support for quick problem resolution</li>
        <li>No advertisements for an uninterrupted experience</li>
        <li>Personalized suggestions and insights based on your activity</li>
        <li>Exclusive access to premium resources, webinars and events</li>
        <li>Advanced privacy and security features</li>
      </ul>
      <div className="footer-banner">
        Upgrade to the Personal Account for a complete and personalized
        experience!
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

export default PersonalAccountDetails;
