import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import FreeAccountDetails from "./FreeAccountDetails";
import IndividualAccountDetails from "./IndividualAccountDetails";
import CommercialAccountDetails from "./CommercialAccountDetails";

import "../stylesheets/SettingsPlans.css";

const SettingsPlans = () => {
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handlePlanView = (key) => {
    setModalContent(key);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const getModalContent = () => {
    switch (modalContent) {
      case "free":
        return (
          <FreeAccountDetails
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
          />
        );
      case "individual":
        return (
          <IndividualAccountDetails
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
          />
        );
      case "commercial":
        return (
          <CommercialAccountDetails
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="account-header">Account Types</h2>
      <div className="account-type-container">
        <div className="free-account-container">
          <div className="account-type-title">
            <b>Free Account</b>
          </div>
          <div className="plan-disc-btn">
            <div className="plan-content">
              Our Free Account is perfect for individuals who are just starting
              out.
            </div>
            <button
              type="button"
              className="plan-details-btn"
              onClick={() => handlePlanView("free")}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="individual-account-container">
          <div className="account-type-title">
            <b>Individual Account</b>{" "}
          </div>
          <div className="plan-disc-btn">
            <div className="plan-content">
              The Individual Account is designed for individuals who want full
              access to our platform.
            </div>
            <button
              type="button"
              className="plan-details-btn"
              onClick={() => handlePlanView("individual")}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="commercial-account-container">
          <div className="account-type-title">
            <b>Commercial Account</b>
          </div>
          <div className="plan-disc-btn">
            <div className="plan-content">
              The Commercial Account is the ideal solution for businesses of all
              sizes.
            </div>
            <button
              type="button"
              className="plan-details-btn"
              onClick={() => handlePlanView("commercial")}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Plan Details"
        className="modal-contents"
        overlayClassName="overlay"
      >
        {getModalContent()}
      </Modal>
    </div>
  );
};

export default SettingsPlans;
