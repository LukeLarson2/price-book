import React from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/EmailSentSuccess.css";

function Modal({ message, setShowModal }) {
  const navigate = useNavigate();

  const handleOkClick = () => {
    setShowModal(false);
    navigate("/login", { replace: true });
  };
  return (
    <div className="email-success-modal">
      <div className="email-success-modal-content">
        <p>{message}</p>
        <button
          className="email-success-modal-btn"
          onClick={() => handleOkClick()}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default Modal;
