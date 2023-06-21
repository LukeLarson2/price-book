import React from "react";

const CommercialAccountDetails = ({ modalIsOpen, setModalIsOpen }) => {
  const handleCloseModal = () => {
    setModalIsOpen(!modalIsOpen);
  };
  return (
    <div className="description-container">
      <div className="description-title">Commercial Plan</div>
      <div className="description-header">
        $49.99/month
      </div>
      <div className="description-header">
        From startups to enterprises, enhance team collaboration, productivity,
        and manage all aspects of your business seamlessly
      </div>
      <div className="key-features-title">Key Features:</div>
      <ul className="features">
        <li>
          Unlimited access to all features, designed to scale with your
          business.
        </li>
        <li>Priority 24/7 support including phone, email, and live chat</li>
        <li>Administrative tools for user management and access controls</li>
        <li>
          API integrations to connect with other platforms and services your
          company uses
        </li>
        <li>Customizable settings to fit your company's brand and needs</li>
        <li>Employee training resources and dedicated account manager</li>
        <li>
          Enhanced security features including multi-factor authentication, data
          encryption, and compliance tools
        </li>
      </ul>
      <div className="footer-banner">
        Choose the Commercial Account to drive your business forward and maximize
        your team's potential!
      </div>
      <div className="upgrade-cancel-btn-placement">
      <form action="/create-checkout-session-commercial" method="POST">
        <button type="submit" className="upgrade-btn">
          Upgrade
        </button>
        </form>
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

export default CommercialAccountDetails;
