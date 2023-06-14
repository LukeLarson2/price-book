import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import FreeAccountDetails from "./FreeAccountDetails";
import PersonalAccountDetails from "./PersonalAccountDetails";
import ComanyAccountDetails from "./ComanyAccountDetails";

import "../stylesheets/SettingsPlans.css";

const SettingsPlans = () => {
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const [planView, setPlanView] = useState({
    free: false,
    personal: false,
    company: false,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handlePlanView = (key) => {
    setPlanView((prevPlanView) => ({
      ...prevPlanView,
      [key]: !prevPlanView[key],
    }));
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
      case "personal":
        return (
          <PersonalAccountDetails
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
          />
        );
      case "company":
        return (
          <ComanyAccountDetails
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
        <div className="personal-account-container">
          <div className="account-type-title">
            <b>Personal Account</b>{" "}
          </div>
          <div className="plan-disc-btn">
            <div className="plan-content">
              The Personal Account is designed for individuals who want full
              access to our platform.
            </div>
            <button
              type="button"
              className="plan-details-btn"
              onClick={() => handlePlanView("personal")}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="company-account-container">
          <div className="account-type-title">
            <b>Company Account</b>
          </div>
          <div className="plan-disc-btn">
            <div className="plan-content">
              The Company Account is the ideal solution for businesses of all
              sizes.
            </div>
            <button
              type="button"
              className="plan-details-btn"
              onClick={() => handlePlanView("company")}
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
